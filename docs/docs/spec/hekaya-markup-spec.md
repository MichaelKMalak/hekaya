---
sidebar_position: 1
title: Hekaya Markup Specification
---

# Hekaya Markup Specification v0.1

Hekaya extends the [Fountain](https://fountain.io/syntax/) screenplay markup language with native RTL support and Arabic-language elements. This specification defines every element of the Hekaya markup.

## Design Principles

1. **Built for Egyptian and Arabic-speaking screenwriters**: The syntax feels natural for writing in Arabic, not like a translation of an English system.
2. **Backward-compatible with Fountain**: Standard `.fountain` files parse correctly. Hekaya adds to Fountain; it does not break it.
3. **Explicit markers over implicit detection**: Arabic lacks uppercase, so elements that Fountain detects via UPPERCASE use explicit prefixes in Hekaya.
4. **Bidirectional by design**: Mixed Arabic/English text works correctly throughout.

## File Format

- Extension: `.hekaya` (primary) or `.fountain` (compatibility mode)
- Encoding: UTF-8
- Line endings: LF or CRLF (normalized during parsing)

---

## Title Page

Key-value pairs at the beginning of the file, separated from the script body by a blank line. Both Arabic and English keys are accepted.

```
العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد
مسودة: المسودة الأولى
تاريخ: ٢٠٢٦/٢/٢٣
تواصل: samir@example.com
```

### Key Mappings

| Arabic Key | English Key | Purpose           |
| ---------- | ----------- | ----------------- |
| العنوان    | Title       | Script title      |
| المؤلف     | Author      | Author name       |
| المؤلفون   | Authors     | Multiple authors  |
| المصدر     | Source      | Source material   |
| مسودة      | Draft date  | Draft information |
| تاريخ      | Date        | Date              |
| تواصل      | Contact     | Contact info      |
| حقوق       | Copyright   | Copyright notice  |
| ملاحظات    | Notes       | Notes             |
| ائتمان     | Credit      | Credit line       |

Multi-line values indent with spaces or tabs:

```
المؤلف:
    سمير عبدالحميد
    ونادية حسن
```

---

## Scene Headings

Lines beginning with Arabic or English scene heading keywords.

### Arabic Keywords

| Arabic      | English Equivalent | Meaning           |
| ----------- | ------------------ | ----------------- |
| داخلي       | INT                | Interior          |
| خارجي       | EXT                | Exterior          |
| تأسيس       | EST                | Establishing      |
| داخلي/خارجي | INT/EXT            | Interior/Exterior |
| خارجي/داخلي | EXT/INT            | Exterior/Interior |
| د/خ         | I/E                | Abbreviation      |

### Syntax

```
داخلي - قهوة بلدي - نهار
خارجي - شارع وسط البلد - ليل
داخلي/خارجي - عربية متحركة - غروب
```

English scene headings also work:

```
INT. COFFEE SHOP - DAY
EXT. CITY STREET - NIGHT
```

### Forced Scene Heading

Prefix with `.` (period) to force any line as a scene heading:

```
.المشهد الخاص
```

### Scene Numbers

Use `#` delimiters (both Arabic and Western numerals accepted):

```
داخلي - قهوة بلدي - نهار #١#
داخلي - قهوة بلدي - نهار #1#
```

---

## Character Names

### Primary Method: `@` Prefix

The `@` symbol before a name designates a character cue:

```
@سمير
قهوة سادة، لو سمحت.
```

The first `@` usage registers the name in the **Character Registry**.

### Auto-Detection (After Registration)

Once a name is registered via `@`, subsequent standalone lines matching that name (followed by dialogue) are auto-detected:

```
@سمير
أنا سمير.

سمير
وده كلامي.
```

The second "سمير" is auto-detected because it was previously registered.

### Character Extensions

Parenthetical extensions after the name:

```
@سمير (صوت خارجي)
أنا مش هنا.

@نادية (خارج الشاشة)
بس أنا سامعاك.
```

| Arabic | English | Meaning                  |
| ------ | ------- | ------------------------ |
| ص.خ    | V.O.    | Voice over (صوت خارجي)   |
| خ.ش    | O.S.    | Off screen (خارج الشاشة) |
| تابع   | CONT'D  | Continued                |

### English Character Names

Standard Fountain UPPERCASE detection works for English names:

```
JOHN
Hello there.
```

---

## Dialogue

Any text following a character element. No special markers needed:

```
@سمير
قهوة سادة، لو سمحت. وممكن شوية مية.
```

Dialogue continues until a blank line.

---

## Parentheticals

Text in parentheses on its own line, within a dialogue block:

```
@سمير
(بهدوء)
مش عايز حاجة تاني.

@نادية
(وهي بتمشي)
خلاص، أنا ماشية.
```

---

## Dual Dialogue

Caret `^` after the second character name for side-by-side dialogue:

```
@سمير
أيوه!

@نادية ^
لأ!
```

---

## Action / Description

Any paragraph not matching other element types:

```
سمير بيمشي في الشارع. الدنيا زحمة. بيبص على الموبايل وبعدين بيحطه في جيبه.
```

### Forced Action

Prefix with `!` to force any line as action (prevents misdetection):

```
!سمير بيتكلم لوحده وهو ماشي.
```

---

## Transitions

### Arabic Transition Keywords

Transitions are standalone keywords on their own line, preceded by a blank line. They can optionally be wrapped in dashes, matching the convention used in real Egyptian production screenplays.

```
قطع

- قطع -

- اختفاء تدريجي -
```

All keywords were sourced from real production Egyptian screenplays (الشيخ جاكسون، هيبتا، سهر الليالي، دم الغزال، ابراهيم الابيض).

| Arabic         | English Equivalent | Meaning                            |
| -------------- | ------------------ | ---------------------------------- |
| قطع            | CUT TO             | Cut                                |
| قطع إلى        | CUT TO             | Cut to                             |
| قطع مفاجئ      | SMASH CUT TO       | Smash cut (القطع المفاجئ)          |
| قطع متطابق     | MATCH CUT TO       | Match cut (القطع المتطابق)         |
| اختفاء تدريجي  | FADE OUT           | Gradual fade out (التلاشي الخارجي) |
| ظهور تدريجي    | FADE IN            | Gradual fade in (التلاشي الداخلي)  |
| مزج            | DISSOLVE TO        | Dissolve                           |
| ذوبان          | DISSOLVE TO        | Dissolve (الذوبان)                 |
| عودة للمشهد    | BACK TO SCENE      | Back to scene                      |
| تلاشي إلى أسود | FADE TO BLACK      | Fade to black                      |
| تلاشي إلى      | FADE TO            | Fade to                            |

### Forced Transition

Prefix with `>` to force any line as a transition:

```
>أي نص هنا
```

### English Transitions

Standard Fountain UPPERCASE transitions work:

```
CUT TO:
DISSOLVE TO:
```

---

## Centered Text

Wrap with `>` and `<`:

```
>النهاية<
>آخر أيام الصيف<
```

---

## Emphasis / Formatting

| Syntax       | Result            |
| ------------ | ----------------- |
| `*text*`     | _Italic_          |
| `**text**`   | **Bold**          |
| `***text***` | **_Bold Italic_** |
| `_text_`     | Underline         |

**Note**: In Arabic screenplays, **bold** replaces UPPERCASE for emphasis (since Arabic has no case distinction).

---

## Page Breaks

Three or more equals signs:

```
===
```

---

## Sections

Hash marks for script structure (not rendered in output):

```
# الفصل الأول
## المشهد الأول
### الجزء الأول
```

---

## Synopses

Equals prefix for brief summaries (not rendered in output):

```
= سمير بيقابل حسن في القهوة وبيعرف الخبر.
```

---

## Notes

Double brackets for inline notes (not rendered in output):

```
سمير بيمشي [[لازم نصور المشهد ده في وسط البلد]] في الشارع.
```

---

## Boneyard (Comments)

C-style block comments — completely removed from output:

```
/* المشهد ده محتاج إعادة كتابة */
```

---

## Lyrics

Tilde prefix:

```
~يا ليل يا عين
~يا ليل يا ليل يا عين
```

---

## Text Direction

### Auto-Detection

The parser detects base direction from content:

- Predominantly Arabic characters → RTL
- Predominantly Latin characters → LTR
- Mixed → determined by title page language

### Explicit Direction

Set in title page:

```
اتجاه: يمين-لليسار
```

or

```
Direction: rtl
```

### Per-Element Direction

Individual elements inherit base direction but can contain mixed-direction text. The Unicode BiDi algorithm handles inline mixing.

---

## Complete Example

```
العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد
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
