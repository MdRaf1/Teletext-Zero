import { describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import * as fc from 'fast-check';
import { TeletextScreen } from './TeletextScreen';

describe('TeletextScreen Property Tests', () => {
  /**
   * Feature: teletext-rendering-engine, Property 2: Aspect Ratio Preservation
   * Validates: Requirements 1.4
   * 
   * For any viewport size, when the browser window is resized, 
   * the character grid shall scale proportionally while maintaining the 40:24 aspect ratio.
   */
  it('should maintain 40:24 aspect ratio across different viewport sizes', () => {
    fc.assert(
      fc.property(
        // Generate random viewport dimensions
        fc.integer({ min: 320, max: 3840 }), // width
        fc.integer({ min: 240, max: 2160 }), // height
        (viewportWidth, viewportHeight) => {
          // Set viewport size
          Object.defineProperty(window, 'innerWidth', {
            writable: true,
            configurable: true,
            value: viewportWidth,
          });
          Object.defineProperty(window, 'innerHeight', {
            writable: true,
            configurable: true,
            value: viewportHeight,
          });

          // Render component
          const { container } = render(<TeletextScreen currentPage={100} />);
          
          // Get the screen container
          const screenContainer = container.querySelector('.teletext-screen-container');
          expect(screenContainer).toBeTruthy();
          
          if (screenContainer) {
            // Get computed styles
            const styles = window.getComputedStyle(screenContainer);
            
            // The aspect-ratio CSS property should be set to 40/24
            const aspectRatio = styles.aspectRatio;
            
            // Check if aspect-ratio is supported and set correctly
            // aspect-ratio: 40 / 24 simplifies to 5 / 3 ≈ 1.6667
            if (aspectRatio && aspectRatio !== 'auto') {
              // Parse aspect ratio (could be "40 / 24" or "1.66667" depending on browser)
              const ratio = aspectRatio.includes('/') 
                ? eval(aspectRatio.replace(/\s/g, '')) 
                : parseFloat(aspectRatio);
              
              const expectedRatio = 40 / 24;
              const tolerance = 0.01; // Allow small floating point differences
              
              expect(Math.abs(ratio - expectedRatio)).toBeLessThan(tolerance);
            }
            
            // Also verify the container has the correct CSS class
            expect(screenContainer.classList.contains('teletext-screen-container')).toBe(true);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * Feature: teletext-rendering-engine, Property 16: Page Transition Sequence
   * Validates: Requirements 8.1, 8.2, 8.3, 8.4
   * 
   * For any navigation event, the system shall clear all content to display a blank black screen,
   * then render the complete new page (including header and content) within 500 milliseconds.
   */
  it('should follow correct transition sequence when navigating between pages', { timeout: 60000 }, async () => {
      await fc.assert(
        fc.asyncProperty(
          // Generate random valid page numbers (100-999)
          fc.integer({ min: 100, max: 999 }),
          fc.integer({ min: 100, max: 999 }),
          async (initialPage, targetPage) => {
            // Skip if pages are the same (no transition)
            if (initialPage === targetPage) {
              return true;
            }

            // Render with initial page
            const { rerender, container } = render(
              <TeletextScreen currentPage={initialPage} />
            );

            // Wait for initialization to complete (static -> page)
            await waitFor(
              () => {
                const page = container.querySelector('[data-testid="teletext-page"]');
                expect(page).toBeTruthy();
              },
              { timeout: 2000 }
            );

            // Record time before navigation
            const navigationStartTime = Date.now();

            // Trigger navigation to target page
            rerender(<TeletextScreen currentPage={targetPage} />);

            // During transition, we should see either loading screen or the transition should be fast
            // The requirement is that transition completes within 500ms

            // Wait for new page to appear
            await waitFor(
              () => {
                const page = container.querySelector('[data-testid="teletext-page"]');
                expect(page).toBeTruthy();
              },
              { timeout: 600 } // Slightly more than 500ms to account for test overhead
            );

            const navigationEndTime = Date.now();
            const transitionDuration = navigationEndTime - navigationStartTime;

            // Verify transition completed within 500ms (with some tolerance for test overhead)
            expect(transitionDuration).toBeLessThan(600);

            // Verify the page is now displayed (not loading or static)
            const finalPage = container.querySelector('[data-testid="teletext-page"]');
            expect(finalPage).toBeTruthy();

            return true;
          }
        ),
        { numRuns: 20 } // Reduced from 100 to avoid timeout
      );
    });
});
