import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import * as fc from 'fast-check';
import { Header } from './Header';
import { GRID } from '../constants';
import { formatTime, formatPageNumber } from '../utils/formatters';

/**
 * Feature: teletext-rendering-engine, Property 9: Header Structure Invariant
 * Validates: Requirements 4.1, 4.2, 4.3, 4.4, 4.6
 * 
 * For any page, row 1 shall always contain a header with "TELETEXT ZERO" left-aligned,
 * the page number in format "P###" center-aligned, and a clock in format "HH:MM:SS"
 * right-aligned, with the header never overflowing into row 2.
 */
describe('Property 9: Header Structure Invariant', () => {
  // Generator for valid page numbers (100-999)
  const pageNumberArb = fc.integer({ min: 100, max: 999 });
  
  // Generator for valid dates (filter out invalid dates that might occur during shrinking)
  const dateArb = fc.date({ min: new Date(2000, 0, 1), max: new Date(2099, 11, 31) })
    .filter(date => !isNaN(date.getTime()));
  
  // Generator for page names (reasonable length strings)
  const pageNameArb = fc.string({ minLength: 1, maxLength: 20 });

  it('should always produce exactly 40 characters', () => {
    fc.assert(
      fc.property(
        pageNameArb,
        pageNumberArb,
        dateArb,
        (pageName, pageNumber, currentTime) => {
          const { container } = render(
            <Header 
              pageName={pageName}
              pageNumber={pageNumber}
              currentTime={currentTime}
            />
          );
          
          const headerElement = container.querySelector('.header');
          expect(headerElement).toBeDefined();
          
          const headerText = headerElement?.textContent || '';
          expect(headerText.length).toBe(GRID.COLUMNS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always start with the page name', () => {
    fc.assert(
      fc.property(
        pageNameArb,
        pageNumberArb,
        dateArb,
        (pageName, pageNumber, currentTime) => {
          const { container } = render(
            <Header 
              pageName={pageName}
              pageNumber={pageNumber}
              currentTime={currentTime}
            />
          );
          
          const headerElement = container.querySelector('.header');
          const headerText = headerElement?.textContent || '';
          
          expect(headerText.startsWith(pageName)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always end with the formatted time', () => {
    fc.assert(
      fc.property(
        pageNameArb,
        pageNumberArb,
        dateArb,
        (pageName, pageNumber, currentTime) => {
          const { container } = render(
            <Header 
              pageName={pageName}
              pageNumber={pageNumber}
              currentTime={currentTime}
            />
          );
          
          const headerElement = container.querySelector('.header');
          const headerText = headerElement?.textContent || '';
          const expectedTime = formatTime(currentTime);
          
          expect(headerText.endsWith(expectedTime)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should always contain the formatted page number', () => {
    fc.assert(
      fc.property(
        pageNameArb,
        pageNumberArb,
        dateArb,
        (pageName, pageNumber, currentTime) => {
          const { container } = render(
            <Header 
              pageName={pageName}
              pageNumber={pageNumber}
              currentTime={currentTime}
            />
          );
          
          const headerElement = container.querySelector('.header');
          const headerText = headerElement?.textContent || '';
          const expectedPageNumber = formatPageNumber(pageNumber);
          
          expect(headerText).toContain(expectedPageNumber);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should maintain structure with all three components present', () => {
    fc.assert(
      fc.property(
        pageNameArb,
        pageNumberArb,
        dateArb,
        (pageName, pageNumber, currentTime) => {
          const { container } = render(
            <Header 
              pageName={pageName}
              pageNumber={pageNumber}
              currentTime={currentTime}
            />
          );
          
          const headerElement = container.querySelector('.header');
          const headerText = headerElement?.textContent || '';
          
          // Verify all three components are present
          expect(headerText).toContain(pageName);
          expect(headerText).toContain(formatPageNumber(pageNumber));
          expect(headerText).toContain(formatTime(currentTime));
          
          // Verify exact length
          expect(headerText.length).toBe(GRID.COLUMNS);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should format page numbers with leading zeros', () => {
    fc.assert(
      fc.property(
        pageNameArb,
        pageNumberArb,
        dateArb,
        (pageName, pageNumber, currentTime) => {
          const { container } = render(
            <Header 
              pageName={pageName}
              pageNumber={pageNumber}
              currentTime={currentTime}
            />
          );
          
          const headerElement = container.querySelector('.header');
          const headerText = headerElement?.textContent || '';
          
          // Page number should always be in P### format (4 characters)
          const pageNumberPattern = /P\d{3}/;
          expect(pageNumberPattern.test(headerText)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should format time in HH:MM:SS format', () => {
    fc.assert(
      fc.property(
        pageNameArb,
        pageNumberArb,
        dateArb,
        (pageName, pageNumber, currentTime) => {
          const { container } = render(
            <Header 
              pageName={pageName}
              pageNumber={pageNumber}
              currentTime={currentTime}
            />
          );
          
          const headerElement = container.querySelector('.header');
          const headerText = headerElement?.textContent || '';
          
          // Time should always be in HH:MM:SS format (8 characters)
          const timePattern = /\d{2}:\d{2}:\d{2}/;
          expect(timePattern.test(headerText)).toBe(true);
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should never overflow (always exactly 40 characters, never more)', () => {
    fc.assert(
      fc.property(
        pageNameArb,
        pageNumberArb,
        dateArb,
        (pageName, pageNumber, currentTime) => {
          const { container } = render(
            <Header 
              pageName={pageName}
              pageNumber={pageNumber}
              currentTime={currentTime}
            />
          );
          
          const headerElement = container.querySelector('.header');
          const headerText = headerElement?.textContent || '';
          
          // Should never exceed 40 characters
          expect(headerText.length).toBeLessThanOrEqual(GRID.COLUMNS);
          // Should always be exactly 40 characters
          expect(headerText.length).toBe(GRID.COLUMNS);
        }
      ),
      { numRuns: 100 }
    );
  });
});
