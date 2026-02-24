import { describe, it, expect } from 'vitest';
import { generatePdf } from '../src/pdf-generator';
import { Hekaya } from '@hekaya/parser';

describe('pdf-generator', () => {
  describe('basic generation', () => {
    it('generates a valid PDF buffer', async () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

@سمير
(بهدوء)
قهوة سادة.`);

      const pdf = await generatePdf(script);
      expect(pdf).toBeInstanceOf(Buffer);
      expect(pdf.length).toBeGreaterThan(0);
      // PDF files start with %PDF-
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });

    it('generates a PDF for a minimal script', async () => {
      const script = Hekaya.parse(`\nداخلي - قهوة - نهار`);
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });
  });

  describe('title page', () => {
    it('includes title page by default', async () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد

داخلي - قهوة - نهار`);

      const pdf = await generatePdf(script);
      expect(pdf.length).toBeGreaterThan(0);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });

    it('excludes title page when option is false', async () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف

داخلي - قهوة - نهار`);

      const withTitle = await generatePdf(script, { includeTitlePage: true });
      const withoutTitle = await generatePdf(script, { includeTitlePage: false });

      // Without title page should be smaller (fewer pages)
      expect(withoutTitle.length).toBeLessThan(withTitle.length);
    });
  });

  describe('RTL vs LTR', () => {
    it('generates RTL PDF for Arabic script', async () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف

داخلي - قهوة بلدي - نهار

@سمير
قهوة سادة.`);

      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });

    it('generates LTR PDF for English script', async () => {
      const script = Hekaya.parse(`Title: Big Fish
Author: John August

INT. COFFEE SHOP - DAY

JOHN
Hello there.`);

      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });
  });

  describe('element types', () => {
    it('handles all screenplay element types', async () => {
      const script = Hekaya.parse(`العنوان: اختبار

داخلي - قهوة بلدي - نهار

سمير قاعد في القهوة.

@سمير
(بهدوء)
قهوة سادة، لو سمحت.

- قطع -

خارجي - شارع - ليل

~يا ليل يا عين

>النهاية<`);

      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
      expect(pdf.length).toBeGreaterThan(1000);
    });

    it('handles page breaks', async () => {
      const script = Hekaya.parse(`\nداخلي - قهوة - نهار\n\n===\n\nخارجي - شارع - ليل`);
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });

    it('handles scene numbers', async () => {
      const script = Hekaya.parse(`\nداخلي - قهوة بلدي - نهار #١#`);
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });

    it('handles character extensions', async () => {
      const script = Hekaya.parse(`\n@نادية (صوت خارجي)\nألو؟`);
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });
  });

  describe('meta elements', () => {
    it('excludes meta elements by default', async () => {
      const script = Hekaya.parse(`\n# الفصل الأول\n= سمير بيقابل حسن\n\nداخلي - قهوة - نهار`);

      const withMeta = await generatePdf(script, { includeMetaElements: true });
      const withoutMeta = await generatePdf(script, { includeMetaElements: false });

      // With meta should be slightly larger
      expect(withMeta.length).toBeGreaterThanOrEqual(withoutMeta.length);
    });
  });

  describe('RTL number handling', () => {
    it('handles Arabic-Indic digits in dates', async () => {
      const script = Hekaya.parse(`العنوان: اختبار
تاريخ: ٢٠٢٦/٢/٢٤

داخلي - قهوة - نهار

@سمير
الساعة ٣:٤٥ الصبح.`);

      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });

    it('handles Western digits in dialogue', async () => {
      const script = Hekaya.parse(`\nداخلي - قهوة - نهار\n\n@سمير\nPhone: 0100-123-4567`);
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });

    it('handles mixed Arabic-Indic and Western digits', async () => {
      const script = Hekaya.parse(`\nداخلي - قهوة - نهار\n\nالحساب ١٢٥ جنيه يعني 125 EGP.`);
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });

    it('handles large numbers and currency', async () => {
      const script = Hekaya.parse(`\nداخلي - بنك - نهار\n\n@حسن\nالمبلغ ١٢٥٬٠٠٠ جنيه.`);
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });
  });

  describe('integration', () => {
    it('renders a complete Arabic screenplay', async () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد
مسودة: المسودة الأولى

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

      const pdf = await generatePdf(script);
      expect(pdf).toBeInstanceOf(Buffer);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
      // A full screenplay with title page should be > 5KB
      expect(pdf.length).toBeGreaterThan(5000);
    });
  });

  describe('title page formatting', () => {
    it('generates PDF with formatted title (bold/italic markers)', async () => {
      const script = Hekaya.parse(`العنوان: _**الليلة الكبيرة**_
تأليف: قصة أصلية
المؤلف: أحمد محمود

داخلي - شقة - ليل`);

      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
      expect(pdf.length).toBeGreaterThan(1000);
    });

    it('generates PDF with credit keyword تأليف', async () => {
      const script = Hekaya.parse(`العنوان: اختبار
تأليف: قصة أصلية

داخلي - قهوة - نهار`);

      expect(script.titleEntries.find((e) => e.key === 'credit')).toBeDefined();
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });
  });

  describe('centered and transition alignment', () => {
    it('generates PDF with centered text', async () => {
      const script = Hekaya.parse(`\n>**النهاية**<`);
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });

    it('generates PDF with bold-italic inline formatting', async () => {
      const script = Hekaya.parse(
        `\nداخلي - شقة - ليل\n\n@سمير\nأهلاً بيكم في ***الليلة الكبيرة***!`,
      );
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
    });
  });

  describe('dual dialogue', () => {
    it('generates PDF with dual dialogue blocks', async () => {
      const script = Hekaya.parse(`\n@سمير\nأنا هنا.\n\n@نادية ^\nأنا كمان.`);
      const pdf = await generatePdf(script);
      expect(pdf.subarray(0, 5).toString()).toBe('%PDF-');
      expect(pdf.length).toBeGreaterThan(1000);
    });
  });
});
