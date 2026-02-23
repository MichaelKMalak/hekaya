/**
 * Font loading for Hekaya PDF generation.
 *
 * Default fonts:
 *   - Arabic (RTL): Noto Naskh Arabic — proportional naskh, excellent readability
 *     (No monospaced Arabic font exists for screenplays; the industry uses proportional)
 *   - English (LTR): Courier Prime — standard screenplay monospaced font
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
 * Noto Naskh Arabic has no italic variant, so we reuse regular/bold.
 * Courier Prime has no italic either in our download, so we reuse too.
 */
export function getFontPaths(customFontsDir?: string): Record<string, Record<string, string>> {
  const fontsDir = customFontsDir || FONTS_DIR;

  const notoRegular = resolve(fontsDir, 'NotoNaskhArabic-Regular.ttf');
  if (!existsSync(notoRegular)) {
    throw new Error(
      `Font file not found: ${notoRegular}\n` +
        'Run `pnpm fonts` in packages/hekaya-pdf to download fonts.',
    );
  }

  return {
    NotoNaskhArabic: {
      normal: resolve(fontsDir, 'NotoNaskhArabic-Regular.ttf'),
      bold: resolve(fontsDir, 'NotoNaskhArabic-Bold.ttf'),
      italics: resolve(fontsDir, 'NotoNaskhArabic-Regular.ttf'),
      bolditalics: resolve(fontsDir, 'NotoNaskhArabic-Bold.ttf'),
    },
    Courier: {
      normal: resolve(fontsDir, 'Courier-Regular.ttf'),
      bold: resolve(fontsDir, 'Courier-Bold.ttf'),
      italics: resolve(fontsDir, 'Courier-Regular.ttf'),
      bolditalics: resolve(fontsDir, 'Courier-Bold.ttf'),
    },
  };
}

/** Font family name for Arabic content. */
export const ARABIC_FONT = 'NotoNaskhArabic';

/** Font family name for English/LTR content. */
export const ENGLISH_FONT = 'Courier';

export const FONTS_DIRECTORY = FONTS_DIR;
