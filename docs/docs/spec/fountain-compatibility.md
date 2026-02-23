---
sidebar_position: 2
title: Fountain Compatibility
---

# Fountain Compatibility

Hekaya is designed to be a **superset** of the Fountain specification. Any valid `.fountain` file should parse correctly with the Hekaya parser.

## What Works Identically

These Fountain elements work exactly the same in Hekaya:

- Scene headings with English keywords (INT, EXT, EST, INT./EXT, I/E)
- Character names in UPPERCASE (English)
- Dialogue and parentheticals
- Transitions ending in "TO:" (English)
- Emphasis: `*italic*`, `**bold**`, `***bold italic***`, `_underline_`
- Centered text: `>text<`
- Page breaks: `===`
- Sections: `# Section`
- Synopses: `= Synopsis`
- Notes: `[[note]]`
- Boneyard: `/* comment */`
- Lyrics: `~lyrics`
- Dual dialogue: `CHARACTER ^`
- Force prefixes: `.`, `@`, `!`, `>`, `~`
- Title page with English keys

## What Hekaya Adds

| Feature                  | Fountain       | Hekaya                                         |
| ------------------------ | -------------- | ---------------------------------------------- |
| Arabic scene headings    | Not supported  | `داخلي`, `خارجي`, `مقدر`, `داخلي/خارجي`, `د/خ` |
| Arabic title page keys   | Not supported  | `العنوان`, `المؤلف`, `مسودة`, etc.             |
| Arabic transitions       | Not supported  | `قطع`, `- قطع -`, `اختفاء تدريجي`, etc.        |
| Character Registry       | Not present    | Auto-detect names after first `@` introduction |
| Arabic numerals          | Not supported  | `#١#` for scene numbers                        |
| Text direction metadata  | Not present    | `اتجاه: يمين-لليسار` or `Direction: rtl`       |
| `.hekaya` file extension | Not recognized | Primary extension                              |

## Intentional Deviations

### Character Detection

Fountain detects characters via UPPERCASE. Since Arabic has no case distinction, Hekaya adds:

1. The `@` prefix as the primary method for Arabic names
2. The Character Registry for auto-detection after first introduction

This is **additive** — UPPERCASE English detection still works.

### Transition Detection

Fountain detects transitions as UPPERCASE lines ending in "TO:". Hekaya adds Arabic transition keywords as standalone text (e.g., `قطع`, `- اختفاء تدريجي -`), sourced from real Egyptian production screenplays. This is **additive** — English transitions still work.

### Emphasis Semantics

In Fountain, UPPERCASE conveys emphasis (e.g., "He was NOT happy"). In Arabic, this is impossible. Hekaya recommends **bold** (`**text**`) for emphasis in Arabic text.

## Converting Between Formats

### `.fountain` → `.hekaya`

```bash
hekaya convert script.fountain -o script.hekaya
```

This is a no-op for content — the file is renamed and parses identically. The converter may add Arabic title page keys if the content is Arabic.

### `.hekaya` → `.fountain`

```bash
hekaya convert script.hekaya -o script.fountain
```

Arabic-specific features are preserved as-is. The resulting file is valid Fountain with extensions that non-Hekaya parsers may not understand (they'll typically treat Arabic keywords as action text).

## Testing Compatibility

The Hekaya test suite includes standard Fountain test files to verify backward compatibility. Any regression in Fountain parsing is treated as a bug.
