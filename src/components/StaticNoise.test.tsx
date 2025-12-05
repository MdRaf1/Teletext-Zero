import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { StaticNoise } from './StaticNoise';
import { GRID } from '../constants';

describe('StaticNoise Component', () => {
  it('renders with correct test id', () => {
    render(<StaticNoise />);
    const staticNoise = screen.getByTestId('static-noise');
    expect(staticNoise).toBeDefined();
  });

  it('generates a random pattern', () => {
    const { container: container1 } = render(<StaticNoise />);
    const { container: container2 } = render(<StaticNoise />);
    
    // Two separate renders should produce different patterns (with very high probability)
    const content1 = container1.textContent;
    const content2 = container2.textContent;
    
    // They should be different (random generation)
    expect(content1).not.toBe(content2);
  });

  it('uses only black and white colors', () => {
    const { container } = render(<StaticNoise />);
    const spans = container.querySelectorAll('span');
    
    spans.forEach(span => {
      const className = span.className;
      // Should only have teletext-black or teletext-white classes
      expect(
        className === 'teletext-black' || className === 'teletext-white'
      ).toBe(true);
    });
  });

  it('fills entire 40x24 grid', () => {
    const { container } = render(<StaticNoise />);
    
    // Count the number of lines (rows)
    const lines = container.querySelectorAll('.static-noise-line');
    expect(lines.length).toBe(GRID.ROWS);
    
    // Count total characters (should be 40 * 24 = 960)
    const spans = container.querySelectorAll('span');
    expect(spans.length).toBe(GRID.ROWS * GRID.COLUMNS);
  });

  it('each row has exactly 40 characters', () => {
    const { container } = render(<StaticNoise />);
    const lines = container.querySelectorAll('.static-noise-line');
    
    lines.forEach(line => {
      const spans = line.querySelectorAll('span');
      expect(spans.length).toBe(GRID.COLUMNS);
    });
  });

  it('triggers callback after default duration', async () => {
    const onComplete = vi.fn();
    render(<StaticNoise onComplete={onComplete} />);
    
    // Should not be called immediately
    expect(onComplete).not.toHaveBeenCalled();
    
    // Should be called after 1000ms (default duration)
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    }, { timeout: 1500 });
  });

  it('triggers callback after custom duration', async () => {
    const onComplete = vi.fn();
    render(<StaticNoise duration={500} onComplete={onComplete} />);
    
    // Should not be called immediately
    expect(onComplete).not.toHaveBeenCalled();
    
    // Should be called after 500ms
    await waitFor(() => {
      expect(onComplete).toHaveBeenCalledTimes(1);
    }, { timeout: 1000 });
  });

  it('does not crash when no callback is provided', () => {
    expect(() => {
      render(<StaticNoise />);
    }).not.toThrow();
  });

  it('cleans up timer on unmount', () => {
    const onComplete = vi.fn();
    const { unmount } = render(<StaticNoise duration={1000} onComplete={onComplete} />);
    
    // Unmount before duration completes
    unmount();
    
    // Wait to ensure callback is not called
    setTimeout(() => {
      expect(onComplete).not.toHaveBeenCalled();
    }, 1500);
  });
});
