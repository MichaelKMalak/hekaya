import { describe, it, expect } from 'vitest';
import { processInlineFormatting, stripInlineFormatting } from '../src/inline-lexer';

describe('inline-lexer', () => {
  describe('processInlineFormatting', () => {
    it('converts bold italic', () => {
      expect(processInlineFormatting('***text***')).toBe('<b><i>text</i></b>');
    });

    it('converts bold', () => {
      expect(processInlineFormatting('**text**')).toBe('<b>text</b>');
    });

    it('converts italic', () => {
      expect(processInlineFormatting('*text*')).toBe('<i>text</i>');
    });

    it('converts underline', () => {
      expect(processInlineFormatting('_text_')).toBe('<u>text</u>');
    });

    it('handles Arabic bold text', () => {
      expect(processInlineFormatting('**نص عريض**')).toBe('<b>نص عريض</b>');
    });

    it('handles Arabic italic text', () => {
      expect(processInlineFormatting('*نص مائل*')).toBe('<i>نص مائل</i>');
    });

    it('handles multiple emphasis in same line', () => {
      const result = processInlineFormatting('**bold** and *italic*');
      expect(result).toBe('<b>bold</b> and <i>italic</i>');
    });

    it('handles mixed Arabic and English emphasis', () => {
      const result = processInlineFormatting('**نص** and *text*');
      expect(result).toBe('<b>نص</b> and <i>text</i>');
    });

    it('leaves plain text unchanged', () => {
      expect(processInlineFormatting('plain text')).toBe('plain text');
      expect(processInlineFormatting('نص عادي')).toBe('نص عادي');
    });
  });

  describe('stripInlineFormatting', () => {
    it('strips bold italic markers', () => {
      expect(stripInlineFormatting('***text***')).toBe('text');
    });

    it('strips bold markers', () => {
      expect(stripInlineFormatting('**text**')).toBe('text');
    });

    it('strips italic markers', () => {
      expect(stripInlineFormatting('*text*')).toBe('text');
    });

    it('strips underline markers', () => {
      expect(stripInlineFormatting('_text_')).toBe('text');
    });

    it('strips Arabic emphasis', () => {
      expect(stripInlineFormatting('**نص عريض**')).toBe('نص عريض');
    });

    it('leaves plain text unchanged', () => {
      expect(stripInlineFormatting('plain')).toBe('plain');
    });
  });
});
