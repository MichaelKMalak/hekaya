import { describe, it, expect } from 'vitest';
import { Hekaya, serialize } from '../src/index';

describe('serializer', () => {
  describe('title page', () => {
    it('serializes simple title entries', () => {
      const script = Hekaya.parse(`العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد
`);
      const output = serialize(script);
      expect(output).toContain('العنوان: آخر أيام الصيف');
      expect(output).toContain('المؤلف: سمير عبدالحميد');
    });

    it('serializes multi-line title values', () => {
      const script = Hekaya.parse(`العنوان: اختبار
تواصل:
   شركة إنتاج النيل
   القاهرة، مصر
`);
      const output = serialize(script);
      expect(output).toContain('تواصل:');
      expect(output).toContain('   شركة إنتاج النيل');
      expect(output).toContain('   القاهرة، مصر');
    });

    it('preserves original Arabic key names', () => {
      const script = Hekaya.parse(`العنوان: اختبار\nتأليف: قصة أصلية\n`);
      const output = serialize(script);
      expect(output).toContain('تأليف: قصة أصلية');
    });
  });

  describe('scene headings', () => {
    it('serializes standard scene headings', () => {
      const script = Hekaya.parse(`\nداخلي - قهوة بلدي - نهار`);
      const output = serialize(script);
      expect(output).toContain('داخلي - قهوة بلدي - نهار');
    });

    it('serializes scene numbers', () => {
      const script = Hekaya.parse(`\nخارجي - شارع المعز - ليل #١#`);
      const output = serialize(script);
      expect(output).toContain('#١#');
    });

    it('serializes forced scene headings', () => {
      const script = Hekaya.parse(`\n.اختبار الصوت`);
      const output = serialize(script);
      expect(output).toContain('.اختبار الصوت');
    });
  });

  describe('characters and dialogue', () => {
    it('serializes character with dialogue', () => {
      const script = Hekaya.parse(`\n@سمير\nأنا هنا.`);
      const output = serialize(script);
      expect(output).toContain('@سمير');
      expect(output).toContain('أنا هنا.');
    });

    it('serializes character extensions', () => {
      const script = Hekaya.parse(`\n@نادية (صوت خارجي)\nألو؟`);
      const output = serialize(script);
      expect(output).toContain('نادية');
      expect(output).toContain('صوت خارجي');
    });

    it('serializes parentheticals', () => {
      const script = Hekaya.parse(`\n@سمير\n(بهدوء)\nقهوة سادة.`);
      const output = serialize(script);
      expect(output).toContain('(بهدوء)');
    });

    it('serializes dual dialogue', () => {
      const script = Hekaya.parse(`\n@سمير\nأنا هنا.\n\n@نادية ^\nأنا كمان.`);
      const output = serialize(script);
      expect(output).toContain('^');
    });
  });

  describe('other elements', () => {
    it('serializes transitions', () => {
      const script = Hekaya.parse(`\nداخلي - شقة - ليل\n\n- قطع -`);
      const output = serialize(script);
      expect(output).toContain('- قطع -');
    });

    it('serializes centered text', () => {
      const script = Hekaya.parse(`\n>النهاية<`);
      const output = serialize(script);
      expect(output).toContain('>النهاية<');
    });

    it('serializes page breaks', () => {
      const script = Hekaya.parse(`\nداخلي - شقة - ليل\n\n===\n\nخارجي - شارع - نهار`);
      const output = serialize(script);
      expect(output).toContain('===');
    });

    it('serializes sections', () => {
      const script = Hekaya.parse(`\n# الفصل الأول\n\n## تسلسل أ`);
      const output = serialize(script);
      expect(output).toContain('# الفصل الأول');
      expect(output).toContain('## تسلسل أ');
    });

    it('serializes synopses', () => {
      const script = Hekaya.parse(`\n= سمير يكتشف الحقيقة`);
      const output = serialize(script);
      expect(output).toContain('= سمير يكتشف الحقيقة');
    });

    it('serializes lyrics', () => {
      const script = Hekaya.parse(`\n~يا ليل يا عين`);
      const output = serialize(script);
      expect(output).toContain('~يا ليل يا عين');
    });

    it('serializes forced action', () => {
      const script = Hekaya.parse(`\n!سمير مسك إيد حسن.`);
      const output = serialize(script);
      expect(output).toContain('!سمير مسك إيد حسن.');
    });
  });

  describe('round-trip', () => {
    it('round-trips a complete screenplay', () => {
      const input = `العنوان: اختبار
المؤلف: سمير


داخلي - قهوة بلدي - نهار

سمير قاعد في القهوة.

@سمير
(بهدوء)
قهوة سادة.

- قطع -

خارجي - شارع - ليل

>النهاية<`;

      const script1 = Hekaya.parse(input);
      const output = serialize(script1);
      const script2 = Hekaya.parse(output);

      // Token types should match (excluding blanks)
      const types1 = script1.tokens.filter((t) => t.type !== 'blank').map((t) => t.type);
      const types2 = script2.tokens.filter((t) => t.type !== 'blank').map((t) => t.type);
      expect(types2).toEqual(types1);
    });

    it('round-trips title page entries', () => {
      const input = `العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد
مسودة: المسودة الأولى

داخلي - قهوة - نهار`;

      const script1 = Hekaya.parse(input);
      const output = serialize(script1);
      const script2 = Hekaya.parse(output);

      expect(script2.titleEntries.length).toBe(script1.titleEntries.length);
      for (let i = 0; i < script1.titleEntries.length; i++) {
        expect(script2.titleEntries[i].key).toBe(script1.titleEntries[i].key);
        expect(script2.titleEntries[i].value).toBe(script1.titleEntries[i].value);
      }
    });
  });
});

describe('Hekaya.serialize', () => {
  it('static method calls serializer', () => {
    const script = Hekaya.parse(`\nداخلي - قهوة - نهار\n\n@سمير\nمرحبا.`);
    const output = Hekaya.serialize(script);
    expect(typeof output).toBe('string');
    expect(output).toContain('داخلي - قهوة - نهار');
    expect(output).toContain('سمير');
    expect(output).toContain('مرحبا.');
  });
});
