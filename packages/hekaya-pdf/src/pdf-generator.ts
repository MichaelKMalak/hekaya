/**
 * PDF Generator for Hekaya screenplay markup.
 *
 * Takes a parsed HekayaScript and produces a screenplay PDF
 * with proper RTL layout, Arabic fonts, and standard formatting.
 */

import type { HekayaScript, HekayaToken, TitleEntry, TextDirection } from '@hekaya/parser';
import { getFontPaths, getArabicFontName, ENGLISH_FONT } from './fonts';
import {
  PAGE_SIZE,
  getPageMargins,
  getElementLayouts,
  FONT_CONFIG,
  TITLE_PAGE,
  type ElementLayout,
} from './page-layout';
import type {
  PdfTextSegment,
  PdfTextNode,
  PdfColumnsNode,
  PdfContentNode,
  PdfDocDefinition,
  InlineStyle,
} from './pdf-types';

export interface PdfOptions {
  /** Include title page (default: true) */
  includeTitlePage?: boolean;
  /** Include section/synopsis elements (default: false) */
  includeMetaElements?: boolean;
  /** Custom fonts directory */
  fontsDir?: string;
}

const DEFAULT_OPTIONS: Required<PdfOptions> = {
  includeTitlePage: true,
  includeMetaElements: false,
  fontsDir: '',
};

/**
 * Load PdfPrinter class from pdfmake CJS module.
 * Handles the ESM/CJS interop difference between Node.js and Vitest.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- CJS interop: pdfmake has no ESM types
async function loadPdfPrinter(): Promise<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- dynamic import returns unknown CJS shape
  const mod: any = await import('@digicole/pdfmake-rtl/js/Printer.js');
  // In Vitest: mod.default is the PdfPrinter class (function)
  // In Node.js ESM: mod.default is { __esModule: true, default: PdfPrinter }
  const candidate = mod.default;
  if (typeof candidate === 'function') return candidate;
  if (candidate && typeof candidate.default === 'function') return candidate.default;
  throw new Error('Failed to load PdfPrinter from pdfmake');
}

/**
 * Generate a PDF buffer from a parsed HekayaScript.
 */
export async function generatePdf(script: HekayaScript, options?: PdfOptions): Promise<Buffer> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const dir = resolveDirection(script.direction);
  const fontPaths = getFontPaths(opts.fontsDir || undefined);
  const PdfPrinter = await loadPdfPrinter();
  const printer = new PdfPrinter(fontPaths);

  const docDefinition = buildDocDefinition(script, dir, opts);
  const pdfDoc = await printer.createPdfKitDocument(docDefinition);

  return new Promise<Buffer>((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    pdfDoc.on('data', (chunk: Uint8Array) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', reject);
    pdfDoc.end();
  });
}

function resolveDirection(dir: TextDirection): 'rtl' | 'ltr' {
  return dir === 'auto' ? 'rtl' : dir;
}

/**
 * Fix digit sequences in RTL text for pdfmake-rtl.
 * pdfmake-rtl reverses the character order of digit runs, so ٢٠٢٦ renders as ٦٢٠٢.
 * We pre-reverse each contiguous digit group so that after pdfmake-rtl reverses them,
 * the digits display in the correct order.
 *
 * Dates in source should be written in logical order: ٢٠٢٦/٢/٢٣ (year/month/day).
 * pdfmake-rtl will reverse the overall RTL flow, producing the visual: ٢٣/٢/٢٠٢٦.
 */
function fixRtlNumbers(text: string): string {
  // Reverse each contiguous run of digits (Arabic-Indic or Western)
  return text.replace(/[٠-٩]+|[0-9]+/g, (match) => match.split('').reverse().join(''));
}

/** Convert a Western number to Arabic-Indic numerals (0→٠, 1→١, ..., 9→٩). */
function toArabicIndic(n: number): string {
  return String(n).replace(/[0-9]/g, (d) => String.fromCharCode(0x0660 + Number(d)));
}

function buildDocDefinition(
  script: HekayaScript,
  dir: 'rtl' | 'ltr',
  opts: Required<PdfOptions>,
): PdfDocDefinition {
  const isRtl = dir === 'rtl';
  const font = isRtl ? getArabicFontName() : ENGLISH_FONT;
  const fontConfig = isRtl ? FONT_CONFIG.rtl : FONT_CONFIG.ltr;
  const hasTitlePage = opts.includeTitlePage && script.titleEntries.length > 0;

  const content: PdfContentNode[] = [];

  // Title page
  if (hasTitlePage) {
    content.push(...buildTitlePage(script.titleEntries, font));
  }

  // Body
  content.push(...buildBody(script.tokens, dir, opts));

  return {
    pageSize: PAGE_SIZE,
    pageMargins: getPageMargins(dir),

    content,

    defaultStyle: {
      font,
      fontSize: fontConfig.fontSize,
      lineHeight: fontConfig.lineHeight,
    },

    header: (currentPage: number, _pageCount: number) => {
      // Per screenplay standard: no number on title page or first script page
      // Numbering starts at page 2 of the script (displayed as 2)
      const firstScriptPage = hasTitlePage ? 2 : 1;
      if (currentPage <= firstScriptPage) return null;

      // Script page number (subtract title page offset if present)
      const scriptPage = hasTitlePage ? currentPage - 1 : currentPage;
      const pageStr = isRtl ? toArabicIndic(scriptPage) : String(scriptPage);

      // Standard: 0.5" from top (36pt), 1" from side edge (72pt)
      // RTL: top-left, LTR: top-right
      // Use columns layout to force positioning — pdfmake-rtl overrides
      // alignment:'left' to 'right' on Arabic text nodes.
      // Use columns with a spacer to force left/right positioning —
      // pdfmake-rtl overrides alignment:'left' to 'right' on Arabic text.
      const pageNumCol = {
        width: 'auto' as const,
        text: fixRtlNumbers(pageStr),
        fontSize: 12,
        font,
      };
      const spacerCol = { width: '*' as const, text: '' };

      return {
        columns: isRtl
          ? [pageNumCol, spacerCol] // number on left, spacer fills right
          : [spacerCol, pageNumCol], // spacer fills left, number on right
        columnGap: 0,
        margin: [72, 36, 72, 0] as [number, number, number, number],
      };
    },
  };
}

/**
 * Strip inline formatting markers from text for title page display.
 * _**text**_ → text, **text** → text, *text* → text, _text_ → text
 */
function stripFormatting(text: string): string {
  return text
    .replace(/\*{3}(.+?)\*{3}/g, '$1')
    .replace(/\*{2}(.+?)\*{2}/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/_(.+?)_/g, '$1');
}

function buildTitlePage(entries: TitleEntry[], font: string): PdfTextNode[] {
  const title = entries.find((e) => e.key === 'title');
  const credit = entries.find((e) => e.key === 'credit');
  const authors = entries.filter((e) => e.key === 'author' || e.key === 'authors');
  const source = entries.find((e) => e.key === 'source');
  const others = entries.filter(
    (e) =>
      e.key !== 'title' &&
      e.key !== 'credit' &&
      e.key !== 'author' &&
      e.key !== 'authors' &&
      e.key !== 'source' &&
      e.key !== 'direction',
  );

  // Split "others" into upper-center (draft date, date) and lower-left (contact, etc.)
  const upperKeys = new Set(['draft date', 'date', 'copyright', 'notes']);
  const upperOthers = others.filter((e) => upperKeys.has(e.key));
  const lowerOthers = others.filter((e) => !upperKeys.has(e.key));

  const content: PdfTextNode[] = [];

  // Spacer to push title to ~1/3 down the page
  content.push({ text: '', margin: [0, 180, 0, 0] });

  // Title — centered, large, bold
  if (title) {
    content.push({
      text: fixRtlNumbers(stripFormatting(title.value)),
      fontSize: TITLE_PAGE.titleSize,
      bold: true,
      alignment: 'center',
      font,
      margin: [0, 0, 0, 24],
    });
  }

  // Credit line (e.g., "written by" / "قصة أصلية")
  if (credit) {
    content.push({
      text: fixRtlNumbers(credit.value),
      fontSize: TITLE_PAGE.metaSize,
      alignment: 'center',
      font,
      margin: [0, 0, 0, 12],
    });
  }

  // Authors — centered
  for (const author of authors) {
    content.push({
      text: fixRtlNumbers(author.value),
      fontSize: TITLE_PAGE.authorSize,
      alignment: 'center',
      font,
      margin: [0, 0, 0, 12],
    });
  }

  // Source line
  if (source) {
    content.push({
      text: fixRtlNumbers(source.value),
      fontSize: TITLE_PAGE.metaSize,
      alignment: 'center',
      font,
      margin: [0, 0, 0, 12],
    });
  }

  // Other upper-center metadata (date, draft, etc.)
  for (const entry of upperOthers) {
    content.push({
      text: fixRtlNumbers(entry.value),
      fontSize: TITLE_PAGE.metaSize,
      alignment: 'center',
      font,
      color: '#333333',
      margin: [0, 0, 0, 7],
    });
  }

  // Lower metadata (contact info) — pushed to bottom-left (or bottom-right for RTL)
  if (lowerOthers.length > 0) {
    // Spacer to push contact info toward bottom
    content.push({ text: '', margin: [0, 120, 0, 0] });
    for (const entry of lowerOthers) {
      const lines = entry.value.split('\n');
      for (const line of lines) {
        content.push({
          text: fixRtlNumbers(line),
          fontSize: TITLE_PAGE.metaSize,
          alignment: 'left',
          font,
          color: '#333333',
          margin: [0, 0, 0, 4],
        });
      }
    }
  }

  // Page break after title page
  content.push({ text: '', pageBreak: 'after' });

  return content;
}

function buildBody(
  tokens: HekayaToken[],
  dir: 'rtl' | 'ltr',
  opts: Required<PdfOptions>,
): PdfContentNode[] {
  const layouts = getElementLayouts(dir);
  const content: PdfContentNode[] = [];
  let i = 0;

  while (i < tokens.length) {
    const token = tokens[i];

    // Skip blanks
    if (token.type === 'blank') {
      i++;
      continue;
    }

    // Skip meta elements unless requested
    if (!opts.includeMetaElements && (token.type === 'section' || token.type === 'synopsis')) {
      i++;
      continue;
    }

    // Handle dual dialogue
    if (token.type === 'character') {
      const dialogueEnd = findDialogueEnd(tokens, i + 1);
      const nextChar = dialogueEnd < tokens.length ? findNextNonBlank(tokens, dialogueEnd) : -1;
      const hasDual =
        nextChar >= 0 && tokens[nextChar]?.type === 'character' && tokens[nextChar]?.dualDialogue;

      if (hasDual) {
        const dualContent = buildDualDialogue(tokens, i, nextChar, dir, layouts);
        content.push(dualContent);

        // Skip past both dialogue blocks
        i = nextChar + 1;
        while (
          i < tokens.length &&
          tokens[i].type !== 'blank' &&
          tokens[i].type !== 'scene_heading'
        ) {
          i++;
        }
        continue;
      }
    }

    // Regular token
    const node = buildToken(token, layouts, dir);
    if (node) {
      content.push(node);
    }
    i++;
  }

  return content;
}

/**
 * Build a scene heading as a 3-column layout: type - location - time.
 * For RTL: right = scene type (داخلي), center = location (قهوة بلدي), left = time (نهار)
 * Falls back to single bold line if the heading doesn't have dash separators.
 */
function buildSceneHeading(
  token: HekayaToken,
  layout: ElementLayout,
  dir: 'rtl' | 'ltr',
): PdfContentNode {
  const text = token.text;
  const sceneNum = token.sceneNumber ? `${token.sceneNumber}  ` : '';

  // Try to split on " - " separator (standard scene heading format)
  const parts = text.split(/\s*-\s*/);

  if (parts.length >= 3) {
    // 3-part heading: type - location - time
    const isRtl = dir === 'rtl';
    const [sceneType, ...rest] = parts;
    const timeOfDay = rest.pop()!;
    const location = rest.join(' - '); // Handle locations with dashes

    return {
      columns: [
        {
          width: 'auto',
          text: isRtl ? timeOfDay : sceneNum + sceneType,
          bold: true,
          alignment: 'left',
        },
        {
          width: '*',
          text: location,
          bold: true,
          alignment: 'center',
        },
        {
          width: 'auto',
          text: isRtl ? sceneNum + sceneType : timeOfDay,
          bold: true,
          alignment: 'right',
        },
      ],
      columnGap: 4,
      margin: [
        layout.marginLeft,
        layout.marginTop || 0,
        layout.marginRight,
        layout.marginBottom || 0,
      ],
      bold: true,
    };
  }

  // Fallback: single bold line for non-standard headings
  return applyLayout({ text: sceneNum + text }, layout);
}

function buildToken(
  token: HekayaToken,
  layouts: Record<string, ElementLayout>,
  dir: 'rtl' | 'ltr' = 'rtl',
): PdfContentNode | null {
  switch (token.type) {
    case 'scene_heading': {
      const layout = layouts.scene_heading;
      return buildSceneHeading(token, layout, dir);
    }

    case 'action':
      return applyLayout({ text: formatInlineText(token.text) }, layouts.action);

    case 'character': {
      const layout = layouts.character;
      const ext = token.characterExtension ? ` (${token.characterExtension})` : '';
      return applyLayout({ text: (token.characterName || token.text) + ext }, layout);
    }

    case 'dialogue':
      return applyLayout({ text: formatInlineText(token.text) }, layouts.dialogue);

    case 'parenthetical':
      return applyLayout({ text: token.text, italics: true }, layouts.parenthetical);

    case 'transition':
      return applyLayout({ text: token.text }, layouts.transition);

    case 'centered':
      return applyLayout({ text: formatInlineText(token.text) }, layouts.centered);

    case 'page_break':
      return { text: '', pageBreak: 'after' };

    case 'section':
      return applyLayout({ text: formatInlineText(token.text) }, layouts.section);

    case 'synopsis':
      return applyLayout({ text: formatInlineText(token.text) }, layouts.synopsis);

    case 'lyrics':
      return applyLayout({ text: formatInlineText(token.text), italics: true }, layouts.lyrics);

    default:
      return null;
  }
}

function applyLayout(node: PdfTextNode, layout: ElementLayout): PdfTextNode {
  // Fix number ordering in RTL text
  let text = typeof node.text === 'string' ? fixRtlNumbers(node.text) : node.text;

  // pdfmake-rtl auto-sets alignment:'right' on Arabic text segments that lack alignment.
  // When text is an array of segments, propagate the layout alignment to each segment
  // so pdfmake-rtl doesn't override it.
  if (Array.isArray(text)) {
    text = text.map((seg) => {
      if (typeof seg === 'object' && !seg.alignment) {
        return { ...seg, alignment: layout.alignment };
      }
      return seg;
    });
  }

  return {
    ...node,
    text,
    alignment: layout.alignment,
    bold: layout.bold || node.bold || false,
    margin: [
      layout.marginLeft,
      layout.marginTop || 0,
      layout.marginRight,
      layout.marginBottom || 0,
    ],
  };
}

/**
 * Build a single token for use inside a dual dialogue column.
 * Uses simplified margins (no element indentation) since the columns are narrow.
 */
function buildDualToken(token: HekayaToken, dir: 'rtl' | 'ltr'): PdfTextNode | null {
  const isRtl = dir === 'rtl';
  const alignment = isRtl ? 'right' : 'left';

  switch (token.type) {
    case 'character': {
      const ext = token.characterExtension ? ` (${token.characterExtension})` : '';
      return {
        text: fixRtlNumbers((token.characterName || token.text) + ext),
        bold: true,
        alignment: 'center',
        margin: [0, 0, 0, 0],
      };
    }
    case 'dialogue':
      return {
        text: formatInlineText(token.text),
        alignment,
        margin: [0, 0, 0, 0],
      };
    case 'parenthetical':
      return {
        text: fixRtlNumbers(token.text),
        italics: true,
        alignment: 'center',
        margin: [0, 0, 0, 0],
      };
    default:
      return null;
  }
}

function buildDualDialogue(
  tokens: HekayaToken[],
  firstCharIdx: number,
  secondCharIdx: number,
  dir: 'rtl' | 'ltr',
  _layouts: Record<string, ElementLayout>,
): PdfColumnsNode {
  const firstCol: PdfContentNode[] = [];
  const secondCol: PdfContentNode[] = [];

  // First character block
  let i = firstCharIdx;
  const firstNode = buildDualToken(tokens[i], dir);
  if (firstNode) firstCol.push(firstNode);
  i++;
  while (i < tokens.length && tokens[i].type !== 'blank' && tokens[i].type !== 'character') {
    const node = buildDualToken(tokens[i], dir);
    if (node) firstCol.push(node);
    i++;
  }

  // Second character block
  i = secondCharIdx;
  const secondNode = buildDualToken(tokens[i], dir);
  if (secondNode) secondCol.push(secondNode);
  i++;
  while (i < tokens.length && tokens[i].type !== 'blank' && tokens[i].type !== 'character') {
    const node = buildDualToken(tokens[i], dir);
    if (node) secondCol.push(node);
    i++;
  }

  return {
    columns: [
      { width: '48%', stack: firstCol },
      { width: '4%', text: '' },
      { width: '48%', stack: secondCol },
    ],
    columnGap: 0,
    margin: [0, 12, 0, 0],
  };
}

/**
 * Parse inline formatting (bold, italic, underline) into pdfmake text arrays.
 *
 * Converts:
 *   **bold** → { text: 'bold', bold: true }
 *   *italic* → { text: 'italic', italics: true }
 *   _underline_ → { text: 'underline', decoration: 'underline' }
 */
function formatInlineText(text: string): string | (string | PdfTextSegment)[] {
  // Quick check — if no formatting markers, return plain string
  if (!/[*_]/.test(text)) return text;

  const segments: (string | PdfTextSegment)[] = [];

  const patterns: Array<{ regex: RegExp; style: InlineStyle }> = [
    { regex: /\*{3}(.+?)\*{3}/g, style: { bold: true, italics: true } },
    { regex: /\*{2}(.+?)\*{2}/g, style: { bold: true } },
    { regex: /(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, style: { italics: true } },
    { regex: /_(.+?)_/g, style: { decoration: 'underline' } },
  ];

  const result = text;
  const parts: Array<{ start: number; end: number; inner: string; style: InlineStyle }> = [];

  // Collect all matches
  for (const { regex, style } of patterns) {
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(result)) !== null) {
      parts.push({
        start: match.index,
        end: match.index + match[0].length,
        inner: match[1],
        style,
      });
    }
  }

  if (parts.length === 0) return text;

  // Sort by position, remove overlapping
  parts.sort((a, b) => a.start - b.start);
  const filtered: typeof parts = [];
  for (const part of parts) {
    if (filtered.length === 0 || part.start >= filtered[filtered.length - 1].end) {
      filtered.push(part);
    }
  }

  // Build segments
  let pos = 0;
  for (const part of filtered) {
    if (part.start > pos) {
      segments.push(result.slice(pos, part.start));
    }
    segments.push({ text: part.inner, ...part.style });
    pos = part.end;
  }
  if (pos < result.length) {
    segments.push(result.slice(pos));
  }

  return segments.length === 1 && typeof segments[0] === 'string' ? segments[0] : segments;
}

function findDialogueEnd(tokens: HekayaToken[], start: number): number {
  let i = start;
  while (i < tokens.length) {
    const type = tokens[i].type;
    if (
      type === 'blank' ||
      type === 'scene_heading' ||
      type === 'transition' ||
      type === 'page_break'
    ) {
      return i;
    }
    if (type === 'character') return i;
    i++;
  }
  return i;
}

function findNextNonBlank(tokens: HekayaToken[], start: number): number {
  for (let i = start; i < tokens.length; i++) {
    if (tokens[i].type !== 'blank') return i;
  }
  return -1;
}
