/**
 * Hekaya Lexer — the main tokenizer.
 *
 * Two-pass approach:
 *   Pass 1 (preprocess): Strip boneyards, extract notes, normalize lines, detect direction.
 *   Pass 2 (tokenize): Walk lines and produce HekayaToken[] based on rules and context.
 */

import type {
  HekayaToken,
  HekayaScript,
  TitleEntry,
  ParseOptions,
  TextDirection,
  HekayaElementType,
} from './types';

import * as rules from './rules';
import { TITLE_KEYS_AR, TITLE_KEYS_EN, DIRECTION_VALUES_AR } from './keywords';
import { CharacterRegistry } from './character-registry';
import { detectDirection } from './bidi';

const DEFAULT_OPTIONS: Required<ParseOptions> = {
  defaultDirection: 'auto',
  enableCharacterRegistry: true,
  strictMode: false,
  language: 'auto',
};

/**
 * Parse a Hekaya/Fountain script string into a HekayaScript.
 */
export function parse(input: string, options?: ParseOptions): HekayaScript {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // --- Pass 1: Preprocess ---
  const boneyards: string[] = [];
  const notes: string[] = [];

  // Extract boneyards
  let preprocessed = input.replace(rules.BONEYARD, (match, _content) => {
    boneyards.push(match.slice(2, -2).trim());
    return '';
  });

  // Extract inline notes (replace with empty string for tokenization)
  preprocessed = preprocessed.replace(rules.NOTE, (_match, content) => {
    notes.push(content);
    return '';
  });

  // Normalize line endings
  preprocessed = preprocessed.replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // --- Parse title page ---
  const { titleEntries, bodyText, explicitDirection } = parseTitlePage(preprocessed);

  // Determine base direction
  let direction: TextDirection = opts.defaultDirection;
  if (explicitDirection) {
    direction = explicitDirection;
  } else if (direction === 'auto') {
    direction = detectDirection(bodyText);
  }

  // --- Pass 2: Tokenize ---
  const registry = new CharacterRegistry();
  const tokens = tokenize(bodyText, registry, opts);

  return {
    titleEntries,
    tokens,
    characters: registry.getAll(),
    notes,
    boneyards,
    direction,
  };
}

/**
 * Parse the title page from the beginning of the script.
 * Title page is a block of key: value pairs separated from the body by a blank line.
 */
function parseTitlePage(text: string): {
  titleEntries: TitleEntry[];
  bodyText: string;
  explicitDirection: TextDirection | null;
} {
  const titleEntries: TitleEntry[] = [];
  let explicitDirection: TextDirection | null = null;

  const lines = text.split('\n');
  let i = 0;

  // Check if the first non-blank line is a title page key
  while (i < lines.length && rules.BLANK_LINE.test(lines[i])) i++;

  if (i >= lines.length) {
    return { titleEntries: [], bodyText: '', explicitDirection: null };
  }

  const firstMatch = lines[i].match(rules.TITLE_KEY);
  if (!firstMatch) {
    // No title page
    return { titleEntries: [], bodyText: text, explicitDirection: null };
  }

  // Parse title page entries
  let currentKey: string | null = null;
  let currentKeyOriginal: string | null = null;
  let currentValue: string[] = [];

  const flushEntry = () => {
    if (currentKey !== null && currentKeyOriginal !== null) {
      const value = currentValue.join('\n').trim();
      titleEntries.push({
        key: currentKey,
        keyOriginal: currentKeyOriginal,
        value,
      });

      // Check for direction key
      if (currentKey === 'direction') {
        const normalized = value.toLowerCase().trim();
        if (normalized === 'rtl' || DIRECTION_VALUES_AR[normalized] === 'rtl') {
          explicitDirection = 'rtl';
        } else if (normalized === 'ltr' || DIRECTION_VALUES_AR[normalized] === 'ltr') {
          explicitDirection = 'ltr';
        }
      }

      // Reset so we don't flush the same entry twice
      currentKey = null;
      currentKeyOriginal = null;
      currentValue = [];
    }
  };

  while (i < lines.length) {
    const line = lines[i];

    // Blank line = end of title page
    if (rules.BLANK_LINE.test(line)) {
      flushEntry();
      i++;
      break;
    }

    const keyMatch = line.match(rules.TITLE_KEY);
    if (keyMatch) {
      // New key-value pair
      flushEntry();
      const rawKey = keyMatch[1].trim();
      const lowerKey = rawKey.toLowerCase();
      currentKeyOriginal = rawKey;
      currentKey = TITLE_KEYS_AR[rawKey] ?? TITLE_KEYS_EN[lowerKey] ?? lowerKey;
      currentValue = keyMatch[2] ? [keyMatch[2].trim()] : [];
    } else if (rules.TITLE_CONTINUATION.test(line)) {
      // Continuation line for current key
      if (currentKey !== null) {
        currentValue.push(line.trim());
      }
    } else {
      // Not a title page line — this means no title page after all
      // Restore and treat everything as body
      if (titleEntries.length === 0 && currentKey === null) {
        return { titleEntries: [], bodyText: text, explicitDirection: null };
      }
      flushEntry();
      break;
    }

    i++;
  }

  // Flush any remaining entry
  flushEntry();

  // Everything after title page is body
  const bodyText = lines.slice(i).join('\n');
  return { titleEntries, bodyText, explicitDirection };
}

/**
 * Tokenize the script body into HekayaToken[].
 */
function tokenize(
  body: string,
  registry: CharacterRegistry,
  opts: Required<ParseOptions>,
): HekayaToken[] {
  const tokens: HekayaToken[] = [];
  const lines = body.split('\n');

  let i = 0;
  let lastSignificantType: HekayaElementType | null = null;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // --- Blank line ---
    if (rules.BLANK_LINE.test(line)) {
      tokens.push({ type: 'blank', text: '' });
      i++;
      lastSignificantType = null;
      continue;
    }

    // --- Page break ---
    if (rules.PAGE_BREAK.test(trimmed)) {
      tokens.push({ type: 'page_break', text: trimmed });
      i++;
      lastSignificantType = 'page_break';
      continue;
    }

    // --- Forced action (! prefix) ---
    const actionMatch = trimmed.match(rules.ACTION_FORCED);
    if (actionMatch) {
      tokens.push({
        type: 'action',
        text: actionMatch[1],
        forced: true,
        direction: detectDirection(actionMatch[1]),
      });
      i++;
      lastSignificantType = 'action';
      continue;
    }

    // --- Lyrics (~ prefix) ---
    const lyricsMatch = trimmed.match(rules.LYRICS);
    if (lyricsMatch) {
      tokens.push({
        type: 'lyrics',
        text: lyricsMatch[1],
        direction: detectDirection(lyricsMatch[1]),
      });
      i++;
      lastSignificantType = 'lyrics';
      continue;
    }

    // --- Centered text (>text<) ---
    const centeredMatch = trimmed.match(rules.CENTERED);
    if (centeredMatch) {
      tokens.push({
        type: 'centered',
        text: centeredMatch[1].trim(),
        direction: detectDirection(centeredMatch[1]),
      });
      i++;
      lastSignificantType = 'centered';
      continue;
    }

    // --- Section (# heading) ---
    const sectionMatch = trimmed.match(rules.SECTION);
    if (sectionMatch) {
      tokens.push({
        type: 'section',
        text: sectionMatch[2],
        depth: sectionMatch[1].length,
        direction: detectDirection(sectionMatch[2]),
      });
      i++;
      lastSignificantType = 'section';
      continue;
    }

    // --- Synopsis (= text) ---
    const synopsisMatch = trimmed.match(rules.SYNOPSIS);
    if (synopsisMatch) {
      tokens.push({
        type: 'synopsis',
        text: synopsisMatch[1],
        direction: detectDirection(synopsisMatch[1]),
      });
      i++;
      lastSignificantType = 'synopsis';
      continue;
    }

    // --- Scene heading ---
    if (rules.SCENE_HEADING.test(trimmed)) {
      let text = trimmed;
      let forced = false;
      let sceneNumber: string | undefined;

      // Check for forced . prefix
      if (text.startsWith('.') && !text.startsWith('..')) {
        text = text.slice(1).trim();
        forced = true;
      }

      // Extract scene number
      const sceneNumMatch = text.match(rules.SCENE_NUMBER);
      if (sceneNumMatch) {
        sceneNumber = sceneNumMatch[1];
        text = text.replace(rules.SCENE_NUMBER, '').trim();
      }

      tokens.push({
        type: 'scene_heading',
        text,
        forced,
        sceneNumber,
        direction: detectDirection(text),
      });
      i++;
      lastSignificantType = 'scene_heading';
      continue;
    }

    // --- Forced transition (> prefix, not centered) ---
    if (rules.TRANSITION_FORCED.test(trimmed)) {
      const text = trimmed
        .replace(/^\s*>\s*/, '')
        .replace(/\s*:\s*$/, '')
        .trim();
      tokens.push({
        type: 'transition',
        text,
        forced: true,
        direction: detectDirection(text),
      });
      i++;
      lastSignificantType = 'transition';
      continue;
    }

    // --- Arabic transition (standalone keyword, optionally with dashes) ---
    if (isPrecededByBlank(tokens) && rules.TRANSITION_ARABIC.test(trimmed)) {
      // Extract clean keyword (strip dashes, colon, whitespace)
      const transitionText = trimmed
        .replace(/^\s*-\s*/, '')
        .replace(/\s*-\s*$/, '')
        .replace(/\s*:\s*$/, '')
        .trim();
      tokens.push({
        type: 'transition',
        text: transitionText,
        direction: 'rtl',
      });
      i++;
      lastSignificantType = 'transition';
      continue;
    }

    // --- English transition (UPPERCASE TO:) ---
    if (rules.TRANSITION_ENGLISH.test(trimmed)) {
      tokens.push({
        type: 'transition',
        text: trimmed,
        direction: 'ltr',
      });
      i++;
      lastSignificantType = 'transition';
      continue;
    }

    // --- Forced character (@ prefix) ---
    const charForcedMatch = trimmed.match(rules.CHARACTER_FORCED);
    if (charForcedMatch) {
      const result = parseCharacterLine(charForcedMatch[1].trim(), true);
      registry.register(result.characterName!);

      tokens.push(result);
      i++;
      lastSignificantType = 'character';

      // Parse dialogue block after character
      i = parseDialogueBlock(lines, i, tokens);
      lastSignificantType = tokens[tokens.length - 1]?.type ?? lastSignificantType;
      continue;
    }

    // --- English character (UPPERCASE) ---
    if (!opts.strictMode && rules.CHARACTER_ENGLISH.test(trimmed)) {
      // Verify preceded by blank line
      if (isPrecededByBlank(tokens)) {
        const result = parseCharacterLine(trimmed, false);
        registry.register(result.characterName!);

        tokens.push(result);
        i++;
        lastSignificantType = 'character';

        // Parse dialogue block
        i = parseDialogueBlock(lines, i, tokens);
        lastSignificantType = tokens[tokens.length - 1]?.type ?? lastSignificantType;
        continue;
      }
    }

    // --- Registered character (auto-detect from registry) ---
    if (opts.enableCharacterRegistry && !opts.strictMode && isPrecededByBlank(tokens)) {
      const nextNonBlank = findNextNonBlankLine(lines, i + 1);
      if (nextNonBlank !== null && registry.isCharacterLine(trimmed, true)) {
        const result = parseCharacterLine(trimmed, false);
        tokens.push(result);
        i++;
        lastSignificantType = 'character';

        // Parse dialogue block
        i = parseDialogueBlock(lines, i, tokens);
        lastSignificantType = tokens[tokens.length - 1]?.type ?? lastSignificantType;
        continue;
      }
    }

    // --- Default: Action ---
    tokens.push({
      type: 'action',
      text: trimmed,
      direction: detectDirection(trimmed),
    });
    i++;
    lastSignificantType = 'action';
  }

  // Remove trailing blank tokens
  while (tokens.length > 0 && tokens[tokens.length - 1].type === 'blank') {
    tokens.pop();
  }

  return tokens;
}

/**
 * Parse a character line into a HekayaToken, extracting name, extension, and dual dialogue.
 */
function parseCharacterLine(text: string, forced: boolean): HekayaToken {
  let characterName = text;
  let characterExtension: string | undefined;
  let dualDialogue = false;

  // Check for dual dialogue ^
  if (rules.DUAL_DIALOGUE.test(text)) {
    dualDialogue = true;
    characterName = text.replace(rules.DUAL_DIALOGUE, '').trim();
  }

  // Extract extension like (V.O.) or (صوت خارجي)
  const extMatch = characterName.match(rules.CHARACTER_EXTENSION);
  if (extMatch) {
    characterExtension = extMatch[1].trim();
    characterName = characterName.replace(rules.CHARACTER_EXTENSION, '').trim();
  }

  return {
    type: 'character',
    text: text.replace(/\s*\^\s*$/, '').trim(),
    characterName,
    characterExtension,
    dualDialogue: dualDialogue || undefined,
    forced,
    direction: detectDirection(characterName),
  };
}

/**
 * Parse dialogue block: parentheticals and dialogue lines following a character.
 * Returns the new line index after the dialogue block.
 */
function parseDialogueBlock(lines: string[], startIndex: number, tokens: HekayaToken[]): number {
  let i = startIndex;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // Blank line ends dialogue block
    if (rules.BLANK_LINE.test(line)) {
      break;
    }

    // Parenthetical
    if (rules.PARENTHETICAL.test(trimmed)) {
      tokens.push({
        type: 'parenthetical',
        text: trimmed,
        direction: detectDirection(trimmed),
      });
      i++;
      continue;
    }

    // Dialogue line
    tokens.push({
      type: 'dialogue',
      text: trimmed,
      direction: detectDirection(trimmed),
    });
    i++;
  }

  return i;
}

/**
 * Check if the last significant (non-blank) token position indicates
 * the current line is preceded by a blank line.
 */
function isPrecededByBlank(tokens: HekayaToken[]): boolean {
  if (tokens.length === 0) return true;
  return tokens[tokens.length - 1].type === 'blank';
}

/**
 * Find the next non-blank line index starting from a given position.
 */
function findNextNonBlankLine(lines: string[], startIndex: number): number | null {
  for (let i = startIndex; i < lines.length; i++) {
    if (!rules.BLANK_LINE.test(lines[i])) {
      return i;
    }
  }
  return null;
}
