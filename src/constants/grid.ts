/**
 * Grid constraints for the Teletext Rendering Engine
 * Enforces the strict 40x24 character grid from 1980s teletext systems
 */

export interface GridConstraints {
  readonly COLUMNS: 40;
  readonly ROWS: 24;
  readonly HEADER_ROW: 1;
  readonly CONTENT_START_ROW: 2;
  readonly CONTENT_ROWS: 23;
}

export const GRID: GridConstraints = {
  COLUMNS: 40,
  ROWS: 24,
  HEADER_ROW: 1,
  CONTENT_START_ROW: 2,
  CONTENT_ROWS: 23,
} as const;
