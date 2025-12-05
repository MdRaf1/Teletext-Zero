import { describe, it, expect } from 'vitest';
import {
  truncateText,
  truncateLines,
  formatTime,
  formatPageNumber,
  formatBuffer,
} from './formatters';
import { GRID } from '../constants';

describe('truncateText', () => {
  it('should return text unchanged when length is less than 40', () => {
    const text = 'Hello World';
    expect(truncateText(text)).toBe(text);
  });

  it('should return text unchanged when length is exactly 40', () => {
    const text = 'a'.repeat(40);
    expect(truncateText(text)).toBe(text);
  });

  it('should truncate text when length exceeds 40', () => {
    const text = 'a'.repeat(50);
    expect(truncateText(text)).toBe('a'.repeat(40));
    expect(truncateText(text).length).toBe(GRID.COLUMNS);
  });

  it('should handle empty string', () => {
    expect(truncateText('')).toBe('');
  });
});

describe('truncateLines', () => {
  it('should return lines unchanged when count is less than 23', () => {
    const lines = ['line1', 'line2', 'line3'];
    expect(truncateLines(lines)).toEqual(lines);
  });

  it('should return lines unchanged when count is exactly 23', () => {
    const lines = Array(23).fill('line');
    expect(truncateLines(lines)).toEqual(lines);
  });

  it('should truncate lines when count exceeds 23', () => {
    const lines = Array(30).fill('line');
    const result = truncateLines(lines);
    expect(result.length).toBe(GRID.CONTENT_ROWS);
    expect(result.length).toBe(23);
  });

  it('should handle empty array', () => {
    expect(truncateLines([])).toEqual([]);
  });
});

describe('formatTime', () => {
  it('should format time as HH:MM:SS', () => {
    const date = new Date('2024-01-01T14:30:45');
    expect(formatTime(date)).toBe('14:30:45');
  });

  it('should pad single digit hours with zero', () => {
    const date = new Date('2024-01-01T09:30:45');
    expect(formatTime(date)).toBe('09:30:45');
  });

  it('should pad single digit minutes with zero', () => {
    const date = new Date('2024-01-01T14:05:45');
    expect(formatTime(date)).toBe('14:05:45');
  });

  it('should pad single digit seconds with zero', () => {
    const date = new Date('2024-01-01T14:30:05');
    expect(formatTime(date)).toBe('14:30:05');
  });

  it('should handle midnight', () => {
    const date = new Date('2024-01-01T00:00:00');
    expect(formatTime(date)).toBe('00:00:00');
  });

  it('should handle end of day', () => {
    const date = new Date('2024-01-01T23:59:59');
    expect(formatTime(date)).toBe('23:59:59');
  });
});

describe('formatPageNumber', () => {
  it('should format 3-digit page numbers with P prefix', () => {
    expect(formatPageNumber(100)).toBe('P100');
    expect(formatPageNumber(300)).toBe('P300');
    expect(formatPageNumber(999)).toBe('P999');
  });

  it('should pad 2-digit page numbers with leading zero', () => {
    expect(formatPageNumber(99)).toBe('P099');
  });

  it('should pad 1-digit page numbers with leading zeros', () => {
    expect(formatPageNumber(5)).toBe('P005');
  });
});

describe('formatBuffer', () => {
  it('should return empty string for empty buffer', () => {
    expect(formatBuffer('')).toBe('');
  });

  it('should format 1-digit buffer with two dots', () => {
    expect(formatBuffer('1')).toBe('1..');
    expect(formatBuffer('5')).toBe('5..');
    expect(formatBuffer('9')).toBe('9..');
  });

  it('should format 2-digit buffer with one dot', () => {
    expect(formatBuffer('10')).toBe('10.');
    expect(formatBuffer('25')).toBe('25.');
    expect(formatBuffer('99')).toBe('99.');
  });

  it('should format 3-digit buffer without dots', () => {
    expect(formatBuffer('100')).toBe('100');
    expect(formatBuffer('300')).toBe('300');
    expect(formatBuffer('999')).toBe('999');
  });
});
