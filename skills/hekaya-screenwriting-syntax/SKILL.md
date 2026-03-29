---
name: hekaya-screenwriting-syntax
description: Hekaya screenplay markup syntax for Arabic/RTL screenwriting. Use when writing, formatting, or converting screenplays in Arabic using .hekaya files, or when the user asks about Hekaya syntax, character names, scene headings, transitions, or dialogue formatting.
---

# Hekaya Screenwriting Syntax

Hekaya is an Arabic-first screenplay markup language that extends [Fountain](https://fountain.io/syntax/) for RTL languages. It was built for Egyptian and Arabic-speaking screenwriters who need native Arabic support in a plain-text screenplay format.

## When to Use

- User is writing a screenplay in Arabic
- User asks about Hekaya markup syntax or formatting
- User needs to format scene headings, character names, transitions, or dialogue in Arabic
- User is converting between Hekaya and Fountain formats
- User asks about `.hekaya` file format

## When NOT to Use

- User is writing an English-only screenplay (use standard Fountain syntax instead)
- User is developing/debugging the Hekaya parser or toolchain code

## File Format

- Extension: `.hekaya` (primary) or `.fountain` (compatibility)
- Encoding: UTF-8
- Plain text — no special editor required

## Title Page

Key-value pairs at the top of the file, separated from the body by a blank line:

```
العنوان: آخر أيام الصيف
سيناريو: سمير عبدالحميد
مسودة: المسودة الأولى
تاريخ: ٢٠٢٦/٢/٢٣
تواصل: samir@example.com
```

### Arabic Title Page Keys

| Arabic Key    | English Equivalent | Purpose           |
| ------------- | ------------------ | ----------------- |
| العنوان       | Title              | Script title      |
| سيناريو       | Author             | Author name       |
| كتابة         | Author             | Author name       |
| تأليف         | Author             | Author name       |
| المصدر        | Source             | Source material   |
| مسودة         | Draft              | Draft information |
| تاريخ المسودة | Draft date         | Draft date        |
| تاريخ         | Date               | Date              |
| تواصل         | Contact            | Contact info      |
| حقوق النشر    | Copyright          | Copyright notice  |
| ملاحظات       | Notes              | Notes             |

Multi-line values indent with spaces or tabs:

```
سيناريو:
    سمير عبدالحميد
    ونادية حسن
```

## Scene Headings

Lines beginning with Arabic or English scene heading keywords. Use dash separators between scene type, location, and time of day.

```
داخلي - قهوة بلدي - نهار
خارجي - شارع وسط البلد - ليل
داخلي/خارجي - عربية متحركة - غروب
```

### Arabic Scene Heading Keywords

| Arabic       | English | Meaning           |
| ------------ | ------- | ----------------- |
| داخلي        | INT     | Interior          |
| خارجي        | EXT     | Exterior          |
| لقطة تأسيسية | EST     | Establishing      |
| داخلي/خارجي  | INT/EXT | Interior/Exterior |
| خارجي/داخلي  | EXT/INT | Exterior/Interior |
| د/خ          | I/E     | Abbreviation      |

### Time of Day Keywords

نهار (day), ليل (night), صباح (morning), مساء (evening), غروب (sunset), شروق (sunrise), فجر (dawn), ظهر (noon), عصر (afternoon), منتصف الليل (midnight), قبل الفجر (before dawn), بعد الغروب (after sunset)

### Forced Scene Heading

Prefix with `.` to force any line as a scene heading:

```
.المشهد الخاص
```

### Scene Numbers

Use `#` delimiters:

```
داخلي - قهوة بلدي - نهار #١#
```

## Character Names

### The `@` Prefix (Primary Method)

Arabic has no uppercase, so Hekaya uses `@` to mark character cues:

```
@سمير
قهوة سادة، لو سمحت.
```

The first `@` usage registers the name in the **Character Registry**.

### Auto-Detection After Registration

Once registered with `@`, the name is auto-detected on subsequent uses:

```
@سمير
أنا سمير.

سمير
وده كلامي.
```

### Character Extensions

```
@سمير (صوت من خارج المشهد)
أنا مش هنا.
```

| Arabic             | English | Meaning                   |
| ------------------ | ------- | ------------------------- |
| صوت من خارج المشهد | V.O.    | Voice over                |
| ص.خ                | V.O.    | Voice over (abbreviation) |
| خارج الشاشة        | O.S.    | Off screen                |
| خ.ش                | O.S.    | Off screen (abbreviation) |
| خارج الكادر        | O.C.    | Off camera                |
| تابع               | CONT'D  | Continued                 |

## Dialogue

Any text following a character element. No markers needed:

```
@سمير
قهوة سادة، لو سمحت. وممكن شوية مية.
```

Dialogue continues until a blank line.

## Parentheticals

Text in parentheses on its own line within a dialogue block:

```
@سمير
(بهدوء)
مش عايز حاجة تاني.
```

## Dual Dialogue

Caret `^` after the second character name:

```
@سمير
أيوه!

@نادية ^
لأ!
```

## Action / Description

Any paragraph not matching other element types:

```
سمير بيمشي في الشارع. الدنيا زحمة.
```

Force with `!` prefix:

```
!سمير بيتكلم لوحده وهو ماشي.
```

## Transitions

Standalone Arabic keywords, optionally wrapped in dashes:

```
قطع

- قطع -

- اختفاء تدريجي -
```

### Common Transition Keywords

| Arabic         | English       | Meaning          |
| -------------- | ------------- | ---------------- |
| قطع            | CUT TO        | Cut              |
| قطع إلى        | CUT TO        | Cut to           |
| قطع مفاجئ      | SMASH CUT TO  | Smash cut        |
| قطع متطابق     | MATCH CUT TO  | Match cut        |
| اختفاء تدريجي  | FADE OUT      | Gradual fade out |
| ظهور تدريجي    | FADE IN       | Gradual fade in  |
| مزج            | DISSOLVE TO   | Dissolve         |
| ذوبان          | DISSOLVE TO   | Dissolve         |
| تلاشي إلى أسود | FADE TO BLACK | Fade to black    |
| قطع قافز       | JUMP CUT TO   | Jump cut         |
| تجميد الكادر   | FREEZE FRAME  | Freeze frame     |
| شاشة منقسمة    | SPLIT SCREEN  | Split screen     |

Force any line as a transition with `>` prefix:

```
>أي نص هنا
```

## Emphasis / Formatting

| Syntax       | Result            |
| ------------ | ----------------- |
| `*text*`     | Italic            |
| `**text**`   | **Bold**          |
| `***text***` | **_Bold Italic_** |
| `_text_`     | Underline         |

In Arabic screenplays, **bold** replaces UPPERCASE for emphasis.

## Centered Text

```
>النهاية<
```

## Page Breaks

Three or more equals signs:

```
===
```

## Sections and Synopses

Sections (not rendered in output):

```
# الفصل الأول
## المشهد الأول
```

Synopses (not rendered in output):

```
= سمير بيقابل حسن في القهوة وبيعرف الخبر.
```

## Notes and Comments

Inline notes (stripped from output by default):

```
سمير بيمشي [[لازم نصور المشهد ده في وسط البلد]] في الشارع.
```

Boneyard/comments (always removed):

```
/* المشهد ده محتاج إعادة كتابة */
```

## Lyrics

Tilde prefix:

```
~يا ليل يا عين
```

## Text Direction

Auto-detected from content. Override in title page:

```
Direction: rtl
```

## CLI Tool

Install: `npm install -g @hekaya/cli`

```bash
hekaya parse script.hekaya              # Parse to JSON
hekaya render script.hekaya -o out.html  # Render to HTML
hekaya export script.hekaya -o out.pdf   # Export to PDF
hekaya export script.hekaya --include-notes -o out.pdf  # Include notes
hekaya validate script.hekaya            # Validate structure
hekaya convert script.hekaya -o out.fountain  # Convert format
```

## npm Packages

```bash
npm install @hekaya/parser    # Zero-dependency parser
npm install @hekaya/renderer  # HTML renderer
npm install @hekaya/pdf       # PDF generator
npm install -g @hekaya/cli    # CLI tool
```

## Complete Example

```
العنوان: آخر أيام الصيف
سيناريو: سمير عبدالحميد
مسودة: المسودة الأولى
تاريخ: ٢٠٢٦/٢/٢٣

داخلي - قهوة بلدي - نهار

قهوة بلدي قديمة في وسط البلد. سمير قاعد لوحده في ركن.

@سمير
(لنفسه)
كل يوم نفس المنظر.

حسن بيدخل القهوة.

@حسن
(بفرحة)
يا سمير! أنا قاعد أدور عليك!

@سمير
(من غير ما يبص)
وأنا قاعد أستنى حد يدور عليا.

===

خارجي - شارع وسط البلد - نهار

سمير وحسن ماشيين في الشارع.

@حسن
يلا بينا. عندنا شغل كتير.

- اختفاء تدريجي -

>النهاية<
```

## Notes

- Arabic has no uppercase — use `@` prefix for character names and **bold** for emphasis
- Dash separator style is preferred: `داخلي - قهوة - نهار`
- Backward-compatible with standard Fountain files
- Character names support alef normalization (أ إ آ ا treated as equivalent)
- All transition keywords sourced from real Egyptian production screenplays
