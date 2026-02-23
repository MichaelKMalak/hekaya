/**
 * Centralized regex patterns for Hekaya/Fountain element detection.
 *
 * All patterns use the Unicode flag (u) for proper Arabic character matching.
 * Arabic diacritics (tashkeel) are accounted for with optional diacritical ranges.
 */

import {
  SCENE_HEADING_KEYWORDS_AR,
  SCENE_HEADING_KEYWORDS_EN,
  TRANSITION_KEYWORDS_AR,
  TITLE_KEYS_AR,
  TITLE_KEYS_EN,
} from './keywords';

// Unicode ranges for Arabic
const ARABIC_DIACRITICS = '\u0610-\u061A\u064B-\u065F\u0670';
const ARABIC_BASE = '\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF';

// Build scene heading keyword pattern
const arSceneKeywords = Object.keys(SCENE_HEADING_KEYWORDS_AR).join('|');
const enSceneKeywords = SCENE_HEADING_KEYWORDS_EN.map((k) => k.replace(/\./g, '\\.')).join('|');

/**
 * Scene heading: Arabic keywords OR English keywords, followed by . or space.
 * Also matches forced scene heading with leading period.
 */
export const SCENE_HEADING = new RegExp(
  `^\\s*(?:(\\.)(?!\\.)|(?:${arSceneKeywords}|${enSceneKeywords})[.\\s])`,
  'iu',
);

/** Extract scene number from #number# at end of line. Accepts Arabic and Western numerals. */
export const SCENE_NUMBER = /\s*#([٠-٩0-9A-Za-z\u0600-\u06FF\-.]+)#\s*$/u;

/** Forced character: @ prefix. */
export const CHARACTER_FORCED = /^\s*@(.+)$/u;

/** English character: ALL UPPERCASE on a standalone line (standard Fountain). */
export const CHARACTER_ENGLISH = /^([A-Z][A-Z0-9 _\-']+)(\s*\(.+\))?\s*\^?\s*$/;

/** Dual dialogue marker: trailing caret. */
export const DUAL_DIALOGUE = /\s*\^\s*$/;

/** Character extension: parenthetical after name, e.g. (V.O.) or (صوت خارجي). */
export const CHARACTER_EXTENSION = /\s*\(([^)]+)\)\s*$/u;

// Build transition keyword pattern (sorted longest-first to avoid partial matches)
const arTransitionKeywords = [...TRANSITION_KEYWORDS_AR]
  .sort((a, b) => b.length - a.length)
  .join('|');

/**
 * Arabic transition: standalone keyword on its own line, optionally wrapped in dashes.
 * Matches: `قطع`, `- قطع -`, `قطع إلى:` (colon optional for backward compat).
 * Based on real Egyptian production scripts where transitions are centered standalone text.
 */
export const TRANSITION_ARABIC = new RegExp(
  `^\\s*-?\\s*(${arTransitionKeywords})\\s*:?\\s*-?\\s*$`,
  'u',
);

/** English transition: UPPERCASE text ending in TO: (standard Fountain). */
export const TRANSITION_ENGLISH = /^\s*[A-Z ]+TO:\s*$/;

/** Forced transition: > prefix (not centered text >...<). */
export const TRANSITION_FORCED = /^\s*>(?!.*<\s*$).+$/;

/** Parenthetical: text wrapped in parentheses on its own line. */
export const PARENTHETICAL = /^\s*\(.*\)\s*$/u;

// Build title page key pattern
const arTitleKeys = Object.keys(TITLE_KEYS_AR).join('|');
const enTitleKeys = Object.keys(TITLE_KEYS_EN).join('|');

/** Title page key-value pair. Group 1: key, Group 2: value. */
export const TITLE_KEY = new RegExp(`^\\s*(${arTitleKeys}|${enTitleKeys})\\s*:\\s*(.*)$`, 'iu');

/** Centered text: >text< */
export const CENTERED = /^\s*>([^<\n]+)<\s*$/;

/** Section: # through ###### with content. */
export const SECTION = /^(#{1,6})\s+(.+)$/;

/** Synopsis: = text (but not ===). */
export const SYNOPSIS = /^=(?!=)\s*(.+)$/;

/** Page break: three or more equals signs. */
export const PAGE_BREAK = /^={3,}\s*$/;

/** Inline note: [[text]]. Global flag for multiple matches. */
export const NOTE = /\[\[([^\]]+)\]\]/gu;

/** Boneyard (comment): C-style block comment. */
export const BONEYARD = /\/\*([^*]|\*[^/])*\*\//gu;

/** Lyrics: ~ prefix. */
export const LYRICS = /^~(.+)$/;

/** Forced action: ! prefix. */
export const ACTION_FORCED = /^!(.+)$/u;

/** Emphasis patterns for inline formatting. */
export const BOLD_ITALIC = /\*{3}(.+?)\*{3}/gu;
export const BOLD = /\*{2}(.+?)\*{2}/gu;
export const ITALIC = /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/gu;
export const UNDERLINE = /_([^_\n]+)_/gu;

/** Blank line (only whitespace). */
export const BLANK_LINE = /^\s*$/;

/** Detect predominantly Arabic text. */
export const ARABIC_TEXT = new RegExp(`[${ARABIC_BASE}]`, 'u');

/** Title page continuation: indented line (for multi-line values). */
export const TITLE_CONTINUATION = /^[\t ]+\S/;

/** Arabic diacritics pattern (for stripping in normalization). */
export const DIACRITICS = new RegExp(`[${ARABIC_DIACRITICS}]`, 'gu');

/** Alef variants: أ إ آ ٱ ا — for normalization. */
export const ALEF_VARIANTS = /[أإآٱ]/gu;
