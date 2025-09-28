import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, Target, TrendingUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface CandidateSummaryCardProps {
  candidate: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatarUrl?: string;
    overallScore?: number;
    interviewDate: string;
    completedAt?: string;
    totalQuestions: number;
    answeredQuestions: number;
    status: 'completed' | 'in-progress' | 'scheduled';
  };
  onViewDetails: (candidateId: string) => void;
  className?: string;
}

export const CandidateSummaryCard: React.FC<CandidateSummaryCardProps> = ({
  candidate,
  onViewDetails,
  className = ''
}) => {
  const getScoreBadgeVariant = (score?: number) => {
    if (!score) return 'secondary';
    if (score >= 8) return 'default'; // Green
    if (score >= 5) return 'secondary'; // Yellow
    return 'destructive'; // Red
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 8) return 'text-accent glow-accent';
    if (score >= 5) return 'text-primary';
    return 'text-destructive';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-accent border-accent/20 bg-accent/10';
      case 'in-progress':
        return 'text-primary border-primary/20 bg-primary/10';
      case 'scheduled':
        return 'text-muted-foreground border-muted/20 bg-muted/10';
      default:
        return 'text-muted-foreground border-muted/20 bg-muted/10';
    }
  };

  return (
    <Card 
      className={`glass-panel hover-glow-primary cursor-pointer transition-all duration-300 ${className}`}
      onClick={() => onViewDetails(candidate.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 ring-2 ring-primary/20">
              <AvatarImage src={candidate.avatarUrl} alt={candidate.name} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {candidate.name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-semibold text-foreground">
                {candidate.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{candidate.email}</p>
            </div>
          </div>
          
          <Badge 
            variant="outline" 
            className={`${getStatusColor(candidate.status)} capitalize`}
          >
            {candidate.status.replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Score Display */}
        {candidate.overallScore !== undefined && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/20">
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Overall Score</span>
            </div>
            <div className={`text-xl font-bold ${getScoreColor(candidate.overallScore)}`}>
              {candidate.overallScore.toFixed(1)}/10
            </div>
          </div>
        )}

        {/* Progress Display */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-muted/20">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium">Progress</span>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-foreground">
              {candidate.answeredQuestions}/{candidate.totalQuestions}
            </div>
            <div className="text-xs text-muted-foreground">Questions</div>
          </div>
        </div>

        {/* Interview Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Interview Date</p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(candidate.interviewDate), { addSuffix: true })}
              </p>
            </div>
          </div>
          
          {candidate.completedAt && (
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Completed</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(candidate.completedAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t border-muted/20">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(candidate.id);
            }}
            className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            View Detailed Evaluation →
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CandidateSummaryCard;