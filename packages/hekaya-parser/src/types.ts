/**
 * All possible Hekaya/Fountain screenplay element types.
 */
export type HekayaElementType =
  | 'title_page'
  | 'scene_heading'
  | 'action'
  | 'character'
  | 'dialogue'
  | 'parenthetical'
  | 'transition'
  | 'centered'
  | 'page_break'
  | 'section'
  | 'synopsis'
  | 'note_inline'
  | 'boneyard'
  | 'lyrics'
  | 'blank';

/**
 * Text direction for bidirectional support.
 */
export type TextDirection = 'rtl' | 'ltr' | 'auto';

/**
 * A single parsed token representing one screenplay element.
 */
export interface HekayaToken {
  type: HekayaElementType;
  text: string;
  /** Original text before inline note/boneyard extraction */
  textRaw?: string;
  /** Per-element direction override */
  direction?: TextDirection;
  /** Section depth (1-6) for section elements */
  depth?: number;
  /** Scene number (e.g., "1" or "١") for scene_heading */
  sceneNumber?: string;
  /** Extracted character name for character elements */
  characterName?: string;
  /** Character extension like (V.O.) or (ص.خ) */
  characterExtension?: string;
  /** Whether this is the second character in dual dialogue */
  dualDialogue?: boolean;
  /** Whether the element was forced with a prefix (@, ., !, >, ~) */
  forced?: boolean;
}

/**
 * A single title page entry.
 */
export interface TitleEntry {
  /** Normalized English key (e.g., "title", "author") */
  key: string;
  /** Original key as written (Arabic or English) */
  keyOriginal: string;
  /** The value text */
  value: string;
}

/**
 * The complete parsed screenplay.
 */
export interface HekayaScript {
  /** Title page key-value pairs */
  titleEntries: TitleEntry[];
  /** Ordered list of screenplay element tokens */
  tokens: HekayaToken[];
  /** All registered character names */
  characters: string[];
  /** Extracted inline notes */
  notes: string[];
  /** Extracted boneyard (comment) content */
  boneyards: string[];
  /** Detected or explicit base text direction */
  direction: TextDirection;
}

/**
 * Options for controlling parser behavior.
 */
export interface ParseOptions {
  /** Default text direction (default: 'auto') */
  defaultDirection?: TextDirection;
  /** Enable auto-detection of registered character names (default: true) */
  enableCharacterRegistry?: boolean;
  /** Only allow explicitly marked elements (default: false) */
  strictMode?: boolean;
  /** Language hint for keyword detection (default: 'auto') */
  language?: 'ar' | 'en' | 'auto';
}
