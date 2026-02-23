import { describe, it, expect } from 'vitest';
import {
  PAGE_SIZE,
  getPageMargins,
  getElementLayouts,
  FONT_CONFIG,
  TITLE_PAGE,
} from '../src/page-layout';

describe('PAGE_SIZE', () => {
  it('is US Letter size in points (8.5" x 11")', () => {
    expect(PAGE_SIZE.width).toBe(612); // 8.5 * 72
    expect(PAGE_SIZE.height).toBe(792); // 11 * 72
  });
});

describe('getPageMargins', () => {
  it('places binding margin on right for RTL', () => {
    const [left, top, right, bottom] = getPageMargins('rtl');
    // Binding (larger margin) should be on right for RTL
    expect(right).toBeGreaterThan(left);
    expect(top).toBeGreaterThan(0);
    expect(bottom).toBeGreaterThan(0);
  });

  it('places binding margin on left for LTR', () => {
    const [left, top, right, bottom] = getPageMargins('ltr');
    // Binding (larger margin) should be on left for LTR
    expect(left).toBeGreaterThan(right);
    expect(top).toBeGreaterThan(0);
    expect(bottom).toBeGreaterThan(0);
  });

  it('returns 4-element tuple', () => {
    expect(getPageMargins('rtl')).toHaveLength(4);
    expect(getPageMargins('ltr')).toHaveLength(4);
  });
});

describe('getElementLayouts', () => {
  it('returns all screenplay element types', () => {
    const layouts = getElementLayouts('rtl');
    const requiredTypes = [
      'scene_heading',
      'action',
      'character',
      'dialogue',
      'parenthetical',
      'transition',
      'centered',
    ];
    for (const type of requiredTypes) {
      expect(layouts).toHaveProperty(type);
    }
  });

  it('scene_heading is bold', () => {
    expect(getElementLayouts('rtl').scene_heading.bold).toBe(true);
    expect(getElementLayouts('ltr').scene_heading.bold).toBe(true);
  });

  it('character alignment differs for RTL vs LTR', () => {
    const rtlChar = getElementLayouts('rtl').character;
    const ltrChar = getElementLayouts('ltr').character;
    // RTL character is centered, LTR is left-aligned
    expect(rtlChar.alignment).not.toBe(ltrChar.alignment);
  });

  it('transition is centered', () => {
    expect(getElementLayouts('rtl').transition.alignment).toBe('center');
    expect(getElementLayouts('ltr').transition.alignment).toBe('center');
  });

  it('dialogue has indentation', () => {
    const rtlDialogue = getElementLayouts('rtl').dialogue;
    const ltrDialogue = getElementLayouts('ltr').dialogue;
    expect(rtlDialogue.marginLeft + rtlDialogue.marginRight).toBeGreaterThan(0);
    expect(ltrDialogue.marginLeft + ltrDialogue.marginRight).toBeGreaterThan(0);
  });
});

describe('FONT_CONFIG', () => {
  it('RTL has larger fontSize than LTR', () => {
    expect(FONT_CONFIG.rtl.fontSize).toBeGreaterThan(FONT_CONFIG.ltr.fontSize);
  });

  it('RTL has greater lineHeight than LTR', () => {
    expect(FONT_CONFIG.rtl.lineHeight).toBeGreaterThan(FONT_CONFIG.ltr.lineHeight);
  });
});

describe('TITLE_PAGE', () => {
  it('title is largest, author smaller, meta smallest', () => {
    expect(TITLE_PAGE.titleSize).toBeGreaterThan(TITLE_PAGE.authorSize);
    expect(TITLE_PAGE.authorSize).toBeGreaterThan(TITLE_PAGE.metaSize);
  });
});
