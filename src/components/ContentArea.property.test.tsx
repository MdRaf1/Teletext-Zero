import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { ContentArea } from './ContentArea';
import type { PageContent } from '../types';
import { GRID } from '../constants';

/**
 * Feature: teletext-rendering-engine, Property 14: Content Area Reservation
 * Validates: Requirements 6.4
 * 
 * For any page, row 1 shall be reserved exclusively for the header,
 * and rows 2-24 shall be reserved exclusively for content, with no overlap.
 */
describe('Property 14: Content Area Reservation', () => {
  // Generator for content lines (varying lengths and counts)
  const contentLineArb = fc.string({ maxLength: 100 }); // Can exceed 40 to test truncation
  const contentLinesArb = fc.array(contentLineArb, { minLength: 0, maxLength: 50 }); // Can exceed 23 to test truncation

  it('should never render more than 23 lines (rows 2-24)', () => {
    fc.assert(
      fc.property(
        contentLinesArb,
        (lines) => {
          const content: PageContent = { lines };
          const { container } = render(<ContentArea content={content} />);
          
          const contentArea = container.querySelector('.content-area');
          expect(contentArea).toBeDefined();
          
          const renderedLines = contentArea?.querySelectorAll('.content-line');
          const lineCount = renderedLines?.length || 0;
          
          // Should never exceed GRID.CONTENT_ROWS (23 lines)
          expect(lineCount).toBeLessThanOrEqual(GRID.CONTENT_ROWS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should truncate each line to exactly 40 characters or less', () => {
    fc.assert(
      fc.property(
        contentLinesArb,
        (lines) => {
          const content: PageContent = { lines };
          const { container } = render(<ContentArea content={content} />);
          
          const contentArea = container.querySelector('.content-area');
          const renderedLines = contentArea?.querySelectorAll('.content-line');
          
          renderedLines?.forEach((line) => {
            const lineText = line.textContent || '';
            // Each line should not exceed GRID.COLUMNS (40 characters)
            expect(lineText.length).toBeLessThanOrEqual(GRID.COLUMNS);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve content within the 40x23 constraint', () => {
    fc.assert(
      fc.property(
        contentLinesArb,
        (lines) => {
          const content: PageContent = { lines };
          const { container } = render(<ContentArea content={content} />);
          
          const contentArea = container.querySelector('.content-area');
          const renderedLines = contentArea?.querySelectorAll('.content-line');
          const lineCount = renderedLines?.length || 0;
          
          // Line count should be min(input lines, 23)
          const expectedLineCount = Math.min(lines.length, GRID.CONTENT_ROWS);
          expect(lineCount).toBe(expectedLineCount);
          
          // Each line should be truncated to 40 characters
          renderedLines?.forEach((line, index) => {
            const lineText = line.textContent || '';
            const expectedText = lines[index].substring(0, GRID.COLUMNS);
            expect(lineText).toBe(expectedText);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle empty content without errors', () => {
    fc.assert(
      fc.property(
        fc.constant([] as string[]), // Empty array
        (lines) => {
          const content: PageContent = { lines };
          const { container } = render(<ContentArea content={content} />);
          
          const contentArea = container.querySelector('.content-area');
          expect(contentArea).toBeDefined();
          
          const renderedLines = contentArea?.querySelectorAll('.content-line');
          expect(renderedLines?.length).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain content area boundaries regardless of input size', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ maxLength: 200 }), { minLength: 0, maxLength: 100 }),
        (lines) => {
          const content: PageContent = { lines };
          const { container } = render(<ContentArea content={content} />);
          
          const contentArea = container.querySelector('.content-area');
          const renderedLines = contentArea?.querySelectorAll('.content-line');
          const lineCount = renderedLines?.length || 0;
          
          // Total content should fit within rows 2-24 (23 rows)
          expect(lineCount).toBeLessThanOrEqual(GRID.CONTENT_ROWS);
          
          // Each line should fit within 40 columns
          renderedLines?.forEach((line) => {
            const lineText = line.textContent || '';
            expect(lineText.length).toBeLessThanOrEqual(GRID.COLUMNS);
          });
          
          // Calculate total character capacity
          const totalCapacity = GRID.COLUMNS * GRID.CONTENT_ROWS; // 40 * 23 = 920
          const totalRenderedChars = Array.from(renderedLines || [])
            .reduce((sum, line) => sum + (line.textContent?.length || 0), 0);
          
          // Total rendered characters should not exceed capacity
          expect(totalRenderedChars).toBeLessThanOrEqual(totalCapacity);
        }
      ),
      { numRuns: 100 }
    );
  });
});
