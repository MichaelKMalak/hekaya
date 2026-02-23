<div dir="rtl">

**[Read in English](README.md)**

# حكاية (Hekaya)

[![CI](https://github.com/michaelkmalak/hekaya/actions/workflows/ci.yml/badge.svg)](https://github.com/michaelkmalak/hekaya/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/michaelkmalak/hekaya)](https://github.com/michaelkmalak/hekaya/releases)
[![codecov](https://codecov.io/github/MichaelKMalak/hekaya/graph/badge.svg?token=N3MGEDYDKY)](https://codecov.io/github/MichaelKMalak/hekaya)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

لغة ترميز وأدوات لكتابة السيناريو مصممة للكتّاب المصريين والناطقين بالعربية.

حكاية بتوسّع مواصفات [Fountain](https://fountain.io/) بدعم كامل للكتابة من اليمين لليسار (RTL)، وبتخلي كتّاب السيناريو في مصر والعالم العربي يقدروا يكتبوا سيناريوهات بصيغة نص عادي وتطلع بشكل احترافي.

حكاية اتعملت لـ[نادي القاهرة لصنّاع الأفلام المستقلين](https://cairoindie.com/) لتوحيد كتابة السيناريو بالعربي وتسهيل كتابة وتصدير السيناريوهات بصيغة PDF.

## إيه هي حكاية؟

حكاية للكتّاب المصريين والناطقين بالعربية زي ما Fountain للكتّاب الإنجليز: لغة ترميز بسيطة بتخليك تكتب سيناريو في أي محرر نصوص. الصيغة طبيعية للكتابة بالعامية المصرية والعربية الفصحى، ومتوافقة تمامًا مع ملفات Fountain العادية.

<pre dir="rtl">
العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

سمير قاعد لوحده في ركن القهوة، بيبص على فنجان القهوة اللي قدامه.

@سمير
(بهدوء)
قهوة سادة، لو سمحت.

@نادية
مكنتش عارفة إنك هنا.

@سمير
ولا أنا كنت ناوي أجي.

- قطع -
</pre>

## الحزم

| الحزمة             | الوصف                                    |
| ------------------ | ---------------------------------------- |
| `@hekaya/parser`   | محلل الترميز الأساسي (بدون أي اعتماديات) |
| `@hekaya/renderer` | مُصيّر HTML بدعم كامل لـ RTL             |
| `@hekaya/pdf`      | مُولّد PDF بخطوط عربية                   |
| `@hekaya/cli`      | أداة سطر الأوامر                         |

## بداية سريعة

```bash
# تحليل ملف حكاية
hekaya parse script.hekaya --format json

# تصيير لـ HTML
hekaya render script.hekaya -o script.html

# تصدير لـ PDF
hekaya export script.hekaya -o script.pdf

# التحقق من الصحة
hekaya validate script.hekaya
```

## نماذج

النماذج الكاملة متاحة على [موقع التوثيق](https://michaelkmalak.github.io/hekaya/docs/examples/full-drama) لقراءة أفضل بالعربي:

| النموذج                                                                              | الوصف                                               |
| ------------------------------------------------------------------------------------ | --------------------------------------------------- |
| [آخر أيام الصيف](https://michaelkmalak.github.io/hekaya/docs/examples/full-drama)    | دراما — كاتب بيكتشف الأمل من جديد في القاهرة        |
| [بكرا السما ح تقع](https://michaelkmalak.github.io/hekaya/docs/examples/full-comedy) | كوميديا — حكاية ساخرة عن انتشار الشائعات في القاهرة |

## التوثيق

- [مواصفات ترميز حكاية](https://michaelkmalak.github.io/hekaya/docs/spec/hekaya-markup-spec)
- [التوافق مع Fountain](https://michaelkmalak.github.io/hekaya/docs/spec/fountain-compatibility)
- [البنية المعمارية](https://michaelkmalak.github.io/hekaya/docs/architecture)
- [البحث والمراجع](https://michaelkmalak.github.io/hekaya/docs/research/references)

## خارطة الطريق

### تسجيل امتداد `.hekaya`

لتأسيس `.hekaya` كامتداد ملفات معترف به:

- [ ] **إضافة VS Code** — إنشاء إضافة لتوفير تلوين الكود والإكمال التلقائي لملفات `.hekaya`
- [ ] **حزم npm** — نشر `@hekaya/parser` و`@hekaya/renderer` و`@hekaya/pdf` و`@hekaya/cli` على npm
- [ ] **GitHub Linguist** — إضافة `.hekaya` كلغة معترف بها على GitHub
- [ ] **نوع IANA** — تسجيل `text/x-hekaya` كنوع وسائط
- [ ] **الدومين والموقع** — إطلاق hekaya.com بالتوثيق والأمثلة

### المرحلة الثانية: تطبيق سطح المكتب

- [ ] نقل المحلل لـ Dart
- [ ] تطبيق Flutter لسطح المكتب (macOS + Windows) بمحرر WYSIWYG
- [ ] إكمال تلقائي لأسماء الشخصيات وعناوين المشاهد والانتقالات
- [ ] معاينة مباشرة

## التطوير

```bash
# تثبيت الاعتماديات
pnpm install

# بناء كل الحزم
pnpm build

# تشغيل الاختبارات
pnpm test

# وضع المراقبة
pnpm test:watch
```

## الرخصة

MIT

</div>
