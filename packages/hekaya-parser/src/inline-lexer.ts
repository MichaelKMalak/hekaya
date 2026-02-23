/**
 * Inline Lexer for Hekaya.
 *
 * Handles inline formatting within text: bold, italic, bold-italic, underline.
 * Converts markup to HTML tags for the renderer.
 */

import { BOLD_ITALIC, BOLD, ITALIC, UNDERLINE } from './rules';

/**
 * Process inline formatting in a text string.
 * Converts Fountain/Hekaya emphasis markers to HTML.
 *
 * Order matters: bold-italic (***) must be processed before bold (**) and italic (*).
 */
export function processInlineFormatting(text: string): string {
  return text
    .replace(BOLD_ITALIC, '<b><i>$1</i></b>')
    .replace(BOLD, '<b>$1</b>')
    .replace(ITALIC, '<i>$1</i>')
    .replace(UNDERLINE, '<u>$1</u>');
}

/**
 * Strip all inline formatting markers from text.
 * Returns plain text without emphasis markers.
 */
export function stripInlineFormatting(text: string): string {
  return text
    .replace(BOLD_ITALIC, '$1')
    .replace(BOLD, '$1')
    .replace(ITALIC, '$1')
    .replace(UNDERLINE, '$1');
}
