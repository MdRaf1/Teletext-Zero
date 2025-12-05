import { useEffect } from 'react';
import type { NavigationActions } from '../hooks/useNavigation';

/**
 * Props for KeyboardNavigationHandler component
 */
export interface KeyboardNavigationHandlerProps {
  addDigit: NavigationActions['addDigit'];
}

/**
 * KeyboardNavigationHandler Component
 * 
 * Listens for keyboard events and filters for numeric keys (0-9).
 * Calls the addDigit action from useNavigation for valid numeric inputs.
 * Ignores non-numeric keys and prevents event bubbling after handling.
 * 
 * Requirements: 3.1, 3.5, 3.6
 */
export function KeyboardNavigationHandler({ addDigit }: KeyboardNavigationHandlerProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Filter for numeric keys (0-9)
      if (/^[0-9]$/.test(event.key)) {
        // Call addDigit action
        addDigit(event.key);
        
        // Prevent event bubbling after handling
        event.preventDefault();
        event.stopPropagation();
      }
      // Ignore non-numeric keys (no action taken)
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [addDigit]);

  // This component doesn't render anything visible
  return null;
}
