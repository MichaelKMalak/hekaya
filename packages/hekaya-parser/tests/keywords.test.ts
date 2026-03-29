import { describe, it, expect } from 'vitest';
import {
  SCENE_HEADING_KEYWORDS_AR,
  SCENE_HEADING_KEYWORDS_EN,
  TITLE_KEYS_AR,
  TITLE_KEYS_EN,
  TRANSITION_KEYWORDS_AR,
  TRANSITION_MAP_AR_EN,
  CHARACTER_EXTENSIONS_AR,
  TIME_OF_DAY_AR,
} from '../src/keywords';

describe('SCENE_HEADING_KEYWORDS_AR', () => {
  it('contains all required Arabic scene heading keywords', () => {
    expect(Object.keys(SCENE_HEADING_KEYWORDS_AR).length).toBeGreaterThanOrEqual(5);
    expect(SCENE_HEADING_KEYWORDS_AR).toHaveProperty('داخلي');
    expect(SCENE_HEADING_KEYWORDS_AR).toHaveProperty('خارجي');
    expect(SCENE_HEADING_KEYWORDS_AR['داخلي']).toBe('INT');
    expect(SCENE_HEADING_KEYWORDS_AR['خارجي']).toBe('EXT');
  });

  it('maps لقطة تأسيسية to EST', () => {
    expect(SCENE_HEADING_KEYWORDS_AR['لقطة تأسيسية']).toBe('EST');
  });

  it('maps compound keywords correctly', () => {
    // داخلي/خارجي → INT/EXT or similar compound
    const compoundKeys = Object.keys(SCENE_HEADING_KEYWORDS_AR).filter((k) => k.includes('/'));
    expect(compoundKeys.length).toBeGreaterThanOrEqual(1);
  });
});

describe('SCENE_HEADING_KEYWORDS_EN', () => {
  it('contains standard Fountain scene heading keywords', () => {
    expect(SCENE_HEADING_KEYWORDS_EN).toContain('INT');
    expect(SCENE_HEADING_KEYWORDS_EN).toContain('EXT');
    expect(SCENE_HEADING_KEYWORDS_EN).toContain('EST');
  });

  it('has no duplicates', () => {
    const unique = new Set(SCENE_HEADING_KEYWORDS_EN);
    expect(unique.size).toBe(SCENE_HEADING_KEYWORDS_EN.length);
  });
});

describe('TITLE_KEYS_AR', () => {
  it('contains essential title page keys', () => {
    // Should have العنوان (title), سيناريو (author), مسودة (draft)
    const keys = Object.keys(TITLE_KEYS_AR);
    expect(keys.length).toBeGreaterThanOrEqual(10);
  });

  it('maps to normalized English keys', () => {
    // All values should be lowercase English keys
    for (const value of Object.values(TITLE_KEYS_AR)) {
      expect(value).toMatch(/^[a-z_\s]+$/);
    }
  });

  it('maps سيناريو, كتابة, and تأليف to author', () => {
    expect(TITLE_KEYS_AR['سيناريو']).toBe('author');
    expect(TITLE_KEYS_AR['كتابة']).toBe('author');
    expect(TITLE_KEYS_AR['تأليف']).toBe('author');
  });

  it('maps مسودة to draft (not draft date)', () => {
    expect(TITLE_KEYS_AR['مسودة']).toBe('draft');
  });

  it('maps تاريخ المسودة to draft date', () => {
    expect(TITLE_KEYS_AR['تاريخ المسودة']).toBe('draft date');
  });

  it('maps حقوق النشر to copyright', () => {
    expect(TITLE_KEYS_AR['حقوق النشر']).toBe('copyright');
  });

  it('maps بيانات الاتصال to contact', () => {
    expect(TITLE_KEYS_AR['بيانات الاتصال']).toBe('contact');
  });

  it('does not include المؤلف (replaced by سيناريو/كتابة/تأليف)', () => {
    expect(TITLE_KEYS_AR['المؤلف']).toBeUndefined();
  });

  it('does not include اتجاه (direction removed from Arabic keys)', () => {
    expect(TITLE_KEYS_AR['اتجاه']).toBeUndefined();
  });
});

describe('TITLE_KEYS_EN', () => {
  it('contains matching normalized values with Arabic keys', () => {
    const arValues = new Set(Object.values(TITLE_KEYS_AR));
    const enValues = new Set(Object.values(TITLE_KEYS_EN));
    // English keys should cover all the same normalized values
    for (const v of arValues) {
      expect(enValues).toContain(v);
    }
  });

  it('keeps direction for English Direction: rtl support', () => {
    expect(TITLE_KEYS_EN['direction']).toBe('direction');
  });
});

describe('TRANSITION_KEYWORDS_AR', () => {
  it('is non-empty', () => {
    expect(TRANSITION_KEYWORDS_AR.length).toBeGreaterThan(0);
  });

  it('has no duplicates', () => {
    const unique = new Set(TRANSITION_KEYWORDS_AR);
    expect(unique.size).toBe(TRANSITION_KEYWORDS_AR.length);
  });

  it('contains core transitions', () => {
    expect(TRANSITION_KEYWORDS_AR).toContain('قطع');
    expect(TRANSITION_KEYWORDS_AR).toContain('قطع مفاجئ');
    expect(TRANSITION_KEYWORDS_AR).toContain('تلاشي');
    expect(TRANSITION_KEYWORDS_AR).toContain('اختفاء تدريجي');
    expect(TRANSITION_KEYWORDS_AR).toContain('ظهور تدريجي');
  });

  it('contains expanded professional set', () => {
    expect(TRANSITION_KEYWORDS_AR).toContain('قطع قافز');
    expect(TRANSITION_KEYWORDS_AR).toContain('تداخل مع');
    expect(TRANSITION_KEYWORDS_AR).toContain('تجميد الكادر');
    expect(TRANSITION_KEYWORDS_AR).toContain('شاشة منقسمة');
    expect(TRANSITION_KEYWORDS_AR).toContain('تلاشي إلى أبيض');
    expect(TRANSITION_KEYWORDS_AR).toContain('مسح');
    expect(TRANSITION_KEYWORDS_AR).toContain('وميض');
    expect(TRANSITION_KEYWORDS_AR).toContain('انتقال');
  });
});

describe('TRANSITION_MAP_AR_EN', () => {
  it('covers all transition keywords', () => {
    for (const keyword of TRANSITION_KEYWORDS_AR) {
      expect(TRANSITION_MAP_AR_EN).toHaveProperty(keyword);
    }
  });

  it('maps to English transition terms', () => {
    for (const value of Object.values(TRANSITION_MAP_AR_EN)) {
      expect(typeof value).toBe('string');
      expect(value.length).toBeGreaterThan(0);
    }
  });
});

describe('CHARACTER_EXTENSIONS_AR', () => {
  it('contains voice-over and off-screen mappings', () => {
    const values = Object.values(CHARACTER_EXTENSIONS_AR);
    expect(values).toContain('V.O.');
    expect(values).toContain('O.S.');
  });

  it('maps صوت من خارج المشهد to V.O.', () => {
    expect(CHARACTER_EXTENSIONS_AR['صوت من خارج المشهد']).toBe('V.O.');
  });

  it('maps خارج الكادر to O.S.', () => {
    expect(CHARACTER_EXTENSIONS_AR['خارج الكادر']).toBe('O.S.');
  });

  it('keeps خارج الشاشة as O.S. alternative', () => {
    expect(CHARACTER_EXTENSIONS_AR['خارج الشاشة']).toBe('O.S.');
  });

  it('is non-empty', () => {
    expect(Object.keys(CHARACTER_EXTENSIONS_AR).length).toBeGreaterThan(0);
  });
});

describe('TIME_OF_DAY_AR', () => {
  it('contains common time-of-day terms', () => {
    expect(TIME_OF_DAY_AR.length).toBeGreaterThanOrEqual(8);
  });

  it('contains extended time-of-day terms', () => {
    expect(TIME_OF_DAY_AR).toContain('منتصف الليل');
    expect(TIME_OF_DAY_AR).toContain('قبل الفجر');
    expect(TIME_OF_DAY_AR).toContain('بعد الغروب');
  });

  it('has no duplicates', () => {
    const unique = new Set(TIME_OF_DAY_AR);
    expect(unique.size).toBe(TIME_OF_DAY_AR.length);
  });
});
