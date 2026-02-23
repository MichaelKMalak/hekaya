import { describe, it, expect, beforeEach } from 'vitest';
import { CharacterRegistry } from '../src/character-registry';

describe('CharacterRegistry', () => {
  let registry: CharacterRegistry;

  beforeEach(() => {
    registry = new CharacterRegistry();
  });

  describe('register', () => {
    it('registers a simple Arabic name', () => {
      registry.register('سمير');
      expect(registry.isKnown('سمير')).toBe(true);
    });

    it('registers an English name', () => {
      registry.register('JOHN');
      expect(registry.isKnown('JOHN')).toBe(true);
    });

    it('registers multiple names', () => {
      registry.register('سمير');
      registry.register('نادية');
      registry.register('حسن');
      expect(registry.size).toBe(3);
    });

    it('does not duplicate names', () => {
      registry.register('سمير');
      registry.register('سمير');
      expect(registry.size).toBe(1);
    });

    it('ignores empty strings', () => {
      registry.register('');
      registry.register('  ');
      expect(registry.size).toBe(0);
    });
  });

  describe('isKnown', () => {
    it('finds registered name', () => {
      registry.register('سمير');
      expect(registry.isKnown('سمير')).toBe(true);
    });

    it('returns false for unknown name', () => {
      expect(registry.isKnown('سمير')).toBe(false);
    });

    it('normalizes diacritics for comparison', () => {
      registry.register('سمير');
      expect(registry.isKnown('سَمِير')).toBe(true);
    });

    it('normalizes alef variants for comparison', () => {
      registry.register('أحمد');
      expect(registry.isKnown('احمد')).toBe(true);
      expect(registry.isKnown('إحمد')).toBe(true);
    });

    it('strips extensions for comparison', () => {
      registry.register('سمير');
      expect(registry.isKnown('سمير (صوت خارجي)')).toBe(true);
    });

    it('strips dual dialogue caret', () => {
      registry.register('سمير');
      expect(registry.isKnown('سمير ^')).toBe(true);
    });
  });

  describe('isCharacterLine', () => {
    it('detects registered character before dialogue', () => {
      registry.register('سمير');
      expect(registry.isCharacterLine('سمير', true)).toBe(true);
    });

    it('returns false if no next line (no dialogue)', () => {
      registry.register('سمير');
      expect(registry.isCharacterLine('سمير', false)).toBe(false);
    });

    it('returns false for unregistered name', () => {
      expect(registry.isCharacterLine('سمير', true)).toBe(false);
    });

    it('handles name with extension', () => {
      registry.register('نادية');
      expect(registry.isCharacterLine('نادية (صوت خارجي)', true)).toBe(true);
    });
  });

  describe('getAll', () => {
    it('returns all registered names', () => {
      registry.register('سمير');
      registry.register('نادية');
      const all = registry.getAll();
      expect(all).toContain('سمير');
      expect(all).toContain('نادية');
    });
  });

  describe('clear', () => {
    it('removes all names', () => {
      registry.register('سمير');
      registry.register('نادية');
      registry.clear();
      expect(registry.size).toBe(0);
      expect(registry.isKnown('سمير')).toBe(false);
    });
  });

  describe('normalize', () => {
    it('trims whitespace', () => {
      expect(registry.normalize('  سمير  ')).toBe('سمير');
    });

    it('removes extensions', () => {
      expect(registry.normalize('سمير (صوت خارجي)')).toBe('سمير');
    });

    it('removes dual dialogue caret', () => {
      expect(registry.normalize('سمير ^')).toBe('سمير');
    });

    it('strips diacritics', () => {
      expect(registry.normalize('سَمِير')).toBe('سمير');
    });

    it('normalizes alef', () => {
      expect(registry.normalize('أحمد')).toBe('احمد');
    });

    it('handles combined normalization', () => {
      expect(registry.normalize('  أَحمَد (صوت خارجي) ^  ')).toBe('احمد');
    });
  });
});
