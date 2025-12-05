/**
 * Teletext color palette - the 8 authentic colors from 1980s teletext systems
 */

export const TELETEXT_COLORS = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#FF0000',
  green: '#00FF00',
  blue: '#0000FF',
  yellow: '#FFFF00',
  cyan: '#00FFFF',
  magenta: '#FF00FF',
} as const;

export type TeletextColor = keyof typeof TELETEXT_COLORS;

/**
 * Validates if a color value is in the teletext palette
 */
export function isValidTeletextColor(color: string): color is TeletextColor {
  return Object.hasOwn(TELETEXT_COLORS, color);
}

/**
 * Gets the hex value for a teletext color
 */
export function getTeletextColorHex(color: TeletextColor): string {
  return TELETEXT_COLORS[color];
}

/**
 * Validates if a hex color value is in the teletext palette
 */
export function isValidTeletextHex(hex: string): boolean {
  const normalizedHex = hex.toUpperCase();
  return Object.values(TELETEXT_COLORS).includes(normalizedHex as any);
}
