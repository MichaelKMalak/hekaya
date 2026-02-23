/**
 * Character Registry for Hekaya.
 *
 * Tracks character names introduced with @ prefix. After first introduction,
 * subsequent standalone lines matching a registered name (followed by dialogue)
 * are auto-detected as character elements without requiring the @ prefix.
 *
 * This solves the fundamental problem of Arabic having no uppercase —
 * Fountain's UPPERCASE detection doesn't work, so we use @ for first
 * introduction and then auto-detect.
 */

import { ALEF_VARIANTS, DIACRITICS } from './rules';

export class CharacterRegistry {
  private knownNames: Set<string> = new Set();

  /**
   * Register a character name. Stores the normalized form.
   */
  register(name: string): void {
    const normalized = this.normalize(name);
    if (normalized) {
      this.knownNames.add(normalized);
    }
  }

  /**
   * Check if a name is registered in the registry.
   */
  isKnown(name: string): boolean {
    return this.knownNames.has(this.normalize(name));
  }

  /**
   * Check if a standalone line could be a registered character name.
   * The line must:
   * 1. Match a registered name (after stripping extensions)
   * 2. Be followed by a non-blank line (dialogue)
   */
  isCharacterLine(line: string, nextLineExists: boolean): boolean {
    if (!nextLineExists) return false;
    const extracted = this.extractName(line);
    return this.isKnown(extracted);
  }

  /**
   * Get all registered character names.
   */
  getAll(): string[] {
    return Array.from(this.knownNames);
  }

  /**
   * Get the count of registered characters.
   */
  get size(): number {
    return this.knownNames.size;
  }

  /**
   * Clear all registered names.
   */
  clear(): void {
    this.knownNames.clear();
  }

  /**
   * Normalize a character name for comparison:
   * 1. Trim whitespace
   * 2. Remove character extensions like (V.O.) or (صوت خارجي)
   * 3. Remove dual dialogue caret ^
   * 4. Strip Arabic diacritics (tashkeel)
   * 5. Normalize alef variants (أ إ آ ٱ → ا)
   */
  normalize(name: string): string {
    return (
      name
        .trim()
        // Remove trailing ^ (dual dialogue)
        .replace(/\s*\^\s*$/, '')
        // Remove parenthetical extensions
        .replace(/\s*\([^)]*\)\s*$/, '')
        .trim()
        // Strip diacritics
        .replace(DIACRITICS, '')
        // Normalize alef variants
        .replace(ALEF_VARIANTS, 'ا')
    );
  }

  /**
   * Extract the character name from a line, removing extensions and markers.
   */
  extractName(line: string): string {
    return this.normalize(
      line
        .trim()
        // Remove @ prefix if present
        .replace(/^@/, ''),
    );
  }
}
