/**
 * Serializer — converts a parsed HekayaScript back to Fountain/Hekaya plain text.
 *
 * The output preserves all Fountain-compatible syntax so the file can be
 * re-parsed by any Fountain parser (with Hekaya extensions for Arabic).
 */

import type { HekayaScript, HekayaToken, TitleEntry } from './types';

/**
 * Serialize a parsed HekayaScript to Fountain/Hekaya plain text.
 */
export function serialize(script: HekayaScript): string {
  const parts: string[] = [];

  // Title page
  if (script.titleEntries.length > 0) {
    parts.push(serializeTitlePage(script.titleEntries));
    parts.push(''); // blank line to end title page
  }

  // Re-insert boneyards and notes is not possible without position info,
  // so we serialize the tokens as-is.

  // Body tokens
  parts.push(serializeTokens(script.tokens));

  return parts.join('\n');
}

function serializeTitlePage(entries: TitleEntry[]): string {
  const lines: string[] = [];

  for (const entry of entries) {
    // Use the original key (Arabic or English)
    const key = entry.keyOriginal;
    const value = entry.value;

    if (value.includes('\n')) {
      // Multi-line value: key on first line, indented continuation
      lines.push(`${key}:`);
      for (const line of value.split('\n')) {
        lines.push(`   ${line}`);
      }
    } else {
      lines.push(`${key}: ${value}`);
    }
  }

  return lines.join('\n');
}

function serializeTokens(tokens: HekayaToken[]): string {
  const lines: string[] = [];

  for (const token of tokens) {
    switch (token.type) {
      case 'blank':
        lines.push('');
        break;

      case 'scene_heading': {
        let text = token.text;
        if (token.forced) {
          text = `.${text}`;
        }
        if (token.sceneNumber) {
          text = `${text} #${token.sceneNumber}#`;
        }
        lines.push(text);
        break;
      }

      case 'action':
        if (token.forced) {
          lines.push(`!${token.text}`);
        } else {
          lines.push(token.text);
        }
        break;

      case 'character': {
        let name = token.characterName || token.text;
        if (token.characterExtension) {
          name = `${name} (${token.characterExtension})`;
        }
        // Always use @ prefix for forced characters (Arabic names)
        if (token.forced) {
          name = `@${name}`;
        }
        if (token.dualDialogue) {
          name = `${name} ^`;
        }
        lines.push(name);
        break;
      }

      case 'dialogue':
        lines.push(token.text);
        break;

      case 'parenthetical':
        lines.push(token.text);
        break;

      case 'transition':
        // Arabic transitions use `- keyword -` format
        lines.push(`- ${token.text} -`);
        break;

      case 'centered':
        lines.push(`>${token.text}<`);
        break;

      case 'page_break':
        lines.push('===');
        break;

      case 'section': {
        const hashes = '#'.repeat(token.depth || 1);
        lines.push(`${hashes} ${token.text}`);
        break;
      }

      case 'synopsis':
        lines.push(`= ${token.text}`);
        break;

      case 'lyrics':
        lines.push(`~${token.text}`);
        break;

      case 'note_inline':
        lines.push(`[[${token.text}]]`);
        break;

      case 'boneyard':
        lines.push(`/* ${token.text} */`);
        break;

      default:
        // Unknown type — output raw text
        if (token.text) {
          lines.push(token.text);
        }
        break;
    }
  }

  return lines.join('\n');
}
