import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { Hekaya } from '../src/hekaya';

const FIXTURES = join(__dirname, 'fixtures');

function readFixture(name: string): string {
  return readFileSync(join(FIXTURES, name), 'utf-8');
}

describe('integration - fixture files', () => {
  describe('arabic-basic.hekaya', () => {
    it('parses complete Arabic screenplay', () => {
      const input = readFixture('arabic-basic.hekaya');
      const script = Hekaya.parse(input);

      // Title page
      expect(script.titleEntries).toHaveLength(4);
      expect(script.titleEntries[0].key).toBe('title');
      expect(script.titleEntries[0].value).toBe('آخر أيام الصيف');
      expect(script.titleEntries[1].key).toBe('author');
      expect(script.titleEntries[1].value).toBe('سمير عبدالحميد');

      // Direction
      expect(script.direction).toBe('rtl');

      // Characters
      expect(script.characters).toContain('سمير');
      expect(script.characters).toContain('نادية');
      expect(script.characters).toContain('حسن');

      // Scene headings
      const headings = script.tokens.filter((t) => t.type === 'scene_heading');
      expect(headings).toHaveLength(2);
      expect(headings[0].text).toContain('داخلي');
      expect(headings[1].text).toContain('خارجي');

      // Dialogue
      const dialogues = script.tokens.filter((t) => t.type === 'dialogue');
      expect(dialogues.length).toBeGreaterThanOrEqual(4);

      // Parentheticals
      const parens = script.tokens.filter((t) => t.type === 'parenthetical');
      expect(parens.length).toBeGreaterThanOrEqual(1);
      expect(parens[0].text).toBe('(بهدوء)');

      // Transitions
      const transitions = script.tokens.filter((t) => t.type === 'transition');
      expect(transitions.length).toBeGreaterThanOrEqual(1);

      // Centered text
      const centered = script.tokens.filter((t) => t.type === 'centered');
      expect(centered).toHaveLength(1);
      expect(centered[0].text).toBe('النهاية');
    });
  });

  describe('english-standard.fountain', () => {
    it('parses standard Fountain file (backward compatibility)', () => {
      const input = readFixture('english-standard.fountain');
      const script = Hekaya.parse(input);

      // Title page
      expect(script.titleEntries).toHaveLength(3);
      expect(script.titleEntries[0].key).toBe('title');
      expect(script.titleEntries[0].value).toBe('Big Fish');

      // Direction
      expect(script.direction).toBe('ltr');

      // Characters
      expect(script.characters).toContain('JOHN');
      expect(script.characters).toContain('MARY');

      // Scene headings
      const headings = script.tokens.filter((t) => t.type === 'scene_heading');
      expect(headings).toHaveLength(2);
      expect(headings[0].text).toContain('INT.');
      expect(headings[1].text).toContain('EXT.');

      // Dialogue
      const dialogues = script.tokens.filter((t) => t.type === 'dialogue');
      expect(dialogues.length).toBeGreaterThanOrEqual(3);

      // Transitions
      const transitions = script.tokens.filter((t) => t.type === 'transition');
      expect(transitions.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('bilingual-mixed.hekaya', () => {
    it('parses bilingual screenplay', () => {
      const input = readFixture('bilingual-mixed.hekaya');
      const script = Hekaya.parse(input);

      // Mixed title page
      expect(script.titleEntries.length).toBeGreaterThanOrEqual(2);

      // Both Arabic and English characters
      expect(script.characters).toContain('سمير');
      expect(script.characters).toContain('DAVID');

      // Scene heading (Arabic)
      const headings = script.tokens.filter((t) => t.type === 'scene_heading');
      expect(headings.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('edge-cases.hekaya', () => {
    it('parses edge case screenplay', () => {
      const input = readFixture('edge-cases.hekaya');
      const script = Hekaya.parse(input);

      // Forced scene heading
      const headings = script.tokens.filter((t) => t.type === 'scene_heading');
      expect(headings.some((h) => h.forced)).toBe(true);

      // Forced action
      const actions = script.tokens.filter((t) => t.type === 'action');
      expect(actions.some((a) => a.forced)).toBe(true);

      // Character with diacritics
      const characters = script.tokens.filter((t) => t.type === 'character');
      expect(characters.length).toBeGreaterThanOrEqual(2);

      // Dual dialogue
      expect(characters.some((c) => c.dualDialogue)).toBe(true);

      // Page break
      expect(script.tokens.some((t) => t.type === 'page_break')).toBe(true);

      // Scene heading with number
      expect(headings.some((h) => h.sceneNumber)).toBe(true);

      // Character extension
      expect(characters.some((c) => c.characterExtension)).toBe(true);

      // Lyrics
      expect(script.tokens.some((t) => t.type === 'lyrics')).toBe(true);

      // Notes extracted
      expect(script.notes.length).toBeGreaterThanOrEqual(1);

      // Centered text
      expect(script.tokens.some((t) => t.type === 'centered')).toBe(true);

      // Transition
      expect(script.tokens.some((t) => t.type === 'transition')).toBe(true);
    });
  });
});

describe('integration - Hekaya.parse API', () => {
  it('exports parse as static method', () => {
    const script = Hekaya.parse('@سمير\nمرحبا.');
    expect(script.tokens).toBeDefined();
    expect(script.characters).toContain('سمير');
  });

  it('accepts parse options', () => {
    const script = Hekaya.parse('@سمير\nمرحبا.', {
      defaultDirection: 'rtl',
      enableCharacterRegistry: true,
    });
    expect(script.direction).toBe('rtl');
  });

  it('handles empty input', () => {
    const script = Hekaya.parse('');
    expect(script.titleEntries).toHaveLength(0);
    expect(script.tokens).toHaveLength(0);
    expect(script.characters).toHaveLength(0);
  });

  it('handles whitespace-only input', () => {
    const script = Hekaya.parse('   \n\n   ');
    expect(script.tokens).toHaveLength(0);
  });
});
