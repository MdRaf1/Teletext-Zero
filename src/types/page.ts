import type { TeletextColor } from '../constants/colors';

/**
 * Color mapping for specific characters in the grid
 * Maps row and column positions to teletext colors
 */
export interface ColorMap {
  [row: number]: {
    [col: number]: TeletextColor;
  };
}

/**
 * Content for a single page
 */
export interface PageContent {
  lines: string[];       // Array of up to 23 strings (rows 2-24)
  colors?: ColorMap;     // Optional color specifications per character
}

/**
 * Dynamic content loader function type
 */
export type DynamicContentLoader = () => Promise<string[]>;

/**
 * Complete page definition
 */
export interface PageDefinition {
  pageNumber: number;
  title: string;
  content: string[];                    // Static content lines (max 23)
  dynamicContent?: DynamicContentLoader; // Optional async content loader
  subPages?: PageDefinition[];          // Optional sub-pages
  colors?: ColorMap;                    // Optional color specifications
}

/**
 * Registry of all pages
 */
export interface PageRegistry {
  [pageNumber: number]: PageDefinition;
}
