import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface TTSPlayerProps {
  text: string;
  autoPlay?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  className?: string;
}

export const TTSPlayer: React.FC<TTSPlayerProps> = ({
  text,
  autoPlay = false,
  onStart,
  onEnd,
  className = ''
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      toast({
        title: "Text-to-Speech Not Supported",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
      return;
    }

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Get available voices and prefer English ones
    const setVoice = () => {
      const voices = speechSynthesis.getVoices();
      const englishVoices = voices.filter(voice => voice.lang.startsWith('en'));
      if (englishVoices.length > 0) {
        // Prefer female voices for a more professional sound
        const preferredVoice = englishVoices.find(voice => 
          voice.name.toLowerCase().includes('female') || 
          voice.name.toLowerCase().includes('samantha') ||
          voice.name.toLowerCase().includes('susan')
        ) || englishVoices[0];
        utterance.voice = preferredVoice;
      }
    };

    // Set voice immediately if voices are loaded
    if (speechSynthesis.getVoices().length > 0) {
      setVoice();
    } else {
      // Wait for voices to load
      speechSynthesis.onvoiceschanged = setVoice;
    }

    utterance.onstart = () => {
      setIsPlaying(true);
      onStart?.();
    };

    utterance.onend = () => {
      setIsPlaying(false);
      onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('TTS error:', event.error);
      setIsPlaying(false);
      toast({
        title: "Playback Error",
        description: "Unable to play the text. Please try again.",
        variant: "destructive"
      });
    };

    utteranceRef.current = utterance;

    // Auto-play if requested
    if (autoPlay) {
      setTimeout(() => {
        play();
      }, 500);
    }

    return () => {
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    };
  }, [text, autoPlay, onStart, onEnd, toast]);

  const play = () => {
    if (!isSupported || !utteranceRef.current) return;
    
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    
    speechSynthesis.speak(utteranceRef.current);
  };

  const pause = () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  const toggle = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      onClick={toggle}
      variant="outline"
      size="sm"
      className={`
        relative bg-glass border-glass text-accent hover:bg-accent/10 
        hover:border-accent/50 transition-all duration-300
        ${isPlaying ? 'glow-accent animate-pulse' : ''}
        ${className}
      `}
    >
      <Volume2 className="h-4 w-4 mr-2" />
      {isPlaying ? (
        <>
          <Pause className="h-4 w-4 mr-1" />
          Playing
        </>
      ) : (
        <>
          <Play className="h-4 w-4 mr-1" />
          Listen
        </>
      )}
      
      {isPlaying && (
        <div className="absolute inset-0 rounded-md bg-accent/10 animate-pulse" />
      )}
    </Button>
  );
};

export default TTSPlayer;