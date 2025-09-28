import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Square } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface SpeechRecognitionEvent extends Event {
  readonly resultIndex: number;
  readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  readonly error: string;
  readonly message: string;
}

interface SpeechRecognitionResult {
  readonly isFinal: boolean;
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare const SpeechRecognition: {
  prototype: SpeechRecognition;
  new (): SpeechRecognition;
};

interface MicRecorderButtonProps {
  onTranscriptChange: (transcript: string) => void;
  onRecordingComplete: (transcript: string) => void;
  disabled?: boolean;
  className?: string;
}

export const MicRecorderButton: React.FC<MicRecorderButtonProps> = ({
  onTranscriptChange,
  onRecordingComplete,
  disabled = false,
  className = ''
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech recognition is supported
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Speech Recognition Not Supported",
        description: "Your browser doesn't support speech recognition. Please type your answer instead.",
        variant: "destructive"
      });
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      const currentTranscript = transcript + finalTranscript;
      const displayTranscript = currentTranscript + interimTranscript;
      
      if (finalTranscript) {
        setTranscript(currentTranscript);
      }
      
      onTranscriptChange(displayTranscript);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      if (event.error === 'no-speech') {
        toast({
          title: "No Speech Detected",
          description: "Please speak clearly into your microphone.",
          variant: "destructive"
        });
      } else if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to record your answer.",
          variant: "destructive"
        });
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      if (isRecording) {
        recognition.start();
      }
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isRecording, transcript, onTranscriptChange, toast]);

  const startRecording = async () => {
    try {
      // Request microphone permission
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      setIsRecording(true);
      setTranscript('');
      onTranscriptChange('');
      
      if (recognitionRef.current && !isListening) {
        recognitionRef.current.start();
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        title: "Recording Error",
        description: "Unable to access microphone. Please check your permissions.",
        variant: "destructive"
      });
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    
    setTimeout(() => {
      onRecordingComplete(transcript);
    }, 500);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Button
        onClick={isRecording ? stopRecording : startRecording}
        disabled={disabled}
        size="lg"
        className={`
          relative h-20 w-20 rounded-full border-2 transition-all duration-300
          ${isRecording 
            ? 'bg-destructive hover:bg-destructive/90 border-destructive glow-pulse' 
            : 'bg-primary hover:bg-primary/90 border-primary hover-glow-primary'
          }
          ${className}
        `}
      >
        {isRecording ? (
          <Square className="h-8 w-8" />
        ) : (
          <Mic className="h-8 w-8" />
        )}
        
        {/* Pulsing animation while recording */}
        {isRecording && (
          <>
            <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
            <div className="absolute inset-0 rounded-full bg-destructive/10 animate-pulse" />
          </>
        )}
      </Button>
      
      <div className="text-center">
        {isRecording ? (
          <div className="space-y-1">
            <p className="text-sm text-accent font-medium">Recording...</p>
            <div className="flex items-center justify-center space-x-1">
              <div className="h-1 w-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="h-1 w-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="h-1 w-1 bg-accent rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            {disabled ? 'Recording disabled' : 'Click to start recording'}
          </p>
        )}
      </div>
    </div>
  );
};

declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

export default MicRecorderButton;