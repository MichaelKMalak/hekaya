/**
 * Hekaya — Public API for the Hekaya screenplay parser.
 *
 * Usage:
 *   import { Hekaya } from '@hekaya/parser';
 *
 *   const script = Hekaya.parse(text);
 *   console.log(script.tokens);
 *   console.log(script.characters);
 */

import type { HekayaScript, ParseOptions } from './types';
import { parse } from './lexer';
import { serialize } from './serializer';

export class Hekaya {
  /**
   * Parse a Hekaya or Fountain script string.
   *
   * @param input - The plain text screenplay content
   * @param options - Optional parser configuration
   * @returns The parsed screenplay structure
   */
  static parse(input: string, options?: ParseOptions): HekayaScript {
    return parse(input, options);
  }

  /**
   * Serialize a parsed HekayaScript back to Fountain/Hekaya plain text.
   *
   * @param script - The parsed screenplay structure
   * @returns Plain text in Fountain/Hekaya format
   */
  static serialize(script: HekayaScript): string {
    return serialize(script);
  }
}
