// Interactive interview chat component with AI integration
import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Send, 
  Clock, 
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { RootState } from '@/store';
import { 
  submitAnswer, 
  updateTimeRemaining,
  setFinalResults
} from '@/store/slices/interviewSlice';
import { AIService } from '@/services/aiService';
import { Question } from '@/store/slices/interviewSlice';
import FuturisticLoader from '@/components/ui/FuturisticLoader';
import { useToast } from '@/hooks/use-toast';

interface ChatMessage {
  id: string;
  type: 'ai' | 'user' | 'system';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const InterviewChat: React.FC = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const interview = useSelector((state: RootState) => state.interview);
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [finalResults, setFinalResultsState] = useState<any>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Current question
  const currentQuestion = interview.questions[interview.currentQuestionIndex];
  const progress = interview.questions.length > 0 ? 
    ((interview.currentQuestionIndex + 1) / interview.questions.length) * 100 : 0;

  // Scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize chat with first question
  useEffect(() => {
    if (currentQuestion && messages.length === 0) {
      addMessage({
        type: 'ai',
        content: `Welcome to your interview! I'll be asking you ${interview.questions.length} questions of varying difficulty. Let's start with question ${interview.currentQuestionIndex + 1}:`,
      });
      
      setTimeout(() => {
        addMessage({
          type: 'ai',
          content: currentQuestion.text,
        });
      }, 1500);
    }
  }, [currentQuestion, messages.length]);

  // Timer management
  useEffect(() => {
    if (interview.isActive && interview.timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        const newTime = interview.timeRemaining - 1;
        dispatch(updateTimeRemaining(newTime));
        
        if (newTime <= 0) {
          handleAutoSubmit();
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interview.isActive, interview.timeRemaining]);

  // Handle completion
  useEffect(() => {
    if (interview.isCompleted && !showResults) {
      handleInterviewComplete();
    }
  }, [interview.isCompleted, showResults]);

  const addMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...message,
      id: `msg_${Date.now()}_${Math.random()}`,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSubmitAnswer = async () => {
    if (!currentAnswer.trim()) {
      toast({
        title: "Empty Answer",
        description: "Please provide an answer before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Add user message
    addMessage({
      type: 'user',
      content: currentAnswer,
    });

    // Add loading message
    addMessage({
      type: 'system',
      content: 'Analyzing your answer...',
      isTyping: true,
    });

    try {
      const timeSpent = currentQuestion.timeLimit - interview.timeRemaining;
      
      // Evaluate answer with AI
      const evaluation = await AIService.evaluateAnswer(
        currentQuestion.text,
        currentAnswer,
        currentQuestion.difficulty,
        timeSpent
      );

      // Submit answer to store
      dispatch(submitAnswer({
        questionId: currentQuestion.id,
        text: currentAnswer,
        submittedAt: new Date().toISOString(),
        timeSpent,
        score: evaluation.score,
      }));

      // Remove loading message and add feedback
      setMessages(prev => prev.filter(msg => !msg.isTyping));
      
      addMessage({
        type: 'ai',
        content: `Great! I've evaluated your answer. Score: ${evaluation.score}/10. ${evaluation.feedback}`,
      });

      // Move to next question or complete
      if (interview.currentQuestionIndex < interview.questions.length - 1) {
        setTimeout(() => {
          const nextQuestion = interview.questions[interview.currentQuestionIndex + 1];
          addMessage({
            type: 'ai',
            content: `Let's move to question ${interview.currentQuestionIndex + 2}:`,
          });
          
          setTimeout(() => {
            addMessage({
              type: 'ai',
              content: nextQuestion.text,
            });
          }, 1500);
        }, 2000);
      }

      setCurrentAnswer('');
    } catch (error) {
      console.error('Error submitting answer:', error);
      toast({
        title: "Submission Error",
        description: "Failed to submit your answer. Please try again.",
        variant: "destructive",
      });
      
      setMessages(prev => prev.filter(msg => !msg.isTyping));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutoSubmit = async () => {
    if (!currentAnswer.trim()) {
      addMessage({
        type: 'system',
        content: 'Time\'s up! Since no answer was provided, we\'ll move to the next question.',
      });
      
      // Submit empty answer
      dispatch(submitAnswer({
        questionId: currentQuestion.id,
        text: '',
        submittedAt: new Date().toISOString(),
        timeSpent: currentQuestion.timeLimit,
        score: 0,
      }));
    } else {
      await handleSubmitAnswer();
    }
  };

  const handleInterviewComplete = async () => {
    setShowResults(true);
    
    addMessage({
      type: 'ai',
      content: 'Congratulations! You\'ve completed all questions. I\'m now generating your detailed results...',
    });

    try {
      const results = await AIService.generateSummary(
        interview.answers.map(answer => {
          const question = interview.questions.find(q => q.id === answer.questionId);
          return {
            questionText: question?.text || '',
            answerText: answer.text,
            difficulty: question?.difficulty || 'easy',
            score: answer.score,
            timeSpent: answer.timeSpent,
          };
        })
      );

      setFinalResultsState(results);
      
      dispatch(setFinalResults({
        score: results.overallScore,
        summary: results.summary,
      }));

      addMessage({
        type: 'ai',
        content: `Your interview is complete! Overall Score: ${results.overallScore}/10`,
      });
    } catch (error) {
      console.error('Error generating results:', error);
      toast({
        title: "Results Error",
        description: "Failed to generate results. Please refresh and try again.",
        variant: "destructive",
      });
    }
  };

  const getTimerColor = () => {
    const percentage = (interview.timeRemaining / currentQuestion?.timeLimit) * 100;
    if (percentage > 50) return 'text-green-400';
    if (percentage > 25) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!interview.isActive && !interview.isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <FuturisticLoader message="Loading interview..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header with progress */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-panel p-6 rounded-2xl border border-border/50"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <img 
                src="/favicon.svg" 
                alt="Crisp AI Logo" 
                className="h-6 w-6" 
              />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">AI Interview Session</h2>
              <p className="text-muted-foreground">Question {interview.currentQuestionIndex + 1} of {interview.questions.length}</p>
            </div>
          </div>
          
          {!interview.isCompleted && (
            <div className="text-center">
              <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
                {formatTime(interview.timeRemaining)}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentQuestion?.difficulty.toUpperCase()}
              </div>
            </div>
          )}
        </div>
        
        <Progress value={progress} className="h-2" />
      </motion.div>

      {/* Chat Messages */}
      <div className="glass-panel p-6 rounded-2xl border border-border/50">
        <div className="h-96 overflow-y-auto space-y-4 mb-4">
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] p-4 rounded-2xl ${
                  message.type === 'ai' 
                    ? 'bg-primary/20 border border-primary/30 text-primary-foreground' 
                    : message.type === 'user'
                    ? 'bg-secondary/20 border border-secondary/30 text-secondary-foreground'
                    : 'bg-muted/20 border border-muted text-muted-foreground'
                }`}>
                  <div className="flex items-start gap-3">
                    {message.type === 'ai' && (
                      <div className="p-1 rounded bg-primary/30">
                        {message.isTyping ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="h-4 w-4" />
                          </motion.div>
                        ) : (
                          <img 
                            src="/favicon.svg" 
                            alt="Crisp AI Logo" 
                            className="h-4 w-4" 
                          />
                        )}
                      </div>
                    )}
                    {message.type === 'user' && (
                      <MessageCircle className="h-5 w-5 mt-0.5 text-secondary" />
                    )}
                    {message.type === 'system' && (
                      <AlertCircle className="h-5 w-5 mt-0.5 text-muted-foreground" />
                    )}
                    
                    <div className="flex-1">
                      <p className="text-sm">{message.content}</p>
                      <div className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        {!interview.isCompleted && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-4"
          >
            <Textarea
              placeholder="Type your answer here..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              className="glass-panel border-border/50 resize-none"
              rows={4}
              disabled={isSubmitting}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  {currentQuestion?.category}
                </Badge>
                <Badge variant={
                  currentQuestion?.difficulty === 'easy' ? 'default' :
                  currentQuestion?.difficulty === 'medium' ? 'secondary' : 'destructive'
                }>
                  {currentQuestion?.difficulty}
                </Badge>
              </div>
              
              <Button
                onClick={handleSubmitAnswer}
                disabled={isSubmitting || !currentAnswer.trim()}
                variant="neon"
                className="min-w-32"
              >
                {isSubmitting ? (
                  <FuturisticLoader size="sm" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Submit Answer
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Results Summary */}
        {showResults && finalResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-6 glass-panel rounded-2xl border border-primary/30"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6 text-green-400" />
                <h3 className="text-xl font-bold gradient-text">Interview Complete!</h3>
              </div>
              <div className="text-3xl font-bold text-primary mb-2">
                {finalResults.overallScore}/10
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-green-400 mb-2">Strengths</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {finalResults.strengths.map((strength: string, index: number) => (
                    <li key={index}>• {strength}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-yellow-400 mb-2">Areas for Improvement</h4>
                <ul className="space-y-1 text-muted-foreground">
                  {finalResults.improvements.map((improvement: string, index: number) => (
                    <li key={index}>• {improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted/20 rounded-lg">
              <p className="text-sm text-muted-foreground">{finalResults.summary}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default InterviewChat;