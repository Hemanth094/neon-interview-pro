import React from 'react';
import { Card } from '@/components/ui/card';
import { Mic, CheckCircle } from 'lucide-react';

interface TranscriptPreviewProps {
  transcript: string;
  isRecording: boolean;
  isComplete?: boolean;
  className?: string;
}

export const TranscriptPreview: React.FC<TranscriptPreviewProps> = ({
  transcript,
  isRecording,
  isComplete = false,
  className = ''
}) => {
  return (
    <Card className={`glass-panel p-4 min-h-[120px] ${className}`}>
      <div className="flex items-start space-x-3">
        <div className={`
          flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
          ${isRecording 
            ? 'bg-destructive/20 text-destructive animate-pulse' 
            : isComplete 
              ? 'bg-accent/20 text-accent' 
              : 'bg-muted/20 text-muted-foreground'
          }
        `}>
          {isComplete ? (
            <CheckCircle className="h-4 w-4" />
          ) : (
            <Mic className="h-4 w-4" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-foreground">
              {isRecording ? 'Recording in progress...' : isComplete ? 'Answer recorded' : 'Your answer will appear here'}
            </h4>
            {isRecording && (
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-destructive rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1 h-1 bg-destructive rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1 h-1 bg-destructive rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>
          
          <div className={`
            text-sm leading-relaxed transition-all duration-200
            ${transcript 
              ? 'text-foreground' 
              : 'text-muted-foreground italic'
            }
          `}>
            {transcript || 'Start speaking to see your words transcribed in real-time...'}
          </div>
          
          {transcript && (
            <div className="mt-3 text-xs text-muted-foreground">
              Word count: {transcript.trim().split(/\s+/).filter(word => word.length > 0).length}
            </div>
          )}
        </div>
      </div>
      
      {/* Subtle border glow effect while recording */}
      {isRecording && (
        <div className="absolute inset-0 rounded-lg border border-destructive/30 animate-pulse pointer-events-none" />
      )}
      
      {/* Success border when complete */}
      {isComplete && transcript && (
        <div className="absolute inset-0 rounded-lg border border-accent/30 pointer-events-none" />
      )}
    </Card>
  );
};

export default TranscriptPreview;