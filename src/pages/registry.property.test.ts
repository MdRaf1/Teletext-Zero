import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { getPage, pageRegistry } from './registry';
import { GRID } from '../constants';

describe('Page Registry Property Tests', () => {
  // Feature: teletext-rendering-engine, Property 12: Page Number Range
  // Validates: Requirements 6.1, 6.2
  it('should accept and render any valid page number from 100 to 999', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 999 }),
        (pageNumber) => {
          const page = getPage(pageNumber);
          
          // The system should always return a page definition
          expect(page).toBeDefined();
          expect(page.pageNumber).toBe(pageNumber);
          expect(page.title).toBeDefined();
          expect(page.content).toBeDefined();
          expect(Array.isArray(page.content)).toBe(true);
          
          // If the page exists in registry, it should return that page
          // If not, it should return an error page
          if (pageRegistry[pageNumber]) {
            expect(page).toBe(pageRegistry[pageNumber]);
          } else {
            // Error page should have appropriate structure
            expect(page.title).toBe('Error');
            expect(page.content.length).toBeGreaterThan(0);
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  // Feature: teletext-rendering-engine, Property 13: Undefined Page Handling
  // Validates: Requirements 6.3
  it('should display an error message within 40x24 grid constraints for undefined pages', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 100, max: 999 }).filter(num => !pageRegistry[num]),
        (undefinedPageNumber) => {
          const errorPage = getPage(undefinedPageNumber);
          
          // Error page should be returned
          expect(errorPage).toBeDefined();
          expect(errorPage.pageNumber).toBe(undefinedPageNumber);
          expect(errorPage.title).toBe('Error');
          
          // Content should fit within grid constraints
          expect(errorPage.content.length).toBeLessThanOrEqual(GRID.CONTENT_ROWS);
          
          // Each line should fit within column constraints
          errorPage.content.forEach((line) => {
            expect(line.length).toBeLessThanOrEqual(GRID.COLUMNS);
          });
          
          // Error message should contain helpful information
          const contentText = errorPage.content.join(' ');
          expect(contentText).toContain('NOT FOUND');
        }
      ),
      { numRuns: 100 }
    );
  });
});
