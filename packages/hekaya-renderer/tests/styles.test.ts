import { describe, it, expect } from 'vitest';
import { getStylesheet } from '../src/styles';

describe('getStylesheet', () => {
  it('returns RTL-specific CSS', () => {
    const css = getStylesheet('rtl');
    expect(css).toContain('direction: rtl');
    expect(css).toContain('text-align: right');
  });

  it('returns LTR-specific CSS', () => {
    const css = getStylesheet('ltr');
    expect(css).toContain('direction: ltr');
    expect(css).toContain('text-align: left');
  });

  it('includes all required CSS class selectors', () => {
    const css = getStylesheet('rtl');
    const requiredClasses = [
      '.scene-heading',
      '.action',
      '.character',
      '.dialogue',
      '.parenthetical',
      '.transition',
      '.centered',
    ];
    for (const cls of requiredClasses) {
      expect(css).toContain(cls);
    }
  });

  it('includes @page rule', () => {
    const cssRtl = getStylesheet('rtl');
    const cssLtr = getStylesheet('ltr');
    expect(cssRtl).toContain('@page');
    expect(cssLtr).toContain('@page');
  });

  it('uses Arabic fonts for RTL', () => {
    const css = getStylesheet('rtl');
    expect(css).toMatch(/Noto Naskh Arabic|Amiri|Cairo/);
  });

  it('uses monospace font for LTR', () => {
    const css = getStylesheet('ltr');
    expect(css).toContain('Courier');
  });
});
