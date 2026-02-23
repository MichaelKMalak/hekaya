/**
 * End-to-end integration tests.
 *
 * These tests exercise the full pipeline: parser → renderer/PDF
 * using the actual packages (no mocking).
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { Hekaya } from '@hekaya/parser';
import { render } from '@hekaya/renderer';
import { generatePdf } from '@hekaya/pdf';

const SAMPLE_PATH = resolve(__dirname, '../../../samples/آخر-أيام-الصيف.hekaya');
const FOUNTAIN_PATH = resolve(
  __dirname,
  '../../../packages/hekaya-parser/tests/fixtures/english-standard.fountain',
);

describe('E2E: Arabic .hekaya → HTML', () => {
  it('produces valid HTML structure', () => {
    const input = readFileSync(SAMPLE_PATH, 'utf-8');
    const script = Hekaya.parse(input);
    const html = render(script);

    // Valid HTML document
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');
    expect(html).toContain('</html>');

    // RTL direction
    expect(html).toContain('dir="rtl"');

    // Title page content
    expect(html).toContain('آخر أيام الصيف');
    expect(html).toContain('سمير عبدالحميد');

    // Screenplay elements present
    expect(html).toContain('class="scene-heading"');
    expect(html).toContain('class="character"');
    expect(html).toContain('class="dialogue"');
    expect(html).toContain('class="parenthetical"');
    expect(html).toContain('class="action"');
    expect(html).toContain('class="transition"');
  });
});

describe('E2E: Arabic .hekaya → PDF', () => {
  it('produces valid PDF with correct header and reasonable size', async () => {
    const input = readFileSync(SAMPLE_PATH, 'utf-8');
    const script = Hekaya.parse(input);
    const pdf = await generatePdf(script);

    // Valid PDF header
    expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');

    // Reasonable file size (between 10KB and 500KB for a short screenplay)
    expect(pdf.length).toBeGreaterThan(10 * 1024);
    expect(pdf.length).toBeLessThan(500 * 1024);
  });
});

describe('E2E: English .fountain → HTML', () => {
  it('produces valid HTML structure', () => {
    const input = readFileSync(FOUNTAIN_PATH, 'utf-8');
    const script = Hekaya.parse(input);
    const html = render(script);

    // Valid HTML document
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('<html');

    // LTR direction for English
    expect(html).toContain('dir="ltr"');

    // Title page content
    expect(html).toContain('Big Fish');
    expect(html).toContain('John August');

    // Screenplay elements
    expect(html).toContain('class="scene-heading"');
    expect(html).toContain('class="character"');
    expect(html).toContain('class="dialogue"');
  });
});
