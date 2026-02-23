import { describe, it, expect } from 'vitest';
import * as rules from '../src/rules';

describe('rules', () => {
  describe('SCENE_HEADING', () => {
    it('matches Arabic scene heading keywords', () => {
      expect(rules.SCENE_HEADING.test('داخلي. قهوة بلدي - نهار')).toBe(true);
      expect(rules.SCENE_HEADING.test('خارجي. شارع - ليل')).toBe(true);
      expect(rules.SCENE_HEADING.test('تأسيس. القاهرة')).toBe(true);
      expect(rules.SCENE_HEADING.test('داخلي/خارجي. سيارة - غروب')).toBe(true);
      expect(rules.SCENE_HEADING.test('خارجي/داخلي. سيارة - غروب')).toBe(true);
      expect(rules.SCENE_HEADING.test('د/خ. عربية')).toBe(true);
    });

    it('matches Arabic scene heading keywords with dash separator', () => {
      expect(rules.SCENE_HEADING.test('داخلي - قهوة بلدي - نهار')).toBe(true);
      expect(rules.SCENE_HEADING.test('خارجي - شارع - ليل')).toBe(true);
      expect(rules.SCENE_HEADING.test('داخلي/خارجي - سيارة - غروب')).toBe(true);
    });

    it('matches English scene heading keywords', () => {
      expect(rules.SCENE_HEADING.test('INT. COFFEE SHOP - DAY')).toBe(true);
      expect(rules.SCENE_HEADING.test('EXT. CITY STREET - NIGHT')).toBe(true);
      expect(rules.SCENE_HEADING.test('EST. THE CITY')).toBe(true);
      expect(rules.SCENE_HEADING.test('INT./EXT. CAR - MOVING')).toBe(true);
      expect(rules.SCENE_HEADING.test('INT/EXT. CAR')).toBe(true);
      expect(rules.SCENE_HEADING.test('EXT/INT. CAR')).toBe(true);
      expect(rules.SCENE_HEADING.test('EXT./INT. CAR')).toBe(true);
      expect(rules.SCENE_HEADING.test('I/E. HOUSE')).toBe(true);
    });

    it('matches forced scene heading with period prefix', () => {
      expect(rules.SCENE_HEADING.test('.المشهد الخاص')).toBe(true);
      expect(rules.SCENE_HEADING.test('.CUSTOM SCENE')).toBe(true);
    });

    it('does not match regular text', () => {
      expect(rules.SCENE_HEADING.test('سمير يمشي في الشارع')).toBe(false);
      expect(rules.SCENE_HEADING.test('John walks down the street')).toBe(false);
      expect(rules.SCENE_HEADING.test('..three dots')).toBe(false);
    });

    it('does not match double period (ellipsis start)', () => {
      expect(rules.SCENE_HEADING.test('...')).toBe(false);
    });
  });

  describe('SCENE_NUMBER', () => {
    it('matches Western numerals', () => {
      const match = 'داخلي. قهوة - نهار #1#'.match(rules.SCENE_NUMBER);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('1');
    });

    it('matches Arabic numerals', () => {
      const match = 'داخلي. قهوة - نهار #١#'.match(rules.SCENE_NUMBER);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('١');
    });

    it('matches multi-digit numbers', () => {
      const match = 'INT. HOUSE - DAY #12A#'.match(rules.SCENE_NUMBER);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('12A');
    });

    it('does not match without hash delimiters', () => {
      expect('داخلي. قهوة - نهار 1'.match(rules.SCENE_NUMBER)).toBeNull();
    });
  });

  describe('CHARACTER_FORCED', () => {
    it('matches @ prefix with Arabic name', () => {
      const match = '@سمير'.match(rules.CHARACTER_FORCED);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('سمير');
    });

    it('matches @ prefix with extension', () => {
      const match = '@سمير (صوت خارجي)'.match(rules.CHARACTER_FORCED);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('سمير (صوت خارجي)');
    });

    it('matches @ prefix with English name', () => {
      const match = '@McCLOUD'.match(rules.CHARACTER_FORCED);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('McCLOUD');
    });

    it('does not match without @ prefix', () => {
      expect('سمير'.match(rules.CHARACTER_FORCED)).toBeNull();
    });
  });

  describe('CHARACTER_ENGLISH', () => {
    it('matches UPPERCASE English names', () => {
      expect(rules.CHARACTER_ENGLISH.test('JOHN')).toBe(true);
      expect(rules.CHARACTER_ENGLISH.test('MARY JANE')).toBe(true);
      expect(rules.CHARACTER_ENGLISH.test("JOHN O'BRIEN")).toBe(true);
    });

    it('matches with extensions', () => {
      expect(rules.CHARACTER_ENGLISH.test('JOHN (V.O.)')).toBe(true);
      expect(rules.CHARACTER_ENGLISH.test("JOHN (CONT'D)")).toBe(true);
    });

    it('matches with dual dialogue marker', () => {
      expect(rules.CHARACTER_ENGLISH.test('MARY ^')).toBe(true);
    });

    it('does not match lowercase', () => {
      expect(rules.CHARACTER_ENGLISH.test('John')).toBe(false);
      expect(rules.CHARACTER_ENGLISH.test('john')).toBe(false);
    });

    it('does not match mixed case', () => {
      expect(rules.CHARACTER_ENGLISH.test('JoHn')).toBe(false);
    });
  });

  describe('DUAL_DIALOGUE', () => {
    it('matches trailing caret', () => {
      expect(rules.DUAL_DIALOGUE.test('JOHN ^')).toBe(true);
      expect(rules.DUAL_DIALOGUE.test('JOHN^')).toBe(true);
    });

    it('does not match caret in middle', () => {
      expect(rules.DUAL_DIALOGUE.test('JOHN ^ SMITH')).toBe(false);
    });
  });

  describe('TRANSITION_ARABIC', () => {
    it('matches standalone Arabic transition keywords', () => {
      expect(rules.TRANSITION_ARABIC.test('قطع')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('قطع إلى')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('قطع مفاجئ')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('قطع متطابق')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('اختفاء تدريجي')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('ظهور تدريجي')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('مزج')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('مزج إلى')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('عودة للمشهد')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('تلاشي إلى أسود')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('تلاشي إلى')).toBe(true);
    });

    it('matches with dashes (production script style)', () => {
      expect(rules.TRANSITION_ARABIC.test('- قطع -')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('- اختفاء تدريجي -')).toBe(true);
    });

    it('matches with backward-compat colon', () => {
      expect(rules.TRANSITION_ARABIC.test('قطع إلى:')).toBe(true);
      expect(rules.TRANSITION_ARABIC.test('مزج إلى:')).toBe(true);
    });

    it('does not match random Arabic text', () => {
      expect(rules.TRANSITION_ARABIC.test('سمير يمشي')).toBe(false);
    });
  });

  describe('TRANSITION_ENGLISH', () => {
    it('matches UPPERCASE transitions ending in TO:', () => {
      expect(rules.TRANSITION_ENGLISH.test('CUT TO:')).toBe(true);
      expect(rules.TRANSITION_ENGLISH.test('DISSOLVE TO:')).toBe(true);
      expect(rules.TRANSITION_ENGLISH.test('SMASH CUT TO:')).toBe(true);
    });

    it('does not match lowercase', () => {
      expect(rules.TRANSITION_ENGLISH.test('cut to:')).toBe(false);
    });
  });

  describe('TRANSITION_FORCED', () => {
    it('matches > prefix', () => {
      expect(rules.TRANSITION_FORCED.test('>قطع إلى:')).toBe(true);
      expect(rules.TRANSITION_FORCED.test('> FADE TO BLACK')).toBe(true);
    });

    it('does not match centered text (>...<)', () => {
      expect(rules.TRANSITION_FORCED.test('>النهاية<')).toBe(false);
    });
  });

  describe('PARENTHETICAL', () => {
    it('matches Arabic parentheticals', () => {
      expect(rules.PARENTHETICAL.test('(بهدوء)')).toBe(true);
      expect(rules.PARENTHETICAL.test('(وهو بيمشي)')).toBe(true);
    });

    it('matches English parentheticals', () => {
      expect(rules.PARENTHETICAL.test('(quietly)')).toBe(true);
      expect(rules.PARENTHETICAL.test('(to himself)')).toBe(true);
    });

    it('does not match text without parentheses', () => {
      expect(rules.PARENTHETICAL.test('بهدوء')).toBe(false);
    });
  });

  describe('TITLE_KEY', () => {
    it('matches Arabic title keys', () => {
      const match = 'العنوان: آخر أيام الصيف'.match(rules.TITLE_KEY);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('العنوان');
      expect(match![2]).toBe('آخر أيام الصيف');
    });

    it('matches English title keys (case insensitive)', () => {
      const match = 'Title: Big Fish'.match(rules.TITLE_KEY);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('Title');
      expect(match![2]).toBe('Big Fish');
    });

    it('matches key with empty value', () => {
      const match = 'المؤلف:'.match(rules.TITLE_KEY);
      expect(match).not.toBeNull();
      expect(match![2]).toBe('');
    });
  });

  describe('CENTERED', () => {
    it('matches centered text', () => {
      const match = '>النهاية<'.match(rules.CENTERED);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('النهاية');
    });

    it('matches English centered text', () => {
      const match = '> THE END <'.match(rules.CENTERED);
      expect(match).not.toBeNull();
    });

    it('does not match transition (no closing <)', () => {
      expect(rules.CENTERED.test('>قطع إلى:')).toBe(false);
    });
  });

  describe('SECTION', () => {
    it('matches sections with depth', () => {
      const match1 = '# الفصل الأول'.match(rules.SECTION);
      expect(match1).not.toBeNull();
      expect(match1![1]).toBe('#');
      expect(match1![2]).toBe('الفصل الأول');

      const match2 = '## المشهد الأول'.match(rules.SECTION);
      expect(match2).not.toBeNull();
      expect(match2![1]).toBe('##');
    });
  });

  describe('SYNOPSIS', () => {
    it('matches synopsis lines', () => {
      const match = '= سمير يقابل حسن'.match(rules.SYNOPSIS);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('سمير يقابل حسن');
    });

    it('does not match page break', () => {
      expect(rules.SYNOPSIS.test('===')).toBe(false);
    });
  });

  describe('PAGE_BREAK', () => {
    it('matches three or more equals', () => {
      expect(rules.PAGE_BREAK.test('===')).toBe(true);
      expect(rules.PAGE_BREAK.test('=====')).toBe(true);
    });

    it('does not match fewer than three', () => {
      expect(rules.PAGE_BREAK.test('==')).toBe(false);
    });
  });

  describe('NOTE', () => {
    it('matches inline notes', () => {
      const matches = 'text [[note here]] more text'.match(rules.NOTE);
      expect(matches).toHaveLength(1);
    });

    it('matches Arabic notes', () => {
      const matches = '[[ملاحظة: لازم نعيد]]'.match(rules.NOTE);
      expect(matches).toHaveLength(1);
    });
  });

  describe('BONEYARD', () => {
    it('matches block comments', () => {
      const matches = '/* comment */'.match(rules.BONEYARD);
      expect(matches).toHaveLength(1);
    });

    it('matches Arabic comments', () => {
      const matches = '/* محذوف */'.match(rules.BONEYARD);
      expect(matches).toHaveLength(1);
    });
  });

  describe('LYRICS', () => {
    it('matches tilde-prefixed lines', () => {
      const match = '~يا ليل يا عين'.match(rules.LYRICS);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('يا ليل يا عين');
    });
  });

  describe('ACTION_FORCED', () => {
    it('matches ! prefixed lines', () => {
      const match = '!سمير يمشي'.match(rules.ACTION_FORCED);
      expect(match).not.toBeNull();
      expect(match![1]).toBe('سمير يمشي');
    });
  });

  describe('Emphasis patterns', () => {
    it('matches bold italic', () => {
      expect('***text***'.match(rules.BOLD_ITALIC)).not.toBeNull();
    });

    it('matches bold', () => {
      expect('**text**'.match(rules.BOLD)).not.toBeNull();
    });

    it('matches italic', () => {
      expect('*text*'.match(rules.ITALIC)).not.toBeNull();
    });

    it('matches underline', () => {
      expect('_text_'.match(rules.UNDERLINE)).not.toBeNull();
    });

    it('matches Arabic emphasis', () => {
      expect('**نص عريض**'.match(rules.BOLD)).not.toBeNull();
      expect('*نص مائل*'.match(rules.ITALIC)).not.toBeNull();
    });
  });

  describe('Normalization patterns', () => {
    it('DIACRITICS matches tashkeel', () => {
      expect('سَمِير'.replace(rules.DIACRITICS, '')).toBe('سمير');
    });

    it('ALEF_VARIANTS normalizes alef forms', () => {
      expect('أحمد'.replace(rules.ALEF_VARIANTS, 'ا')).toBe('احمد');
      expect('إسلام'.replace(rules.ALEF_VARIANTS, 'ا')).toBe('اسلام');
      expect('آمال'.replace(rules.ALEF_VARIANTS, 'ا')).toBe('امال');
    });
  });
});
