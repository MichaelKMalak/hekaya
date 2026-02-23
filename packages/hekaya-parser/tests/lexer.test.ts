import { describe, it, expect } from 'vitest';
import { parse } from '../src/lexer';

describe('lexer - parse()', () => {
  describe('title page', () => {
    it('parses Arabic title page keys', () => {
      const input = `العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد
مسودة: المسودة الأولى

داخلي - قهوة - نهار`;

      const script = parse(input);
      expect(script.titleEntries).toHaveLength(3);
      expect(script.titleEntries[0]).toEqual({
        key: 'title',
        keyOriginal: 'العنوان',
        value: 'آخر أيام الصيف',
      });
      expect(script.titleEntries[1]).toEqual({
        key: 'author',
        keyOriginal: 'المؤلف',
        value: 'سمير عبدالحميد',
      });
    });

    it('parses English title page keys', () => {
      const input = `Title: Big Fish
Author: John August

INT. HOUSE - DAY`;

      const script = parse(input);
      expect(script.titleEntries).toHaveLength(2);
      expect(script.titleEntries[0].key).toBe('title');
      expect(script.titleEntries[0].value).toBe('Big Fish');
    });

    it('parses mixed Arabic and English keys', () => {
      const input = `العنوان: The Last Meeting
Author: سمير

داخلي - مكتب - نهار`;

      const script = parse(input);
      expect(script.titleEntries).toHaveLength(2);
      expect(script.titleEntries[0].key).toBe('title');
      expect(script.titleEntries[1].key).toBe('author');
    });

    it('handles multi-line values', () => {
      const input = `المؤلف:
    سمير عبدالحميد
    ونادية حسن

داخلي - قهوة - نهار`;

      const script = parse(input);
      expect(script.titleEntries[0].value).toBe('سمير عبدالحميد\nونادية حسن');
    });

    it('handles no title page', () => {
      const input = `داخلي - قهوة - نهار

سمير قاعد.`;

      const script = parse(input);
      expect(script.titleEntries).toHaveLength(0);
    });

    it('parses explicit direction from title page', () => {
      const input = `اتجاه: يمين-لليسار

داخلي - قهوة - نهار`;

      const script = parse(input);
      expect(script.direction).toBe('rtl');
    });
  });

  describe('scene headings', () => {
    it('parses Arabic scene headings', () => {
      const input = `\nداخلي - قهوة بلدي - نهار`;
      const script = parse(input);
      const heading = script.tokens.find((t) => t.type === 'scene_heading');
      expect(heading).toBeDefined();
      expect(heading!.text).toBe('داخلي - قهوة بلدي - نهار');
    });

    it('parses English scene headings', () => {
      const input = `\nINT. COFFEE SHOP - DAY`;
      const script = parse(input);
      const heading = script.tokens.find((t) => t.type === 'scene_heading');
      expect(heading).toBeDefined();
      expect(heading!.text).toBe('INT. COFFEE SHOP - DAY');
    });

    it('parses forced scene heading', () => {
      const input = `\n.المشهد الخاص`;
      const script = parse(input);
      const heading = script.tokens.find((t) => t.type === 'scene_heading');
      expect(heading).toBeDefined();
      expect(heading!.text).toBe('المشهد الخاص');
      expect(heading!.forced).toBe(true);
    });

    it('extracts scene number', () => {
      const input = `\nداخلي - قهوة - نهار #١#`;
      const script = parse(input);
      const heading = script.tokens.find((t) => t.type === 'scene_heading');
      expect(heading!.sceneNumber).toBe('١');
    });

    it('parses داخلي/خارجي scene heading', () => {
      const input = `\nداخلي/خارجي - سيارة - غروب`;
      const script = parse(input);
      const heading = script.tokens.find((t) => t.type === 'scene_heading');
      expect(heading).toBeDefined();
    });
  });

  describe('characters and dialogue', () => {
    it('parses @ character with dialogue', () => {
      const input = `\n@سمير
قهوة سادة.`;

      const script = parse(input);
      const character = script.tokens.find((t) => t.type === 'character');
      const dialogue = script.tokens.find((t) => t.type === 'dialogue');
      expect(character).toBeDefined();
      expect(character!.characterName).toBe('سمير');
      expect(character!.forced).toBe(true);
      expect(dialogue).toBeDefined();
      expect(dialogue!.text).toBe('قهوة سادة.');
    });

    it('registers character in registry', () => {
      const input = `\n@سمير
حوار.

@نادية
حوار تاني.`;

      const script = parse(input);
      expect(script.characters).toContain('سمير');
      expect(script.characters).toContain('نادية');
    });

    it('parses character with extension', () => {
      const input = `\n@نادية (صوت خارجي)
ألو؟`;

      const script = parse(input);
      const character = script.tokens.find((t) => t.type === 'character');
      expect(character!.characterName).toBe('نادية');
      expect(character!.characterExtension).toBe('صوت خارجي');
    });

    it('parses dual dialogue', () => {
      const input = `\n@سمير
أيوه!

@نادية ^
لأ!`;

      const script = parse(input);
      const characters = script.tokens.filter((t) => t.type === 'character');
      expect(characters).toHaveLength(2);
      expect(characters[1].dualDialogue).toBe(true);
    });

    it('parses UPPERCASE English character', () => {
      const input = `\nJOHN
Hello there.`;

      const script = parse(input);
      const character = script.tokens.find((t) => t.type === 'character');
      expect(character).toBeDefined();
      expect(character!.characterName).toBe('JOHN');
    });

    it('auto-detects registered Arabic character without @', () => {
      const input = `\n@سمير
حوار أول.

سمير
حوار تاني.`;

      const script = parse(input);
      const characters = script.tokens.filter((t) => t.type === 'character');
      expect(characters).toHaveLength(2);
      expect(characters[1].characterName).toBe('سمير');
    });
  });

  describe('parentheticals', () => {
    it('parses Arabic parenthetical', () => {
      const input = `\n@سمير
(بهدوء)
قهوة سادة.`;

      const script = parse(input);
      const paren = script.tokens.find((t) => t.type === 'parenthetical');
      expect(paren).toBeDefined();
      expect(paren!.text).toBe('(بهدوء)');
    });

    it('parses English parenthetical', () => {
      const input = `\nJOHN
(quietly)
One coffee.`;

      const script = parse(input);
      const paren = script.tokens.find((t) => t.type === 'parenthetical');
      expect(paren).toBeDefined();
      expect(paren!.text).toBe('(quietly)');
    });
  });

  describe('transitions', () => {
    it('parses Arabic transition as standalone keyword', () => {
      const input = `\nقطع`;
      const script = parse(input);
      const transition = script.tokens.find((t) => t.type === 'transition');
      expect(transition).toBeDefined();
      expect(transition!.text).toBe('قطع');
    });

    it('parses Arabic transition with dashes', () => {
      const input = `\n- قطع -`;
      const script = parse(input);
      const transition = script.tokens.find((t) => t.type === 'transition');
      expect(transition).toBeDefined();
      expect(transition!.text).toBe('قطع');
    });

    it('parses multi-word Arabic transition', () => {
      const input = `\n- اختفاء تدريجي -`;
      const script = parse(input);
      const transition = script.tokens.find((t) => t.type === 'transition');
      expect(transition).toBeDefined();
      expect(transition!.text).toBe('اختفاء تدريجي');
    });

    it('parses Arabic transition with backward-compat colon', () => {
      const input = `\nقطع إلى:`;
      const script = parse(input);
      const transition = script.tokens.find((t) => t.type === 'transition');
      expect(transition).toBeDefined();
      expect(transition!.text).toBe('قطع إلى');
    });

    it('parses forced transition', () => {
      const input = `\n>قطع إلى:`;
      const script = parse(input);
      const transition = script.tokens.find((t) => t.type === 'transition');
      expect(transition).toBeDefined();
      expect(transition!.forced).toBe(true);
    });

    it('parses English transition', () => {
      const input = `\nCUT TO:`;
      const script = parse(input);
      const transition = script.tokens.find((t) => t.type === 'transition');
      expect(transition).toBeDefined();
      expect(transition!.text).toBe('CUT TO:');
    });

    it('only parses transition after blank line', () => {
      const input = `some action\nقطع`;
      const script = parse(input);
      const transition = script.tokens.find((t) => t.type === 'transition');
      expect(transition).toBeUndefined();
    });
  });

  describe('action', () => {
    it('parses plain text as action', () => {
      const input = `\nسمير قاعد لوحده في القهوة.`;
      const script = parse(input);
      const action = script.tokens.find((t) => t.type === 'action');
      expect(action).toBeDefined();
      expect(action!.text).toBe('سمير قاعد لوحده في القهوة.');
    });

    it('parses forced action', () => {
      const input = `\n!سمير يمشي.`;
      const script = parse(input);
      const action = script.tokens.find((t) => t.type === 'action');
      expect(action).toBeDefined();
      expect(action!.text).toBe('سمير يمشي.');
      expect(action!.forced).toBe(true);
    });
  });

  describe('centered text', () => {
    it('parses centered Arabic text', () => {
      const input = `\n>النهاية<`;
      const script = parse(input);
      const centered = script.tokens.find((t) => t.type === 'centered');
      expect(centered).toBeDefined();
      expect(centered!.text).toBe('النهاية');
    });
  });

  describe('page breaks', () => {
    it('parses page break', () => {
      const input = `\n===`;
      const script = parse(input);
      const pb = script.tokens.find((t) => t.type === 'page_break');
      expect(pb).toBeDefined();
    });
  });

  describe('sections', () => {
    it('parses Arabic section', () => {
      const input = `\n# الفصل الأول`;
      const script = parse(input);
      const section = script.tokens.find((t) => t.type === 'section');
      expect(section).toBeDefined();
      expect(section!.text).toBe('الفصل الأول');
      expect(section!.depth).toBe(1);
    });

    it('parses nested sections', () => {
      const input = `\n## المشهد الأول`;
      const script = parse(input);
      const section = script.tokens.find((t) => t.type === 'section');
      expect(section!.depth).toBe(2);
    });
  });

  describe('synopses', () => {
    it('parses synopsis', () => {
      const input = `\n= سمير يقابل حسن في القهوة`;
      const script = parse(input);
      const synopsis = script.tokens.find((t) => t.type === 'synopsis');
      expect(synopsis).toBeDefined();
      expect(synopsis!.text).toBe('سمير يقابل حسن في القهوة');
    });
  });

  describe('lyrics', () => {
    it('parses lyrics', () => {
      const input = `\n~يا ليل يا عين`;
      const script = parse(input);
      const lyrics = script.tokens.find((t) => t.type === 'lyrics');
      expect(lyrics).toBeDefined();
      expect(lyrics!.text).toBe('يا ليل يا عين');
    });
  });

  describe('notes and boneyards', () => {
    it('extracts inline notes', () => {
      const input = `\nسمير يمشي [[ملاحظة هنا]] في الشارع.`;
      const script = parse(input);
      expect(script.notes).toHaveLength(1);
      expect(script.notes[0]).toBe('ملاحظة هنا');
    });

    it('extracts boneyards', () => {
      const input = `\n/* محذوف */\nسمير يمشي.`;
      const script = parse(input);
      expect(script.boneyards).toHaveLength(1);
      expect(script.boneyards[0]).toBe('محذوف');
    });
  });

  describe('edge cases', () => {
    it('handles Windows CRLF line endings', () => {
      const input = 'العنوان: اختبار\r\n\r\nداخلي - غرفة - نهار\r\n\r\n@سمير\r\nأنا هنا.\r\n';
      const script = parse(input);
      expect(script.titleEntries.length).toBeGreaterThan(0);
      const heading = script.tokens.find((t) => t.type === 'scene_heading');
      expect(heading).toBeDefined();
    });

    it('handles empty input string', () => {
      const script = parse('');
      expect(script.tokens).toHaveLength(0);
      expect(script.titleEntries).toHaveLength(0);
    });

    it('handles input with only whitespace', () => {
      const script = parse('   \n  \n   ');
      const nonBlank = script.tokens.filter((t) => t.type !== 'blank');
      expect(nonBlank).toHaveLength(0);
    });

    it('handles very long single line', () => {
      const longLine = '\n' + 'ا'.repeat(2000);
      const script = parse(longLine);
      const action = script.tokens.find((t) => t.type === 'action');
      expect(action).toBeDefined();
      expect(action!.text.length).toBeGreaterThanOrEqual(2000);
    });

    it('handles mixed CRLF and LF', () => {
      const input = 'العنوان: اختبار\r\n\nداخلي - غرفة - نهار\n\r\n@سمير\nأنا هنا.';
      const script = parse(input);
      const heading = script.tokens.find((t) => t.type === 'scene_heading');
      expect(heading).toBeDefined();
    });
  });

  describe('direction detection', () => {
    it('detects RTL for Arabic content', () => {
      const input = `العنوان: الرحلة

داخلي - قهوة - نهار`;

      const script = parse(input);
      expect(script.direction).toBe('rtl');
    });

    it('detects LTR for English content', () => {
      const input = `Title: Big Fish

INT. HOUSE - DAY`;

      const script = parse(input);
      expect(script.direction).toBe('ltr');
    });

    it('respects explicit direction', () => {
      const input = `Direction: rtl

INT. HOUSE - DAY`;

      const script = parse(input);
      expect(script.direction).toBe('rtl');
    });
  });
});
