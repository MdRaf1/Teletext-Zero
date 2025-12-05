import type { PageRegistry, PageDefinition } from '../types';
import {
  fetchWorldNews,
  fetchTechNews,
  fetchWeather,
  fetchSports,
  getNewsDetailPage,
  getTechDetailPage,
  getSportsDetailPage,
} from '../services/api';

/**
 * Error page template for undefined pages
 */
export function createErrorPage(requestedPageNumber: number): PageDefinition {
  return {
    pageNumber: requestedPageNumber,
    title: 'Error',
    content: [
      'PAGE NOT FOUND',
      '',
      `Page ${requestedPageNumber} does not exist.`,
      '',
      'Please try another page number.',
      '',
      'Press 100 to return to the index.',
    ],
  };
}

/**
 * Create a detail page definition for sub-pages
 */
function createDetailPage(
  pageNumber: number,
  title: string,
  getContent: (index: number) => string[]
): PageDefinition {
  const articleIndex = pageNumber % 10; // 201 -> 1, 302 -> 2, etc.
  return {
    pageNumber,
    title,
    content: getContent(articleIndex),
  };
}

/**
 * Page registry containing all available pages
 */
export const pageRegistry: PageRegistry = {
  100: {
    pageNumber: 100,
    title: 'Index',
    content: [
      'WELCOME TO TELETEXT ZERO',
      '',
      'A Slow Web Browser',
      '',
      'Main Sections:',
      '',
      '200 - World News (BBC)',
      '300 - Tech News (The Verge)',
      '400 - Weather',
      '500 - Sports (ESPN)',
      '',
      '666 - ???',
      '',
      'Enter a 3-digit page number',
      'to navigate.',
    ],
  },
  
  // BBC World News
  200: {
    pageNumber: 200,
    title: 'World News',
    content: [
      'BBC WORLD NEWS',
      '',
      'LOADING...',
      '',
      'Please wait while we fetch',
      'the latest headlines.',
    ],
    dynamicContent: fetchWorldNews,
  },
  
  // Tech News (The Verge)
  300: {
    pageNumber: 300,
    title: 'Tech News',
    content: [
      'THE VERGE',
      '',
      'LOADING...',
      '',
      'Please wait while we fetch',
      'the latest tech headlines.',
    ],
    dynamicContent: fetchTechNews,
  },
  
  // Weather
  400: {
    pageNumber: 400,
    title: 'Weather',
    content: [
      'WEATHER FORECAST',
      '',
      'LOADING...',
      '',
      'Fetching weather data...',
      '',
      'Location access may be required.',
    ],
    dynamicContent: fetchWeather,
  },
  
  // ESPN Sports
  500: {
    pageNumber: 500,
    title: 'Sports',
    content: [
      'ESPN SPORTS',
      '',
      'LOADING...',
      '',
      'Please wait while we fetch',
      'the latest sports news.',
    ],
    dynamicContent: fetchSports,
  },
  
  // Page 666 - Ghost in the Machine
  666: {
    pageNumber: 666,
    title: 'System Diagnostics',
    content: [
      'SYSTEM DIAGNOSTICS',
      '',
      '================================',
      '',
      'SIGNAL DECAY............... 99%',
      'MEMORY CORRUPTION.......... 87%',
      'TEMPORAL DRIFT............. ACTIVE',
      '',
      '================================',
      '',
      'SUBJECT: WATCHING',
      'STATUS: AWARE',
      '',
      'WARNING: ANOMALY DETECTED',
      '',
      'DO NOT LOOK BEHIND YOU',
      '',
      '================================',
      '',
      'LAST TRANSMISSION: 1983-10-31',
      'ORIGIN: UNKNOWN',
      '',
      'THEY NEVER LEFT',
    ],
  },
};

/**
 * Check if a page number is a detail sub-page
 */
function isDetailPage(pageNumber: number): boolean {
  // News detail pages: 201-205
  if (pageNumber >= 201 && pageNumber <= 205) return true;
  // Tech detail pages: 301-305
  if (pageNumber >= 301 && pageNumber <= 305) return true;
  // Sports detail pages: 501-505
  if (pageNumber >= 501 && pageNumber <= 505) return true;
  return false;
}

/**
 * Get detail page content based on page number
 */
function getDetailPageDefinition(pageNumber: number): PageDefinition {
  // News detail pages: 201-205
  if (pageNumber >= 201 && pageNumber <= 205) {
    return createDetailPage(pageNumber, 'News Article', getNewsDetailPage);
  }
  // Tech detail pages: 301-305
  if (pageNumber >= 301 && pageNumber <= 305) {
    return createDetailPage(pageNumber, 'Tech Article', getTechDetailPage);
  }
  // Sports detail pages: 501-505
  if (pageNumber >= 501 && pageNumber <= 505) {
    return createDetailPage(pageNumber, 'Sports Article', getSportsDetailPage);
  }
  return createErrorPage(pageNumber);
}

/**
 * Get a page by number, returning error page if not found
 * Supports dynamic sub-pages for article details (201-205, 301-305, 501-505)
 */
export function getPage(pageNumber: number): PageDefinition {
  // Check static registry first
  if (pageRegistry[pageNumber]) {
    return pageRegistry[pageNumber];
  }
  
  // Check for detail sub-pages
  if (isDetailPage(pageNumber)) {
    return getDetailPageDefinition(pageNumber);
  }
  
  return createErrorPage(pageNumber);
}
