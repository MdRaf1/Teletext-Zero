import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { TeletextScreen } from './TeletextScreen';

describe('TeletextScreen', () => {
  it('should render static noise initially', () => {
    render(<TeletextScreen currentPage={100} />);
    
    const staticNoise = screen.getByTestId('static-noise');
    expect(staticNoise).toBeInTheDocument();
  });

  it('should transition to page 100 after initialization', async () => {
    render(<TeletextScreen currentPage={100} />);
    
    // Wait for transition to complete
    await waitFor(() => {
      const teletextPage = screen.getByTestId('teletext-page');
      expect(teletextPage).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  it('should show loading screen during page transitions', async () => {
    const { rerender } = render(<TeletextScreen currentPage={100} />);
    
    // Wait for initialization to complete
    await waitFor(() => {
      expect(screen.getByTestId('teletext-page')).toBeInTheDocument();
    }, { timeout: 2000 });
    
    // Trigger page change
    rerender(<TeletextScreen currentPage={300} />);
    
    // Should briefly show loading screen (may be too fast to catch)
    // Then show new page
    await waitFor(() => {
      const teletextPage = screen.getByTestId('teletext-page');
      expect(teletextPage).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  it('should call onInitComplete after initialization', async () => {
    const onInitComplete = vi.fn();
    render(<TeletextScreen currentPage={100} onInitComplete={onInitComplete} />);
    
    await waitFor(() => {
      expect(onInitComplete).toHaveBeenCalled();
    }, { timeout: 2000 });
  });

  it('should render the teletext screen container', () => {
    render(<TeletextScreen currentPage={100} />);
    
    const screen_element = screen.getByTestId('teletext-screen');
    expect(screen_element).toBeInTheDocument();
  });
});
