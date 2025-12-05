import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { truncateText, truncateLines } from './formatters';
import { GRID } from '../constants';

/**
 * Feature: teletext-rendering-engine, Property 1: Grid Dimension Invariant
 * Validates: Requirements 1.1, 1.2, 1.3
 * 
 * For any page content, the rendered output shall always be exactly 40 columns
 * by 24 rows, with any overflow truncated at these boundaries.
 */
describe('Property 1: Grid Dimension Invariant', () => {
  it('should always truncate text to exactly 40 characters or less', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 200 }),
        (text) => {
          const result = truncateText(text);
          expect(result.length).toBeLessThanOrEqual(GRID.COLUMNS);
          expect(result.length).toBeLessThanOrEqual(40);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always truncate line arrays to exactly 23 rows or less', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 100 }), { minLength: 0, maxLength: 50 }),
        (lines) => {
          const result = truncateLines(lines);
          expect(result.length).toBeLessThanOrEqual(GRID.CONTENT_ROWS);
          expect(result.length).toBeLessThanOrEqual(23);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve content within bounds without modification', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 0, maxLength: 40 }),
        (text) => {
          const result = truncateText(text);
          expect(result).toBe(text);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should preserve line arrays within bounds without modification', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 100 }), { minLength: 0, maxLength: 23 }),
        (lines) => {
          const result = truncateLines(lines);
          expect(result).toEqual(lines);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should handle combined text and line truncation for full page content', () => {
    fc.assert(
      fc.property(
        fc.array(fc.string({ minLength: 0, maxLength: 200 }), { minLength: 0, maxLength: 50 }),
        (lines) => {
          // Simulate processing full page content
          const truncatedLines = truncateLines(lines);
          const processedLines = truncatedLines.map(line => truncateText(line));
          
          // Verify grid constraints
          expect(processedLines.length).toBeLessThanOrEqual(GRID.CONTENT_ROWS);
          processedLines.forEach(line => {
            expect(line.length).toBeLessThanOrEqual(GRID.COLUMNS);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
