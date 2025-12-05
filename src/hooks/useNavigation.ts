import { useState, useCallback } from 'react';

/**
 * Navigation state interface
 */
export interface NavigationState {
  currentPage: number;
  pageBuffer: string;
  isNavigating: boolean;
}

/**
 * Navigation actions interface
 */
export interface NavigationActions {
  addDigit: (digit: string) => void;
  clearBuffer: () => void;
  navigateToPage: (pageNumber: number) => void;
}

/**
 * Custom hook that manages page navigation state and actions
 * Handles the 3-digit page buffer and automatic navigation
 * 
 * @param initialPage - The initial page number (default: 100)
 * @returns Tuple of [NavigationState, NavigationActions]
 */
export function useNavigation(initialPage: number = 100): [NavigationState, NavigationActions] {
  const [currentPage, setCurrentPage] = useState<number>(initialPage);
  const [pageBuffer, setPageBuffer] = useState<string>('');
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Action: Add a digit to the page buffer
  const addDigit = useCallback((digit: string) => {
    // Only accept single numeric digits
    if (!/^[0-9]$/.test(digit)) {
      return;
    }

    setPageBuffer((prevBuffer) => {
      // Only allow up to 3 digits
      if (prevBuffer.length >= 3) {
        return prevBuffer;
      }
      const newBuffer = prevBuffer + digit;
      
      // If buffer reaches 3 digits, trigger navigation
      if (newBuffer.length === 3) {
        const pageNumber = parseInt(newBuffer, 10);
        // Use setTimeout to avoid synchronous state updates
        setTimeout(() => {
          setIsNavigating(true);
          setCurrentPage(pageNumber);
          setPageBuffer('');
          setTimeout(() => {
            setIsNavigating(false);
          }, 0);
        }, 0);
      }
      
      return newBuffer;
    });
  }, []);

  // Action: Clear the page buffer
  const clearBuffer = useCallback(() => {
    setPageBuffer('');
  }, []);

  // Action: Navigate to a specific page
  const navigateToPage = useCallback((pageNumber: number) => {
    setIsNavigating(true);
    setCurrentPage(pageNumber);
    setPageBuffer('');
    
    // Reset navigation flag after a brief moment
    setTimeout(() => {
      setIsNavigating(false);
    }, 0);
  }, []);

  const state: NavigationState = {
    currentPage,
    pageBuffer,
    isNavigating,
  };

  const actions: NavigationActions = {
    addDigit,
    clearBuffer,
    navigateToPage,
  };

  return [state, actions];
}
