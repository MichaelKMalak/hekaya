/**
 * @hekaya/parser — Arabic-first screenplay markup parser.
 *
 * Implements the Hekaya specification, extending Fountain for RTL languages.
 */

// Main API
export { Hekaya } from './hekaya';
export { parse } from './lexer';

// Types
export type {
  HekayaScript,
  HekayaToken,
  HekayaElementType,
  TitleEntry,
  TextDirection,
  ParseOptions,
} from './types';

// Utilities
export { CharacterRegistry } from './character-registry';
export { detectDirection, containsArabic, applyDirectionMarker } from './bidi';
export { processInlineFormatting, stripInlineFormatting } from './inline-lexer';

// Keywords (for external tools like autocomplete)
export {
  SCENE_HEADING_KEYWORDS_AR,
  SCENE_HEADING_KEYWORDS_EN,
  TITLE_KEYS_AR,
  TITLE_KEYS_EN,
  TRANSITION_KEYWORDS_AR,
  TRANSITION_MAP_AR_EN,
  CHARACTER_EXTENSIONS_AR,
  TIME_OF_DAY_AR,
} from './keywords';
