import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Glitch effect hook for Page 666 - "Ghost in the Machine"
 * 
 * Features:
 * - Visual glitches: Random character corruption
 * - Color flashes: Dark red background flashes
 * - Audio: Static noise bursts
 * - Progressive horror: Message changes after 10 seconds
 */

const GARBAGE_CHARS = ['#', '@', '?', '§', '¤', '░', '▒', '▓', '█', '╬', '†', '‡', '∞', '◊', '¿'];

// The creepy messages that appear after 10 seconds
const FINAL_MESSAGES = [
  'WHY ARE YOU STILL HERE?',
  '',
  '',
  '',
  '',
  'TURN IT OFF.',
  '',
  '',
  '',
  '',
  'IT SEES YOU',
  '',
  '',
  '',
  '',
  'THERE IS NO ESCAPE',
  '',
  '',
  '',
  '',
  'WE HAVE ALWAYS BEEN HERE',
  '',
  'WAITING',
];

export interface GlitchState {
  isGlitching: boolean;
  glitchedContent: string[] | null;
  isBackgroundFlashing: boolean;
  hasFinalMessage: boolean;
  finalContent: string[];
}

export interface UseGlitchEffectOptions {
  enabled: boolean;
  originalContent: string[];
}

/**
 * Corrupts text by randomly replacing characters with garbage symbols
 */
function corruptText(lines: string[], intensity: number = 0.1): string[] {
  return lines.map(line => {
    return line.split('').map(char => {
      if (char !== ' ' && Math.random() < intensity) {
        return GARBAGE_CHARS[Math.floor(Math.random() * GARBAGE_CHARS.length)];
      }
      return char;
    }).join('');
  });
}

export function useGlitchEffect({ enabled, originalContent }: UseGlitchEffectOptions): GlitchState {
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchedContent, setGlitchedContent] = useState<string[] | null>(null);
  const [isBackgroundFlashing, setIsBackgroundFlashing] = useState(false);
  const [hasFinalMessage, setHasFinalMessage] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const glitchIntervalRef = useRef<number | null>(null);
  const timeIntervalRef = useRef<number | null>(null);

  // Initialize audio
  useEffect(() => {
    if (enabled && !audioRef.current) {
      audioRef.current = new Audio('/static.mp3');
      audioRef.current.volume = 0.5;
      audioRef.current.loop = true;
    }
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [enabled]);

  // Play audio burst
  const playAudioBurst = useCallback((duration: number = 200) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.random() * 2; // Random start position
      audioRef.current.play().catch(() => {
        // Audio play failed (user hasn't interacted with page yet)
      });
      
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.pause();
        }
      }, duration);
    }
  }, []);

  // Trigger a visual glitch
  const triggerGlitch = useCallback(() => {
    if (!enabled) return;
    
    setIsGlitching(true);
    setGlitchedContent(corruptText(originalContent, 0.15 + Math.random() * 0.1));
    
    // Play audio burst with glitch
    playAudioBurst(200);
    
    // Revert after short burst
    setTimeout(() => {
      setIsGlitching(false);
      setGlitchedContent(null);
    }, 100 + Math.random() * 100);
  }, [enabled, originalContent, playAudioBurst]);

  // Trigger background flash
  const triggerFlash = useCallback(() => {
    if (!enabled) return;
    
    setIsBackgroundFlashing(true);
    
    setTimeout(() => {
      setIsBackgroundFlashing(false);
    }, 50);
  }, [enabled]);

  // Main glitch loop
  useEffect(() => {
    if (!enabled) {
      // Reset state when leaving page 666
      setIsGlitching(false);
      setGlitchedContent(null);
      setIsBackgroundFlashing(false);
      setHasFinalMessage(false);
      setTimeOnPage(0);
      
      if (glitchIntervalRef.current) {
        clearInterval(glitchIntervalRef.current);
        glitchIntervalRef.current = null;
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
        timeIntervalRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
      }
      return;
    }

    // Start ambient static audio at lower volume
    if (audioRef.current) {
      audioRef.current.volume = 0.3;
      audioRef.current.play().catch(() => {});
    }

    // Random glitch interval (2-5 seconds)
    const scheduleNextGlitch = () => {
      const delay = 2000 + Math.random() * 3000;
      glitchIntervalRef.current = window.setTimeout(() => {
        triggerGlitch();
        
        // Sometimes also flash
        if (Math.random() < 0.4) {
          setTimeout(triggerFlash, 50);
        }
        
        scheduleNextGlitch();
      }, delay);
    };

    scheduleNextGlitch();

    // Track time on page
    timeIntervalRef.current = window.setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);

    return () => {
      if (glitchIntervalRef.current) {
        clearTimeout(glitchIntervalRef.current);
      }
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [enabled, triggerGlitch, triggerFlash]);

  // Trigger final message after 10 seconds
  useEffect(() => {
    if (enabled && timeOnPage >= 10 && !hasFinalMessage) {
      // Intense glitch before final message
      setIsGlitching(true);
      setGlitchedContent(corruptText(originalContent, 0.5));
      
      if (audioRef.current) {
        audioRef.current.volume = 0.7;
      }
      playAudioBurst(500);
      
      setTimeout(() => {
        setIsGlitching(false);
        setGlitchedContent(null);
        setHasFinalMessage(true);
        
        // Lower audio for creepy silence
        if (audioRef.current) {
          audioRef.current.volume = 0.1;
        }
      }, 500);
    }
  }, [enabled, timeOnPage, hasFinalMessage, originalContent, playAudioBurst]);

  return {
    isGlitching,
    glitchedContent,
    isBackgroundFlashing,
    hasFinalMessage,
    finalContent: FINAL_MESSAGES,
  };
}
