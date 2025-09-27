// Interview start component with question generation
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  Play, 
  FileText, 
  Clock, 
  Brain,
  AlertTriangle,
  CheckCircle,
  Upload
} from 'lucide-react';
import { RootState } from '@/store';
import { startInterview, type Question } from '@/store/slices/interviewSlice';
import { AIService } from '@/services/aiService';
import FuturisticLoader from '@/components/ui/FuturisticLoader';
import { useToast } from '@/hooks/use-toast';

const InterviewStart: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const auth = useSelector((state: RootState) => state.auth);
  const interview = useSelector((state: RootState) => state.interview);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [profileComplete, setProfileComplete] = useState(false);

  const handleStartInterview = async () => {
    if (!profileComplete) {
      toast({
        title: "Profile Incomplete",
        description: "Please complete your profile information first.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      // Generate questions for each difficulty level
      toast({
        title: "Generating Questions",
        description: "AI is creating personalized interview questions for you...",
      });

      const [easyQuestions, mediumQuestions, hardQuestions] = await Promise.all([
        AIService.generateQuestions('easy', 2, resumeText),
        AIService.generateQuestions('medium', 2, resumeText),
        AIService.generateQuestions('hard', 2, resumeText),
      ]);

      const allQuestions: Question[] = [
        ...easyQuestions,
        ...mediumQuestions,
        ...hardQuestions,
      ];

      // Start the interview
      const sessionId = `session_${Date.now()}_${auth.user?.id || 'anonymous'}`;
      const candidateId = auth.user?.id || 'anonymous';

      dispatch(startInterview({
        sessionId,
        candidateId,
        questions: allQuestions,
      }));

      toast({
        title: "Interview Started!",
        description: "Your personalized interview has begun. Good luck!",
      });

      // Navigate to chat interface
      navigate('/interview/chat');
      
    } catch (error) {
      console.error('Error starting interview:', error);
      toast({
        title: "Error",
        description: "Failed to start interview. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCompleteProfile = () => {
    if (!resumeText.trim()) {
      toast({
        title: "Resume Required",
        description: "Please provide your resume or background information.",
        variant: "destructive",
      });
      return;
    }
    
    setProfileComplete(true);
    toast({
      title: "Profile Complete",
      description: "Ready to start your interview!",
    });
  };

  if (isGenerating) {
    return (
      <div className="min-h-[600px] flex items-center justify-center">
        <FuturisticLoader 
          size="lg" 
          message="Generating personalized interview questions..." 
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold gradient-text mb-4">
          AI Interview Assistant
        </h1>
        <p className="text-xl text-muted-foreground">
          Get ready for your personalized Full-Stack Developer interview
        </p>
      </motion.div>

      {/* Profile Setup */}
      {!profileComplete ? (
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Complete Your Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="resume">Resume/Background Information</Label>
                <Textarea
                  id="resume"
                  placeholder="Paste your resume content here or provide a brief background about your experience, skills, and the role you're interviewing for..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="glass-panel min-h-32"
                  rows={8}
                />
                <p className="text-xs text-muted-foreground">
                  This helps the AI generate personalized questions based on your background.
                </p>
              </div>

              <Button 
                onClick={handleCompleteProfile}
                variant="neon"
                disabled={!resumeText.trim()}
                className="w-full"
              >
                Complete Profile
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        /* Interview Overview */
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Interview Details */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Interview Format
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">2</span>
                  </div>
                  <span className="font-medium">Easy Questions</span>
                </div>
                <Badge variant="outline">20s each</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-secondary font-bold text-sm">2</span>
                  </div>
                  <span className="font-medium">Medium Questions</span>
                </div>
                <Badge variant="outline">60s each</Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-destructive/20 flex items-center justify-center">
                    <span className="text-destructive font-bold text-sm">2</span>
                  </div>
                  <span className="font-medium">Hard Questions</span>
                </div>
                <Badge variant="outline">120s each</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="glass-panel">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Important Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Each question has a time limit - answer within the allocated time</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Questions will auto-submit when time runs out</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>AI will provide immediate feedback after each answer</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Final score and detailed summary will be generated at the end</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Be specific and provide examples in your answers</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Start Button */}
      {profileComplete && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <Button
            onClick={handleStartInterview}
            variant="neon"
            size="lg"
            disabled={isGenerating}
            className="min-w-48 hover:scale-105"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Interview
          </Button>
          
          <p className="text-sm text-muted-foreground mt-4">
            Once started, you cannot pause the interview. Make sure you're ready!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default InterviewStart;