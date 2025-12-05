import { useEffect, useMemo } from 'react';
import { GRID } from '../constants';
import type { TeletextColor } from '../constants/colors';
import './StaticNoise.css';

export interface StaticNoiseProps {
  duration?: number;
  onComplete?: () => void;
}

/**
 * StaticNoise component - renders a random character pattern to simulate TV static
 * Uses only black and white colors from the teletext palette
 * Fills the entire 40x24 grid
 */
export function StaticNoise({ duration = 1000, onComplete }: StaticNoiseProps) {
  // Generate random static pattern
  const staticPattern = useMemo(() => {
    const pattern: Array<{ char: string; color: TeletextColor }> = [];
    const chars = ['█', '▓', '▒', '░', ' ', '▪', '▫', '■', '□'];
    const colors: TeletextColor[] = ['black', 'white'];
    
    // Fill entire 40x24 grid
    for (let row = 0; row < GRID.ROWS; row++) {
      for (let col = 0; col < GRID.COLUMNS; col++) {
        const randomChar = chars[Math.floor(Math.random() * chars.length)];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        pattern.push({ char: randomChar, color: randomColor });
      }
    }
    
    return pattern;
  }, []);

  // Trigger callback after duration
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  // Render the static pattern in a 40x24 grid
  return (
    <div className="static-noise" data-testid="static-noise">
      {Array.from({ length: GRID.ROWS }, (_, row) => (
        <div key={row} className="static-noise-line">
          {Array.from({ length: GRID.COLUMNS }, (_, col) => {
            const index = row * GRID.COLUMNS + col;
            const { char, color } = staticPattern[index];
            return (
              <span key={col} className={`teletext-${color}`}>
                {char}
              </span>
            );
          })}
        </div>
      ))}
    </div>
  );
}
