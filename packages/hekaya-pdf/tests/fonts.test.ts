import { describe, it, expect } from 'vitest';
import { getFontPaths, ARABIC_FONT, ENGLISH_FONT, FONTS_DIRECTORY } from '../src/fonts';
import { existsSync } from 'node:fs';
import { isAbsolute } from 'node:path';

describe('font constants', () => {
  it('ARABIC_FONT is a non-empty string', () => {
    expect(typeof ARABIC_FONT).toBe('string');
    expect(ARABIC_FONT.length).toBeGreaterThan(0);
  });

  it('ENGLISH_FONT is a non-empty string', () => {
    expect(typeof ENGLISH_FONT).toBe('string');
    expect(ENGLISH_FONT.length).toBeGreaterThan(0);
  });

  it('FONTS_DIRECTORY is an absolute path', () => {
    expect(isAbsolute(FONTS_DIRECTORY)).toBe(true);
  });
});

describe('getFontPaths', () => {
  it('returns font descriptors for both Arabic and English fonts', () => {
    const paths = getFontPaths();
    expect(paths).toHaveProperty(ARABIC_FONT);
    expect(paths).toHaveProperty(ENGLISH_FONT);
  });

  it('each font family has all 4 variants', () => {
    const paths = getFontPaths();
    for (const fontName of [ARABIC_FONT, ENGLISH_FONT]) {
      const family = paths[fontName];
      expect(family).toHaveProperty('normal');
      expect(family).toHaveProperty('bold');
      expect(family).toHaveProperty('italics');
      expect(family).toHaveProperty('bolditalics');
    }
  });

  it('all font paths point to existing files', () => {
    const paths = getFontPaths();
    for (const family of Object.values(paths)) {
      for (const filePath of Object.values(family)) {
        expect(existsSync(filePath), `Font file not found: ${filePath}`).toBe(true);
      }
    }
  });

  it('throws if fonts directory does not contain expected fonts', () => {
    expect(() => getFontPaths('/nonexistent/fonts/dir')).toThrow();
  });
});
