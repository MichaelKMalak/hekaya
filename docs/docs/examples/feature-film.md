---
sidebar_position: 3
title: Feature Film Example
---

# Feature Film Example

A longer Hekaya screenplay excerpt demonstrating all element types, written in Egyptian Arabic.

## Source (`.hekaya`)

See the full sample file: [`samples/آخر-أيام-الصيف.hekaya`](https://github.com/michaelkmalak/hekaya/blob/main/samples/آخر-أيام-الصيف.hekaya)

This sample demonstrates:

### Title Page (Arabic keys)

```
العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد
مسودة: المسودة الأولى
تاريخ: ٢٠٢٦/٢/٢٣
تواصل: samir@example.com
```

### Scene Headings (Arabic keywords)

```
داخلي - قهوة بلدي - نهار
خارجي - شارع وسط البلد - نهار
داخلي - شقة سمير - ليل
```

### Character Registry in Action

```
@سمير            ← First use: registers "سمير"
قهوة سادة.

سمير              ← Auto-detected (registered)
مش عايز حاجة تاني.
```

### Multiple Characters

- `@سمير` — the protagonist
- `@حسن` — his friend
- `@نادية` — phone voice (صوت خارجي)

### Transitions (Arabic)

```
- قطع -
- اختفاء تدريجي -
مزج
```

### Parentheticals (Egyptian dialect)

```
(لنفسه)
(بفرحة)
(من غير ما يبص)
(مندهش)
(بهدوء)
(صوت خارجي - تليفون)
(وهو بيكتب)
(بيبتسم)
```

### Centered Text

```
>آخر أيام الصيف<
```

### All Element Types Present

- Title page with Arabic keys
- Scene headings with Arabic keywords
- Action/description in Egyptian Arabic
- Character names with `@` prefix
- Dialogue in Egyptian dialect
- Parentheticals
- Transitions (Arabic keywords)
- Centered text
- Page break (`===`)
