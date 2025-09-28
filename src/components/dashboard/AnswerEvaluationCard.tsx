import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MessageCircle, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Lightbulb,
  Star
} from 'lucide-react';

interface AnswerEvaluationCardProps {
  evaluation: {
    questionId: string;
    questionText: string;
    answerText: string;
    score: number;
    feedback: string;
    improvementTips?: string[];
    strengths?: string[];
    timeSpent: number;
    timeLimit: number;
    difficulty: 'easy' | 'medium' | 'hard';
  };
  onViewFullAnswer?: (questionId: string) => void;
  className?: string;
}

export const AnswerEvaluationCard: React.FC<AnswerEvaluationCardProps> = ({
  evaluation,
  onViewFullAnswer,
  className = ''
}) => {
  const getScoreBadge = (score: number) => {
    if (score >= 8) return { variant: 'default' as const, color: 'text-accent', glow: 'glow-accent' };
    if (score >= 5) return { variant: 'secondary' as const, color: 'text-primary', glow: 'glow-primary' };
    return { variant: 'destructive' as const, color: 'text-destructive', glow: '' };
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-accent border-accent/20 bg-accent/10';
      case 'medium': return 'text-primary border-primary/20 bg-primary/10';
      case 'hard': return 'text-destructive border-destructive/20 bg-destructive/10';
      default: return 'text-muted-foreground border-muted/20 bg-muted/10';
    }
  };

  const scoreInfo = getScoreBadge(evaluation.score);
  const timePercentage = (evaluation.timeSpent / evaluation.timeLimit) * 100;

  return (
    <Card className={`glass-panel hover-glow-primary transition-all duration-300 ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between space-x-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base font-semibold text-foreground line-clamp-2 mb-2">
              {evaluation.questionText}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className={`${getDifficultyColor(evaluation.difficulty)} text-xs capitalize`}>
                {evaluation.difficulty}
              </Badge>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{evaluation.timeSpent}s / {evaluation.timeLimit}s</span>
              </div>
            </div>
          </div>
          
          <div className={`text-right ${scoreInfo.glow}`}>
            <div className={`text-2xl font-bold ${scoreInfo.color}`}>
              {evaluation.score.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">out of 10</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Answer Preview */}
        <div className="p-3 rounded-lg bg-muted/20 border border-muted/20">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground">Candidate's Answer</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {evaluation.answerText}
          </p>
          {onViewFullAnswer && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onViewFullAnswer(evaluation.questionId)}
              className="mt-2 h-auto p-0 text-xs text-primary hover:text-primary/80"
            >
              Read full answer →
            </Button>
          )}
        </div>

        {/* Time Analysis */}
        <div className="p-3 rounded-lg bg-muted/20 border border-muted/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Time Management</span>
            </div>
            <span className={`text-xs font-semibold ${
              timePercentage <= 80 ? 'text-accent' : timePercentage <= 100 ? 'text-primary' : 'text-destructive'
            }`}>
              {timePercentage.toFixed(0)}%
            </span>
          </div>
          <div className="w-full bg-muted/40 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                timePercentage <= 80 ? 'bg-accent' : timePercentage <= 100 ? 'bg-primary' : 'bg-destructive'
              }`}
              style={{ width: `${Math.min(timePercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* AI Feedback */}
        <div className="p-3 rounded-lg bg-muted/20 border border-muted/20">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-foreground">AI Evaluation</span>
          </div>
          <p className="text-sm text-muted-foreground">
            {evaluation.feedback}
          </p>
        </div>

        {/* Strengths */}
        {evaluation.strengths && evaluation.strengths.length > 0 && (
          <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Strengths</span>
            </div>
            <ul className="space-y-1">
              {evaluation.strengths.map((strength, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <CheckCircle className="h-3 w-3 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{strength}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Improvement Tips */}
        {evaluation.improvementTips && evaluation.improvementTips.length > 0 && (
          <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
            <div className="flex items-center space-x-2 mb-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Improvement Tips</span>
            </div>
            <ul className="space-y-1">
              {evaluation.improvementTips.map((tip, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <AlertCircle className="h-3 w-3 text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AnswerEvaluationCard;