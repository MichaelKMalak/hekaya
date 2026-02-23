import { describe, it, expect } from 'vitest';
import { render } from '../src/renderer';
import { Hekaya } from '@hekaya/parser';

describe('renderer', () => {
  describe('full document', () => {
    it('renders a complete HTML document', () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

@سمير
(بهدوء)
قهوة سادة.`);

      const html = render(script);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('dir="rtl"');
      expect(html).toContain('lang="ar"');
      expect(html).toContain('<title>آخر أيام الصيف</title>');
    });

    it('renders LTR document for English scripts', () => {
      const script = Hekaya.parse(`Title: Big Fish
Author: John August

INT. COFFEE SHOP - DAY

JOHN
Hello there.`);

      const html = render(script);
      expect(html).toContain('dir="ltr"');
      expect(html).toContain('lang="en"');
    });

    it('renders fragment without document wrapper', () => {
      const script = Hekaya.parse(`داخلي - قهوة - نهار`);
      const html = render(script, { fullDocument: false });
      expect(html).not.toContain('<!DOCTYPE html>');
      expect(html).toContain('class="screenplay"');
    });
  });

  describe('title page', () => {
    it('renders title page with Arabic keys', () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد
مسودة: المسودة الأولى

داخلي - قهوة - نهار`);

      const html = render(script);
      expect(html).toContain('class="title-page"');
      expect(html).toContain('class="title"');
      expect(html).toContain('آخر أيام الصيف');
      expect(html).toContain('class="author"');
      expect(html).toContain('سمير عبدالحميد');
      expect(html).toContain('class="meta"');
    });

    it('excludes title page when option is false', () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف

داخلي - قهوة - نهار`);

      const html = render(script, { includeTitlePage: false });
      expect(html).not.toContain('class="title-page"');
    });
  });

  describe('scene headings', () => {
    it('renders Arabic scene heading', () => {
      const script = Hekaya.parse(`\nداخلي - قهوة بلدي - نهار`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="scene-heading"');
      expect(html).toContain('داخلي - قهوة بلدي - نهار');
    });

    it('renders scene number', () => {
      const script = Hekaya.parse(`\nداخلي - قهوة بلدي - نهار #١#`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="scene-number"');
      expect(html).toContain('١');
    });
  });

  describe('characters and dialogue', () => {
    it('renders character name with bold', () => {
      const script = Hekaya.parse(`\n@سمير\nقهوة سادة.`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="character"');
      expect(html).toContain('سمير');
    });

    it('renders character extension', () => {
      const script = Hekaya.parse(`\n@نادية (صوت خارجي)\nألو؟`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="extension"');
      expect(html).toContain('صوت خارجي');
    });

    it('renders dialogue', () => {
      const script = Hekaya.parse(`\n@سمير\nقهوة سادة، لو سمحت.`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="dialogue"');
      expect(html).toContain('قهوة سادة، لو سمحت.');
    });

    it('renders parenthetical', () => {
      const script = Hekaya.parse(`\n@سمير\n(بهدوء)\nقهوة سادة.`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="parenthetical"');
      expect(html).toContain('(بهدوء)');
    });
  });

  describe('action', () => {
    it('renders action text', () => {
      const script = Hekaya.parse(`\nسمير قاعد في القهوة.`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="action"');
      expect(html).toContain('سمير قاعد في القهوة.');
    });
  });

  describe('transitions', () => {
    it('renders Arabic transition', () => {
      const script = Hekaya.parse(`\n- قطع -`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="transition"');
      expect(html).toContain('قطع');
    });
  });

  describe('centered text', () => {
    it('renders centered text', () => {
      const script = Hekaya.parse(`\n>النهاية<`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="centered"');
      expect(html).toContain('النهاية');
    });
  });

  describe('page break', () => {
    it('renders page break', () => {
      const script = Hekaya.parse(`\n===`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="page-break"');
    });
  });

  describe('lyrics', () => {
    it('renders lyrics', () => {
      const script = Hekaya.parse(`\n~يا ليل يا عين`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('class="lyrics"');
      expect(html).toContain('يا ليل يا عين');
    });
  });

  describe('inline formatting', () => {
    it('renders bold text', () => {
      const script = Hekaya.parse(`\nسمير بيقول **كلام مهم**.`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('<b>كلام مهم</b>');
    });

    it('renders italic text', () => {
      const script = Hekaya.parse(`\nسمير بيقول *كلام هادي*.`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('<i>كلام هادي</i>');
    });

    it('renders underline text', () => {
      const script = Hekaya.parse(`\nسمير بيقول _كلام مهم_.`);
      const html = render(script, { fullDocument: false });
      expect(html).toContain('<u>كلام مهم</u>');
    });
  });

  describe('HTML escaping', () => {
    it('escapes HTML entities in text', () => {
      const script = Hekaya.parse(`\nسمير بيقول <script>alert("hack")</script>.`);
      const html = render(script, { fullDocument: false });
      expect(html).not.toContain('<script>');
      expect(html).toContain('&lt;script&gt;');
    });
  });

  describe('custom options', () => {
    it('accepts custom CSS', () => {
      const script = Hekaya.parse(`\nداخلي - قهوة - نهار`);
      const html = render(script, { customCss: '.custom { color: red; }' });
      expect(html).toContain('.custom { color: red; }');
    });

    it('accepts custom page title', () => {
      const script = Hekaya.parse(`\nداخلي - قهوة - نهار`);
      const html = render(script, { pageTitle: 'My Script' });
      expect(html).toContain('<title>My Script</title>');
    });

    it('includes meta elements when requested', () => {
      const script = Hekaya.parse(`\n# الفصل الأول\n= سمير بيقابل حسن`);
      const html = render(script, { fullDocument: false, includeMetaElements: true });
      expect(html).toContain('class="section');
      expect(html).toContain('class="synopsis"');
    });

    it('excludes meta elements by default', () => {
      const script = Hekaya.parse(`\n# الفصل الأول\n= سمير بيقابل حسن`);
      const html = render(script, { fullDocument: false });
      expect(html).not.toContain('class="section');
      expect(html).not.toContain('class="synopsis"');
    });
  });

  describe('edge cases', () => {
    it('renders empty token array', () => {
      const script = Hekaya.parse('');
      const html = render(script, { fullDocument: false });
      // Should produce valid output, just with no body content
      expect(typeof html).toBe('string');
    });

    it('renders script with no title entries', () => {
      const script = Hekaya.parse('\nداخلي - غرفة - نهار\n\nسمير قاعد.');
      const html = render(script, { includeTitlePage: true });
      // Should not crash, just skip title page
      expect(html).toContain('class="scene-heading"');
    });

    it('renders script with only blank tokens', () => {
      const script = Hekaya.parse('\n\n\n');
      const html = render(script, { fullDocument: false });
      expect(typeof html).toBe('string');
    });
  });

  describe('integration', () => {
    it('renders a complete Arabic screenplay', () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

سمير قاعد لوحده في ركن القهوة.

@سمير
(بهدوء)
قهوة سادة، لو سمحت.

@نادية
مكنتش عارفة إنك هنا.

- قطع -

خارجي - شارع وسط البلد - ليل

سمير وحسن ماشيين في الشارع.

- اختفاء تدريجي -

>النهاية<`);

      const html = render(script);

      // Document structure
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('dir="rtl"');

      // Title page
      expect(html).toContain('آخر أيام الصيف');

      // All element types present
      expect(html).toContain('class="scene-heading"');
      expect(html).toContain('class="action"');
      expect(html).toContain('class="character"');
      expect(html).toContain('class="parenthetical"');
      expect(html).toContain('class="dialogue"');
      expect(html).toContain('class="transition"');
      expect(html).toContain('class="centered"');
    });
  });
});
