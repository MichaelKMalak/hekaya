/**
 * PDF Generator for Hekaya screenplay markup.
 *
 * Takes a parsed HekayaScript and produces a screenplay PDF
 * with proper RTL layout, Arabic fonts, and standard formatting.
 */

import type { HekayaScript, HekayaToken, TitleEntry, TextDirection } from '@hekaya/parser';
import { getFontPaths, ARABIC_FONT, ENGLISH_FONT } from './fonts';
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
  const mod: any = await import('pdfmake/js/Printer.js');
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

function buildDocDefinition(
  script: HekayaScript,
  dir: 'rtl' | 'ltr',
  opts: Required<PdfOptions>,
): PdfDocDefinition {
  const isRtl = dir === 'rtl';
  const font = isRtl ? ARABIC_FONT : ENGLISH_FONT;
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

    footer: (currentPage: number, _pageCount: number) => {
      // Skip page number on title page
      if (hasTitlePage && currentPage === 1) return null;
      return {
        text: String(currentPage),
        alignment: isRtl ? 'left' : 'right',
        margin: [72, 0, 72, 0],
        fontSize: 12,
        font,
      };
    },
  };
}

function buildTitlePage(entries: TitleEntry[], font: string): PdfTextNode[] {
  const title = entries.find((e) => e.key === 'title');
  const authors = entries.filter((e) => e.key === 'author' || e.key === 'authors');
  const others = entries.filter(
    (e) => e.key !== 'title' && e.key !== 'author' && e.key !== 'authors' && e.key !== 'direction',
  );

  const content: PdfTextNode[] = [];

  // Spacer to push title to center of page
  content.push({ text: '', margin: [0, 144, 0, 0] });

  if (title) {
    content.push({
      text: title.value,
      fontSize: TITLE_PAGE.titleSize,
      bold: true,
      alignment: 'center',
      font,
      margin: [0, 0, 0, 36],
    });
  }

  for (const author of authors) {
    content.push({
      text: author.value,
      fontSize: TITLE_PAGE.authorSize,
      alignment: 'center',
      font,
      margin: [0, 0, 0, 18],
    });
  }

  for (const entry of others) {
    content.push({
      text: entry.value,
      fontSize: TITLE_PAGE.metaSize,
      alignment: 'center',
      font,
      color: '#333333',
      margin: [0, 0, 0, 7],
    });
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
    const node = buildToken(token, layouts);
    if (node) {
      content.push(node);
    }
    i++;
  }

  return content;
}

function buildToken(
  token: HekayaToken,
  layouts: Record<string, ElementLayout>,
): PdfContentNode | null {
  switch (token.type) {
    case 'scene_heading': {
      const layout = layouts.scene_heading;
      const sceneNum = token.sceneNumber ? `${token.sceneNumber}  ` : '';
      return applyLayout(
        {
          text: sceneNum + token.text,
        },
        layout,
      );
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
      return applyLayout({ text: token.text }, layouts.parenthetical);

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
  return {
    ...node,
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

function buildDualDialogue(
  tokens: HekayaToken[],
  firstCharIdx: number,
  secondCharIdx: number,
  _dir: 'rtl' | 'ltr',
  layouts: Record<string, ElementLayout>,
): PdfColumnsNode {
  const firstCol: PdfContentNode[] = [];
  const secondCol: PdfContentNode[] = [];

  // First character block
  let i = firstCharIdx;
  firstCol.push(buildToken(tokens[i], layouts)!);
  i++;
  while (i < tokens.length && tokens[i].type !== 'blank' && tokens[i].type !== 'character') {
    const node = buildToken(tokens[i], layouts);
    if (node) firstCol.push(node);
    i++;
  }

  // Second character block
  i = secondCharIdx;
  secondCol.push(buildToken(tokens[i], layouts)!);
  i++;
  while (i < tokens.length && tokens[i].type !== 'blank' && tokens[i].type !== 'character') {
    const node = buildToken(tokens[i], layouts);
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
    { regex: /\*\*(.+?)\*\*/g, style: { bold: true } },
    { regex: /\*(.+?)\*/g, style: { italics: true } },
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
