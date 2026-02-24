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
  DIRECTION_VALUES_AR,
} from '../src/keywords';

describe('SCENE_HEADING_KEYWORDS_AR', () => {
  it('contains all required Arabic scene heading keywords', () => {
    expect(Object.keys(SCENE_HEADING_KEYWORDS_AR).length).toBeGreaterThanOrEqual(5);
    expect(SCENE_HEADING_KEYWORDS_AR).toHaveProperty('داخلي');
    expect(SCENE_HEADING_KEYWORDS_AR).toHaveProperty('خارجي');
    expect(SCENE_HEADING_KEYWORDS_AR['داخلي']).toBe('INT');
    expect(SCENE_HEADING_KEYWORDS_AR['خارجي']).toBe('EXT');
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
    // Should have العنوان (title), المؤلف (author), مسودة (draft date)
    const keys = Object.keys(TITLE_KEYS_AR);
    expect(keys.length).toBeGreaterThanOrEqual(8);
  });

  it('maps to normalized English keys', () => {
    // All values should be lowercase English keys
    for (const value of Object.values(TITLE_KEYS_AR)) {
      expect(value).toMatch(/^[a-z_\s]+$/);
    }
  });

  it('maps تأليف to credit', () => {
    expect(TITLE_KEYS_AR['تأليف']).toBe('credit');
  });

  it('maps both ائتمان and تأليف to credit', () => {
    expect(TITLE_KEYS_AR['ائتمان']).toBe('credit');
    expect(TITLE_KEYS_AR['تأليف']).toBe('credit');
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
});

describe('TRANSITION_KEYWORDS_AR', () => {
  it('is non-empty', () => {
    expect(TRANSITION_KEYWORDS_AR.length).toBeGreaterThan(0);
  });

  it('has no duplicates', () => {
    const unique = new Set(TRANSITION_KEYWORDS_AR);
    expect(unique.size).toBe(TRANSITION_KEYWORDS_AR.length);
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

  it('is non-empty', () => {
    expect(Object.keys(CHARACTER_EXTENSIONS_AR).length).toBeGreaterThan(0);
  });
});

describe('TIME_OF_DAY_AR', () => {
  it('contains common time-of-day terms', () => {
    expect(TIME_OF_DAY_AR.length).toBeGreaterThanOrEqual(4);
  });

  it('has no duplicates', () => {
    const unique = new Set(TIME_OF_DAY_AR);
    expect(unique.size).toBe(TIME_OF_DAY_AR.length);
  });
});

describe('DIRECTION_VALUES_AR', () => {
  it('maps RTL and LTR direction values', () => {
    const values = Object.values(DIRECTION_VALUES_AR);
    expect(values).toContain('rtl');
    expect(values).toContain('ltr');
  });
});
