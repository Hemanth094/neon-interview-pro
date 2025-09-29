import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Lightbulb } from 'lucide-react';
import TTSPlayer from '@/components/voice/TTSPlayer';
import { Question } from '@/store/slices/interviewSlice';

interface QuestionDisplayProps {
  question: Question;
  currentIndex: number;
  totalQuestions: number;
  timeRemaining: number;
  className?: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
  question,
  currentIndex,
  totalQuestions,
  timeRemaining,
  className = ''
}) => {
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;
  const timePercentage = (timeRemaining / question.timeLimit) * 100;
  
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-accent border-accent/20 bg-accent/10';
      case 'medium': return 'text-primary border-primary/20 bg-primary/10';  
      case 'hard': return 'text-destructive border-destructive/20 bg-destructive/10';
      default: return 'text-muted-foreground border-muted/20 bg-muted/10';
    }
  };

  const getTimeColor = () => {
    if (timePercentage > 50) return 'text-accent';
    if (timePercentage > 20) return 'text-primary';
    return 'text-destructive';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className={`glass-panel ${className}`}>
      <CardContent className="p-6 space-y-6">
        {/* Progress Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="text-primary border-primary/20 bg-primary/10">
                Question {currentIndex + 1} of {totalQuestions}
              </Badge>
              <Badge variant="outline" className={`${getDifficultyColor(question.difficulty)} capitalize`}>
                {question.difficulty}
              </Badge>
              <Badge variant="outline" className="text-muted-foreground border-muted/20 bg-muted/10">
                {question.category}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Interview Progress</span>
              <span className="text-primary font-medium">{progressPercentage.toFixed(0)}%</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>

        {/* Question Content */}
        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="flex-1 space-y-3">
              <h2 className="text-lg font-semibold text-foreground leading-relaxed">
                {question.text}
              </h2>
              
              {/* TTS Player */}
              <div className="flex items-center space-x-3">
                <TTSPlayer 
                  text={question.text}
                  autoPlay={false}
                />
                <span className="text-xs text-muted-foreground">
                  Click to hear the question read aloud
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Timer Section */}
        <div className="p-4 rounded-lg bg-muted/20 border border-muted/20">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Clock className={`h-4 w-4 ${getTimeColor()}`} />
              <span className="text-sm font-medium text-foreground">Time Remaining</span>
            </div>
            <div className={`text-xl font-bold ${getTimeColor()}`}>
              {formatTime(timeRemaining)}
            </div>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={timePercentage} 
              className={`h-2 ${timePercentage <= 20 ? 'animate-pulse' : ''}`}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0:00</span>
              <span>{formatTime(question.timeLimit)}</span>
            </div>
          </div>
          
          {timePercentage <= 30 && (
            <div className="flex items-center space-x-2 mt-3 p-2 rounded-md bg-destructive/10 border border-destructive/20">
              <Lightbulb className="h-4 w-4 text-destructive" />
              <span className="text-sm text-destructive font-medium">
                {timePercentage <= 10 ? 'Time almost up!' : 'Consider wrapping up your answer'}
              </span>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
          <div className="flex items-start space-x-2">
            <Lightbulb className="h-4 w-4 text-accent mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-accent mb-1">Instructions:</p>
              <ul className="space-y-1 text-xs">
                <li>• Take your time to think before answering</li>
                <li>• Use the microphone button to record your response</li>
                <li>• You can review your answer before submitting</li>
                <li>• Speak clearly and provide specific examples when possible</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionDisplay;