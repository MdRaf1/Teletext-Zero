/**
 * Utility functions for formatting and truncating content
 * according to Teletext constraints
 */

import { GRID } from '../constants';

/**
 * Truncates text to 40 characters (column limit)
 * @param text - The text to truncate
 * @returns Text truncated to GRID.COLUMNS characters
 */
export function truncateText(text: string): string {
  if (text.length <= GRID.COLUMNS) {
    return text;
  }
  return text.substring(0, GRID.COLUMNS);
}

/**
 * Truncates an array of lines to 23 rows (content area limit)
 * @param lines - Array of content lines
 * @returns Array truncated to GRID.CONTENT_ROWS lines
 */
export function truncateLines(lines: string[]): string[] {
  if (lines.length <= GRID.CONTENT_ROWS) {
    return lines;
  }
  return lines.slice(0, GRID.CONTENT_ROWS);
}

/**
 * Formats a Date object as HH:MM:SS
 * @param date - The date to format
 * @returns Time string in HH:MM:SS format
 */
export function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

/**
 * Formats a page number as P### (e.g., P100, P300)
 * @param pageNumber - The page number (100-999)
 * @returns Formatted page number string
 */
export function formatPageNumber(pageNumber: number): string {
  return `P${pageNumber.toString().padStart(3, '0')}`;
}

/**
 * Formats the navigation buffer with dots for empty positions
 * @param buffer - Current buffer state (0-3 digits)
 * @returns Formatted buffer string ("1..", "10.", "123", or "")
 */
export function formatBuffer(buffer: string): string {
  if (buffer.length === 0) {
    return '';
  }
  if (buffer.length === 1) {
    return `${buffer}..`;
  }
  if (buffer.length === 2) {
    return `${buffer}.`;
  }
  return buffer; // 3 digits
}
