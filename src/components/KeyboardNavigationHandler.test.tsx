import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { KeyboardNavigationHandler } from './KeyboardNavigationHandler';

describe('KeyboardNavigationHandler Component', () => {
  it('calls addDigit when numeric key is pressed', () => {
    const addDigit = vi.fn();
    render(<KeyboardNavigationHandler addDigit={addDigit} />);
    
    // Simulate numeric key press
    const event = new KeyboardEvent('keydown', { key: '5' });
    window.dispatchEvent(event);
    
    expect(addDigit).toHaveBeenCalledWith('5');
    expect(addDigit).toHaveBeenCalledTimes(1);
  });

  it('calls addDigit for all numeric keys 0-9', () => {
    const addDigit = vi.fn();
    render(<KeyboardNavigationHandler addDigit={addDigit} />);
    
    // Test all numeric keys
    for (let i = 0; i <= 9; i++) {
      const event = new KeyboardEvent('keydown', { key: i.toString() });
      window.dispatchEvent(event);
    }
    
    expect(addDigit).toHaveBeenCalledTimes(10);
  });

  it('ignores non-numeric keys', () => {
    const addDigit = vi.fn();
    render(<KeyboardNavigationHandler addDigit={addDigit} />);
    
    // Simulate non-numeric key presses
    const keys = ['a', 'b', 'Enter', 'Escape', 'ArrowUp', ' ', 'Tab'];
    keys.forEach(key => {
      const event = new KeyboardEvent('keydown', { key });
      window.dispatchEvent(event);
    });
    
    expect(addDigit).not.toHaveBeenCalled();
  });

  it('cleans up event listener on unmount', () => {
    const addDigit = vi.fn();
    const { unmount } = render(<KeyboardNavigationHandler addDigit={addDigit} />);
    
    // Unmount the component
    unmount();
    
    // Try to trigger event after unmount
    const event = new KeyboardEvent('keydown', { key: '5' });
    window.dispatchEvent(event);
    
    // Should not have been called
    expect(addDigit).not.toHaveBeenCalled();
  });

  it('renders nothing visible', () => {
    const addDigit = vi.fn();
    const { container } = render(<KeyboardNavigationHandler addDigit={addDigit} />);
    
    expect(container.firstChild).toBeNull();
  });
});
