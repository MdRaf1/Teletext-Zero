import { describe, it, expect } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { useNavigation } from './useNavigation';

/**
 * Feature: teletext-rendering-engine, Property 6: Navigation Buffer State Machine
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4
 * 
 * For any sequence of numeric key presses, the page buffer shall correctly
 * accumulate digits (displaying "1..", "10.", "123"), trigger navigation when
 * the third digit is entered, and clear the buffer after navigation completes.
 */
describe('Property 6: Navigation Buffer State Machine', () => {
  it('should accumulate digits correctly for any sequence of 1-2 numeric inputs', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 2 }),
        (digits) => {
          const { result } = renderHook(() => useNavigation(100));
          const [, actions] = result.current;
          
          // Add each digit
          act(() => {
            digits.forEach(digit => actions.addDigit(digit.toString()));
          });
          
          const [state] = result.current;
          const expectedBuffer = digits.join('');
          
          // Buffer should contain the accumulated digits
          expect(state.pageBuffer).toBe(expectedBuffer);
          expect(state.pageBuffer.length).toBe(digits.length);
          
          // Should not have triggered navigation yet
          expect(state.currentPage).toBe(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should trigger navigation automatically when buffer reaches 3 digits', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.integer({ min: 100, max: 999 }),
        async (pageNumber) => {
          const { result } = renderHook(() => useNavigation(100));
          const [, actions] = result.current;
          
          const digits = pageNumber.toString().split('');
          
          // Add all three digits
          act(() => {
            digits.forEach(digit => actions.addDigit(digit));
          });
          
          // Wait for async state updates
          await waitFor(() => {
            const [state] = result.current;
            expect(state.currentPage).toBe(pageNumber);
            expect(state.pageBuffer).toBe('');
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should clear buffer when clearBuffer action is called', () => {
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 2 }),
        (digits) => {
          const { result } = renderHook(() => useNavigation(100));
          const [, actions] = result.current;
          
          // Add digits to buffer
          act(() => {
            digits.forEach(digit => actions.addDigit(digit.toString()));
          });
          
          // Clear the buffer
          act(() => {
            actions.clearBuffer();
          });
          
          const [state] = result.current;
          
          // Buffer should be empty
          expect(state.pageBuffer).toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should ignore non-numeric inputs', () => {
    fc.assert(
      fc.property(
        fc.array(fc.oneof(
          fc.string({ minLength: 1, maxLength: 1 }).filter(s => !/^[0-9]$/.test(s)),
          fc.string({ minLength: 2, maxLength: 5 })
        ), { minLength: 1, maxLength: 10 }),
        (nonNumericInputs) => {
          const { result } = renderHook(() => useNavigation(100));
          const [, actions] = result.current;
          
          // Try to add non-numeric inputs
          act(() => {
            nonNumericInputs.forEach(input => actions.addDigit(input));
          });
          
          const [state] = result.current;
          
          // Buffer should remain empty
          expect(state.pageBuffer).toBe('');
          
          // Page should not have changed
          expect(state.currentPage).toBe(100);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should not accept more than 3 digits in buffer', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 4, maxLength: 10 }),
        async (digits) => {
          const { result } = renderHook(() => useNavigation(100));
          const [, actions] = result.current;
          
          // Try to add more than 3 digits
          // First 3 should trigger navigation, rest should be ignored
          act(() => {
            digits.forEach(digit => actions.addDigit(digit.toString()));
          });
          
          // Wait for async state updates
          await waitFor(() => {
            const [state] = result.current;
            const expectedPage = parseInt(digits.slice(0, 3).join(''), 10);
            expect(state.currentPage).toBe(expectedPage);
            expect(state.pageBuffer).toBe('');
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle mixed sequences of numeric and non-numeric inputs', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.oneof(
          fc.integer({ min: 0, max: 9 }).map(n => ({ type: 'digit', value: n.toString() })),
          fc.string({ minLength: 1, maxLength: 1 })
            .filter(s => !/^[0-9]$/.test(s))
            .map(s => ({ type: 'non-digit', value: s }))
        ), { minLength: 1, maxLength: 10 }),
        async (inputs) => {
          const { result } = renderHook(() => useNavigation(100));
          const [, actions] = result.current;
          
          // Add all inputs
          act(() => {
            inputs.forEach(input => actions.addDigit(input.value));
          });
          
          // Count only the numeric digits
          const numericDigits = inputs
            .filter(input => input.type === 'digit')
            .map(input => input.value);
          
          if (numericDigits.length < 3) {
            // Buffer should contain only the numeric digits
            const [state] = result.current;
            expect(state.pageBuffer).toBe(numericDigits.join(''));
            expect(state.currentPage).toBe(100);
          } else {
            // Should have navigated using first 3 numeric digits
            await waitFor(() => {
              const [state] = result.current;
              const expectedPage = parseInt(numericDigits.slice(0, 3).join(''), 10);
              expect(state.currentPage).toBe(expectedPage);
              expect(state.pageBuffer).toBe('');
            });
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain correct state through multiple navigation cycles', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.array(fc.integer({ min: 100, max: 999 }), { minLength: 1, maxLength: 5 }),
        async (pageNumbers) => {
          const { result } = renderHook(() => useNavigation(100));
          const [, actions] = result.current;
          
          // Navigate to each page in sequence
          for (const pageNumber of pageNumbers) {
            const digits = pageNumber.toString().split('');
            
            act(() => {
              digits.forEach(digit => actions.addDigit(digit));
            });
            
            // Wait for navigation to complete
            await waitFor(() => {
              const [state] = result.current;
              expect(state.pageBuffer).toBe('');
            });
          }
          
          const [state] = result.current;
          
          // Should be on the last page
          expect(state.currentPage).toBe(pageNumbers[pageNumbers.length - 1]);
          
          // Buffer should be empty
          expect(state.pageBuffer).toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle navigateToPage action directly', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 999 }),
        (pageNumber) => {
          const { result } = renderHook(() => useNavigation(100));
          const [, actions] = result.current;
          
          // Navigate directly to page
          act(() => {
            actions.navigateToPage(pageNumber);
          });
          
          const [state] = result.current;
          
          // Should be on the specified page
          expect(state.currentPage).toBe(pageNumber);
          
          // Buffer should be empty
          expect(state.pageBuffer).toBe('');
        }
      ),
      { numRuns: 100 }
    );
  });
});
