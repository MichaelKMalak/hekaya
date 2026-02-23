---
sidebar_position: 4
title: RTL/Arabic Technical Challenges
---

# 04 - RTL/Arabic Technical Challenges

## The Fundamental Challenge: Arabic Has No Uppercase

This single fact drives most of Hekaya's design decisions. Fountain relies on UPPERCASE for:

- **Character names**: Detected as all-caps standalone lines
- **Transitions**: Detected as all-caps lines ending in "TO:"
- **Emphasis**: Uppercase conveys importance in English screenplays

In Arabic, these must use alternative detection mechanisms.

## Arabic Script Characteristics

### Letter Forms

Arabic letters change shape based on position in a word:

- **Isolated**: ع
- **Initial**: عـ
- **Medial**: ـعـ
- **Final**: ـع

This is handled by text shaping engines (HarfBuzz) and is transparent to the parser. The PDF generator must use proper fonts.

### Diacritics (Tashkeel / تشكيل)

Optional vowel marks above/below letters:

- Fathah (فَتحة): short "a"
- Kasrah (كِسرة): short "i"
- Dammah (ضُمة): short "u"
- Sukun (سُكون): no vowel
- Shadda (شَدّة): doubled consonant
- Tanween: nunation marks

**Impact on parsing**: Regex patterns must account for optional diacritical marks between base characters. Character name matching must normalize (strip diacritics for comparison).

Unicode ranges for Arabic diacritics: `\u0610-\u061A`, `\u064B-\u065F`, `\u0670`

### Alef Variants

Multiple forms of Alef that should be treated as equivalent:

- ا (bare alef)
- أ (alef with hamza above)
- إ (alef with hamza below)
- آ (alef with madda)
- ٱ (alef wasla)

Character Registry must normalize these for name matching.

### Numerals

Arabic uses two numeral systems:

- Eastern Arabic: ٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩
- Western Arabic (standard): 0 1 2 3 4 5 6 7 8 9

Hekaya accepts both for scene numbers and other numeric contexts.

## Bidirectional Text (BiDi)

### Unicode BiDi Algorithm

The Unicode Bidirectional Algorithm (UBA, UAX #9) determines display order for mixed-direction text. Key concepts:

- **Base direction**: The default direction of the paragraph (RTL for Arabic)
- **Strong characters**: Characters with inherent directionality (Arabic = RTL, Latin = LTR)
- **Weak characters**: Numbers, punctuation — direction inherited from context
- **Embedding/override**: Unicode control characters for explicit direction

### BiDi in Screenplay Context

Common mixed-direction scenarios:

1. Arabic dialogue mentioning English names: `سمعت أن John قادم`
2. Scene headings with English location names: `داخلي. McDonald's - نهار`
3. Bilingual scripts with alternating language sections
4. Arabic text with embedded Latin technical terms

### Implementation Approach

- Parser: preserve text as-is, detect base direction from content
- HTML renderer: use `dir="rtl"` attribute, let browser handle BiDi
- PDF generator: use pdfmake-rtl which handles BiDi internally

## RTL Screenplay Page Layout

### Standard English Layout

```
|-1.5"--|-------- content ---------|--1.0"-|
|       |                          |       |
| bind  | Scene heading            |       |
|       |                          |       |
|       | Action text wraps here   |       |
|       |                          |       |
|       |     CHARACTER NAME       |       |
|       |       (parenthetical)    |       |
|       |   Dialogue text here     |       |
|       |                          |       |
|       |              CUT TO:     |       |
```

### Arabic RTL Layout (Mirrored)

```
|--1.0"-|-------- content ---------|--1.5"-|
|       |                          |       |
|       |          عنوان المشهد    | bind  |
|       |                          |       |
|       |   نص الوصف يلتف هنا     |       |
|       |                          |       |
|       |       اسم الشخصية        |       |
|       |    (توجيه الأداء)        |       |
|       |     نص الحوار هنا        |       |
|       |                          |       |
|       | :قطع إلى                 |       |
```

Margins:

- **English**: Left 1.5" (binding), Right 1.0"
- **Arabic**: Right 1.5" (binding — pages turn opposite direction), Left 1.0"

Character names and dialogue still centered/indented, but from the right.

## Font Challenges

### No Standard Monospaced Arabic Font

English screenplays use Courier 12pt. The monospaced font ensures:

- Consistent character width → predictable page count
- "1 page ≈ 1 minute" industry rule

Arabic has no equivalent monospaced standard. Implications:

- Page count varies by font choice
- The "1 page = 1 minute" rule doesn't directly apply
- Need to establish a recommended font + size that approximates similar timing

### Recommended Arabic Fonts

| Font              | Style                    | Use Case                |
| ----------------- | ------------------------ | ----------------------- |
| Cairo             | Clean, modern sans-serif | Action, dialogue        |
| Noto Naskh Arabic | Traditional naskh        | Body text               |
| Scheherazade New  | Calligraphic naskh       | Title pages             |
| IBM Plex Arabic   | Modern, has mono variant | Closest to "monospaced" |
| Amiri             | Naskh, high quality      | Formal scripts          |

### Font Embedding

PDF output must embed fonts (not reference system fonts) for:

- Consistent rendering across systems
- Proper glyph shaping
- Diacritics support

## Known Issues in Existing Tools

### Flutter Arabic Text Issues

- Diacritics rendering bugs when separated into different text spans (iOS)
- Letter spacing doesn't render correctly in Arabic on web
- Open issues: flutter/flutter#16886, #54529, #73108, #143975

### PDF Generation Issues

- pdfmake: ligatures not fully supported for complex scripts
- pdfkit: no RTL support at all
- jsPDF: partial RTL via BiDi algorithm, limited with mixed content

### Best Current Solution

- **pdfmake-rtl** (`@digicole/pdfmake-rtl`): drop-in replacement for pdfmake with automatic RTL detection, smart table column reversal, Unicode script detection

## References

- [Unicode Bidirectional Algorithm (UAX #9)](https://unicode.org/reports/tr9/)
- [W3C Arabic & Persian Layout Requirements](https://www.w3.org/International/alreq/)
- [RTL Styling 101](https://rtlstyling.com/posts/rtl-styling/)
- [HarfBuzz: Why Do I Need a Shaping Engine?](https://harfbuzz.github.io/why-do-i-need-a-shaping-engine.html)
- [HarfBuzz Shaping Concepts](https://harfbuzz.github.io/shaping-concepts.html)
- [Dramatify Arabic Formatting](https://dramatify.com/now-supporting-scripts-screenplays-in-arabic-farsi)
- [WriterDuet RTL Template](https://www.writerduet.com/article/418-right-to-left-screenplay-template)
- [pdfmake-rtl GitHub](https://github.com/aysnet1/pdfmake-rtl)
- [Flutter Arabic Diacritics Issue](https://github.com/flutter/flutter/issues/16886)
