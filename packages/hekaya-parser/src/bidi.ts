/**
 * Bidirectional text utilities for Hekaya.
 *
 * Provides direction detection and Unicode BiDi marker helpers.
 */

import type { TextDirection } from './types';
import { ARABIC_TEXT } from './rules';

/**
 * Detect whether a string is predominantly RTL (Arabic) or LTR (Latin).
 *
 * Uses character frequency analysis. Returns 'auto' if the text
 * contains neither Arabic nor Latin characters (e.g., only numbers/punctuation).
 */
export function detectDirection(text: string): TextDirection {
  const arabicMatches = text.match(
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/gu,
  );
  const latinMatches = text.match(/[A-Za-z]/g);

  const arabicCount = arabicMatches?.length ?? 0;
  const latinCount = latinMatches?.length ?? 0;

  if (arabicCount === 0 && latinCount === 0) return 'auto';
  if (arabicCount > latinCount) return 'rtl';
  return 'ltr';
}

/**
 * Check if a string contains any Arabic characters.
 */
export function containsArabic(text: string): boolean {
  return ARABIC_TEXT.test(text);
}

/**
 * Unicode Right-to-Left Mark (U+200F).
 * Inserted to ensure RTL base direction in mixed content.
 */
export const RLM = '\u200F';

/**
 * Unicode Left-to-Right Mark (U+200E).
 * Inserted to ensure LTR base direction in mixed content.
 */
export const LRM = '\u200E';

/**
 * Apply a Unicode directional marker to the beginning of text.
 * Only applies if direction is explicitly rtl or ltr.
 */
export function applyDirectionMarker(text: string, direction: TextDirection): string {
  if (direction === 'rtl') return RLM + text;
  if (direction === 'ltr') return LRM + text;
  return text;
}
