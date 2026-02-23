import { describe, it, expect } from 'vitest';
import { detectDirection, containsArabic, applyDirectionMarker, RLM, LRM } from '../src/bidi';

describe('bidi', () => {
  describe('detectDirection', () => {
    it('returns rtl for Arabic text', () => {
      expect(detectDirection('سمير يمشي في الشارع')).toBe('rtl');
    });

    it('returns ltr for English text', () => {
      expect(detectDirection('John walks down the street')).toBe('ltr');
    });

    it('returns rtl for predominantly Arabic mixed text', () => {
      expect(detectDirection('سمير يقابل John في القهوة')).toBe('rtl');
    });

    it('returns ltr for predominantly English mixed text', () => {
      expect(detectDirection('John meets سمير at the coffee shop')).toBe('ltr');
    });

    it('returns auto for numbers only', () => {
      expect(detectDirection('12345')).toBe('auto');
    });

    it('returns auto for punctuation only', () => {
      expect(detectDirection('...')).toBe('auto');
    });

    it('returns auto for empty string', () => {
      expect(detectDirection('')).toBe('auto');
    });

    it('handles Arabic with diacritics', () => {
      expect(detectDirection('سَمِير')).toBe('rtl');
    });
  });

  describe('containsArabic', () => {
    it('returns true for Arabic text', () => {
      expect(containsArabic('سمير')).toBe(true);
    });

    it('returns false for English text', () => {
      expect(containsArabic('John')).toBe(false);
    });

    it('returns true for mixed text with Arabic', () => {
      expect(containsArabic('Hello سمير')).toBe(true);
    });

    it('returns false for empty string', () => {
      expect(containsArabic('')).toBe(false);
    });

    it('returns false for numbers', () => {
      expect(containsArabic('12345')).toBe(false);
    });
  });

  describe('applyDirectionMarker', () => {
    it('prepends RLM for rtl', () => {
      expect(applyDirectionMarker('text', 'rtl')).toBe(RLM + 'text');
    });

    it('prepends LRM for ltr', () => {
      expect(applyDirectionMarker('text', 'ltr')).toBe(LRM + 'text');
    });

    it('returns unchanged for auto', () => {
      expect(applyDirectionMarker('text', 'auto')).toBe('text');
    });
  });
});
