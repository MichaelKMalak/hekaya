/**
 * HTML Renderer for Hekaya screenplay markup.
 *
 * Takes a parsed HekayaScript and produces formatted HTML
 * with RTL-aware CSS that mirrors standard screenplay layout.
 */

import type { HekayaScript, HekayaToken, TitleEntry, TextDirection } from '@hekaya/parser';
import { processInlineFormatting } from '@hekaya/parser';
import { getStylesheet } from './styles';

export interface RenderOptions {
  /** Include full HTML document wrapper (default: true) */
  fullDocument?: boolean;
  /** Include title page (default: true) */
  includeTitlePage?: boolean;
  /** Include section/synopsis elements (default: false — they're hidden by CSS anyway) */
  includeMetaElements?: boolean;
  /** Custom CSS to append after default styles */
  customCss?: string;
  /** Page title for HTML document (default: script title or 'Hekaya Screenplay') */
  pageTitle?: string;
}

const DEFAULT_OPTIONS: Required<RenderOptions> = {
  fullDocument: true,
  includeTitlePage: true,
  includeMetaElements: false,
  customCss: '',
  pageTitle: '',
};

/**
 * Render a HekayaScript to HTML string.
 */
export function render(script: HekayaScript, options?: RenderOptions): string {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const dir = resolveDirection(script.direction);

  const parts: string[] = [];

  // Title page
  if (opts.includeTitlePage && script.titleEntries.length > 0) {
    parts.push(renderTitlePage(script.titleEntries));
  }

  // Script body
  parts.push(renderBody(script.tokens, dir, opts));

  const bodyHtml = parts.join('\n');

  if (!opts.fullDocument) {
    return bodyHtml;
  }

  // Determine page title
  const title =
    opts.pageTitle ||
    script.titleEntries.find((e) => e.key === 'title')?.value ||
    'Hekaya Screenplay';

  return renderDocument(bodyHtml, dir, title, opts.customCss);
}

function resolveDirection(dir: TextDirection): 'rtl' | 'ltr' {
  return dir === 'auto' ? 'rtl' : dir;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatText(text: string): string {
  return processInlineFormatting(escapeHtml(text));
}

function renderTitlePage(entries: TitleEntry[]): string {
  const title = entries.find((e) => e.key === 'title');
  const authors = entries.filter((e) => e.key === 'author' || e.key === 'authors');
  const others = entries.filter(
    (e) => e.key !== 'title' && e.key !== 'author' && e.key !== 'authors' && e.key !== 'direction',
  );

  const lines: string[] = ['<div class="title-page">'];

  if (title) {
    lines.push(`  <div class="title">${escapeHtml(title.value)}</div>`);
  }

  for (const author of authors) {
    lines.push(`  <div class="author">${escapeHtml(author.value)}</div>`);
  }

  for (const entry of others) {
    lines.push(`  <div class="meta">${escapeHtml(entry.value)}</div>`);
  }

  lines.push('</div>');
  return lines.join('\n');
}

function renderBody(
  tokens: HekayaToken[],
  dir: 'rtl' | 'ltr',
  opts: Required<RenderOptions>,
): string {
  const lines: string[] = ['<div class="screenplay">'];
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

    // Detect dual dialogue: character with dualDialogue flag
    // We need to look back to pair it with the previous character block
    if (token.type === 'character' && token.dualDialogue) {
      // The previous character block is already rendered — wrap in dual dialogue
      // We handle this by looking ahead during character rendering
      lines.push(renderToken(token, dir));
      i++;
      continue;
    }

    // Character + dialogue block
    if (token.type === 'character') {
      // Check if the next character has dual dialogue
      const dialogueEnd = findDialogueEnd(tokens, i + 1);
      const nextChar = dialogueEnd < tokens.length ? findNextNonBlank(tokens, dialogueEnd) : -1;
      const hasDual =
        nextChar >= 0 && tokens[nextChar]?.type === 'character' && tokens[nextChar]?.dualDialogue;

      if (hasDual) {
        // Render dual dialogue container
        lines.push('<div class="dual-dialogue">');

        // First column
        lines.push('  <div class="dual-column">');
        lines.push(`    ${renderToken(token, dir)}`);
        i++;
        while (i < tokens.length && tokens[i].type !== 'blank' && tokens[i].type !== 'character') {
          lines.push(`    ${renderToken(tokens[i], dir)}`);
          i++;
        }
        lines.push('  </div>');

        // Skip blanks between dual dialogue characters
        while (i < tokens.length && tokens[i].type === 'blank') i++;

        // Second column
        if (i < tokens.length && tokens[i].type === 'character') {
          lines.push('  <div class="dual-column">');
          lines.push(`    ${renderToken(tokens[i], dir)}`);
          i++;
          while (
            i < tokens.length &&
            tokens[i].type !== 'blank' &&
            tokens[i].type !== 'character'
          ) {
            lines.push(`    ${renderToken(tokens[i], dir)}`);
            i++;
          }
          lines.push('  </div>');
        }

        lines.push('</div>');
        continue;
      }
    }

    lines.push(renderToken(token, dir));
    i++;
  }

  lines.push('</div>');
  return lines.join('\n');
}

function renderToken(token: HekayaToken, dir: 'rtl' | 'ltr'): string {
  const dirAttr = token.direction && token.direction !== dir ? ` dir="${token.direction}"` : '';

  switch (token.type) {
    case 'scene_heading': {
      const sceneNum = token.sceneNumber
        ? `<span class="scene-number">${escapeHtml(token.sceneNumber)}</span>`
        : '';
      return `<div class="scene-heading"${dirAttr}>${sceneNum}${formatText(token.text)}</div>`;
    }

    case 'action':
      return `<div class="action"${dirAttr}>${formatText(token.text)}</div>`;

    case 'character': {
      const ext = token.characterExtension
        ? ` <span class="extension">(${escapeHtml(token.characterExtension)})</span>`
        : '';
      return `<div class="character"${dirAttr}>${escapeHtml(
        token.characterName || token.text,
      )}${ext}</div>`;
    }

    case 'dialogue':
      return `<div class="dialogue"${dirAttr}>${formatText(token.text)}</div>`;

    case 'parenthetical':
      return `<div class="parenthetical"${dirAttr}>${escapeHtml(token.text)}</div>`;

    case 'transition':
      return `<div class="transition"${dirAttr}>${escapeHtml(token.text)}</div>`;

    case 'centered':
      return `<div class="centered"${dirAttr}>${formatText(token.text)}</div>`;

    case 'page_break':
      return '<hr class="page-break">';

    case 'section':
      return `<div class="section section-${token.depth || 1}"${dirAttr}>${formatText(
        token.text,
      )}</div>`;

    case 'synopsis':
      return `<div class="synopsis"${dirAttr}>${formatText(token.text)}</div>`;

    case 'lyrics':
      return `<div class="lyrics"${dirAttr}>${formatText(token.text)}</div>`;

    default:
      return '';
  }
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

function renderDocument(
  bodyHtml: string,
  dir: 'rtl' | 'ltr',
  title: string,
  customCss: string,
): string {
  const styles = getStylesheet(dir);

  return `<!DOCTYPE html>
<html lang="${dir === 'rtl' ? 'ar' : 'en'}" dir="${dir}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="generator" content="Hekaya Renderer">
  <title>${escapeHtml(title)}</title>
  <style>${styles}${customCss ? '\n' + customCss : ''}</style>
</head>
<body dir="${dir}">
${bodyHtml}
</body>
</html>`;
}
