import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  TELETEXT_COLORS,
  isValidTeletextColor,
  getTeletextColorHex,
  isValidTeletextHex,
} from './colors';
import type { TeletextColor } from './colors';

describe('Teletext Color Palette', () => {
  it('should have exactly 8 colors', () => {
    const colorKeys = Object.keys(TELETEXT_COLORS);
    expect(colorKeys).toHaveLength(8);
  });

  it('should contain the correct color names', () => {
    const expectedColors = ['black', 'white', 'red', 'green', 'blue', 'yellow', 'cyan', 'magenta'];
    const actualColors = Object.keys(TELETEXT_COLORS);
    expect(actualColors.sort()).toEqual(expectedColors.sort());
  });

  /**
   * Feature: teletext-rendering-engine, Property 5: Color Palette Constraint
   * Validates: Requirements 2.3, 2.4
   * 
   * For any visual element rendered, all colors used shall be exclusively from 
   * the 8-color teletext palette (Black, White, Red, Green, Blue, Yellow, Cyan, Magenta),
   * and any color value outside this palette shall be rejected.
   */
  describe('Property 5: Color Palette Constraint', () => {
    it('should accept only valid teletext color names', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.keys(TELETEXT_COLORS)),
          (colorName) => {
            // Any valid teletext color name should be accepted
            expect(isValidTeletextColor(colorName)).toBe(true);
            // And should return a valid hex value
            const hex = getTeletextColorHex(colorName as TeletextColor);
            expect(hex).toMatch(/^#[0-9A-F]{6}$/);
            expect(Object.values(TELETEXT_COLORS)).toContain(hex);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject any color name outside the palette', () => {
      const validColors = Object.keys(TELETEXT_COLORS);
      fc.assert(
        fc.property(
          fc.string().filter(s => !validColors.includes(s)),
          (invalidColorName) => {
            // Any color name not in the palette should be rejected
            expect(isValidTeletextColor(invalidColorName)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should accept only valid teletext hex values', () => {
      fc.assert(
        fc.property(
          fc.constantFrom(...Object.values(TELETEXT_COLORS)),
          (validHex) => {
            // Any hex value from the palette should be accepted
            expect(isValidTeletextHex(validHex)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should reject any hex value outside the palette', () => {
      const validHexValues = Object.values(TELETEXT_COLORS) as string[];
      fc.assert(
        fc.property(
          // Generate random hex colors that are NOT in the teletext palette
          fc.tuple(
            fc.integer({ min: 0, max: 255 }),
            fc.integer({ min: 0, max: 255 }),
            fc.integer({ min: 0, max: 255 })
          ).map(([r, g, b]) => {
            const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
            return hex;
          }).filter(hex => !validHexValues.includes(hex)),
          (invalidHex) => {
            // Any hex value not in the palette should be rejected
            expect(isValidTeletextHex(invalidHex)).toBe(false);
          }
        ),
        { numRuns: 100 }
      );
    });

    it('should handle case-insensitive hex validation', () => {
      const validHexValues = Object.values(TELETEXT_COLORS) as string[];
      fc.assert(
        fc.property(
          fc.constantFrom(...validHexValues),
          fc.constantFrom('lower' as const, 'upper' as const, 'mixed' as const),
          (validHex, caseType) => {
            let testHex: string = validHex;
            if (caseType === 'lower') {
              testHex = validHex.toLowerCase();
            } else if (caseType === 'mixed') {
              testHex = validHex.split('').map((c, i) => 
                i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
              ).join('');
            }
            // Valid hex values should be accepted regardless of case
            expect(isValidTeletextHex(testHex)).toBe(true);
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
