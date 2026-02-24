/**
 * Font loading for Hekaya PDF generation.
 *
 * Arabic font: Cascadia Mono Light 300 / Regular 400
 *   Monospaced, 4319 glyphs, Arabic + Latin coverage.
 *   Light for body text, Regular for headings/emphasis.
 *   Note: Italic variants lack Arabic glyphs, so italic maps to Light (upright).
 *
 * English (LTR) always uses Courier.
 *
 * Font files live in ../fonts/ and are NOT committed to git.
 * Run `pnpm fonts` to download them.
 */

import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = resolve(__dirname, '..', 'fonts');

/**
 * Get font file paths for PdfPrinter constructor.
 *
 * pdfmake requires 4 variants per font family.
 * Cascadia Mono uses Light (300) for body text and Regular (400) for headings/emphasis.
 * Courier has no italic in our download, so we reuse regular/bold.
 */
export function getFontPaths(customFontsDir?: string): Record<string, Record<string, string>> {
  const fontsDir = customFontsDir || FONTS_DIR;

  const cascadiaLight = resolve(fontsDir, 'CascadiaMono-Light.ttf');
  if (!existsSync(cascadiaLight)) {
    throw new Error(
      `Font file not found: ${cascadiaLight}\n` +
        'Run `pnpm fonts` in packages/hekaya-pdf to download fonts.',
    );
  }

  return {
    Courier: {
      normal: resolve(fontsDir, 'Courier-Regular.ttf'),
      bold: resolve(fontsDir, 'Courier-Bold.ttf'),
      italics: resolve(fontsDir, 'Courier-Regular.ttf'),
      bolditalics: resolve(fontsDir, 'Courier-Bold.ttf'),
    },
    CascadiaMono: {
      normal: resolve(fontsDir, 'CascadiaMono-Light.ttf'),
      bold: resolve(fontsDir, 'CascadiaMono-Regular.ttf'),
      italics: resolve(fontsDir, 'CascadiaMono-Light.ttf'), // No Arabic glyphs in italic variants
      bolditalics: resolve(fontsDir, 'CascadiaMono-Regular.ttf'), // No Arabic glyphs in italic variants
    },
  };
}

/** Get the pdfmake font family name for Arabic content. */
export function getArabicFontName(): string {
  return 'CascadiaMono';
}

/** Font family name for English/LTR content. */
export const ENGLISH_FONT = 'Courier';

export const FONTS_DIRECTORY = FONTS_DIR;
