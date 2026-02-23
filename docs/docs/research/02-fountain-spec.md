---
sidebar_position: 2
title: Fountain Format Analysis
---

# 02 - Fountain Format Analysis

## Overview

Fountain is a free, open-source plain-text markup language for screenwriting. Created by John August and Nima Yousefi (merging "Scrippets" and Stu Maschwitz's "Screenplay Markdown"). The golden rule: "make it look like a screenplay."

- **Official site**: https://fountain.io/
- **Syntax spec**: https://fountain.io/syntax/
- **Developer resources**: https://fountain.io/developers/

## Core Syntax Elements

### Title Page

Key-value pairs at the top of the file, separated from the script body by a blank line:

```
Title: Big Fish
Author: John August
Draft date: January 2003
```

### Scene Headings

Lines beginning with `INT`, `EXT`, `EST`, `INT./EXT`, `INT/EXT`, or `I/E` followed by a period or space:

```
INT. COFFEE SHOP - DAY
EXT. CITY STREET - NIGHT
```

Forced with `.` prefix: `.MONTAGE`
Scene numbers with `#`: `INT. HOUSE - DAY #1#`

### Character Names

ALL UPPERCASE text preceded by a blank line, followed by dialogue:

```
JOHN
Hello, how are you?
```

Forced with `@` prefix: `@McCLOUD`
Extensions in parentheses: `JOHN (V.O.)`, `MARY (CONT'D)`

### Dialogue

Text following a character element:

```
JOHN
This is dialogue. It continues
until a blank line.
```

### Parentheticals

Text in parentheses on its own line within a dialogue block:

```
JOHN
(whispering)
Don't move.
```

### Action/Description

Any paragraph not matching other element types. Forced with `!` prefix.

### Transitions

UPPERCASE text ending in `TO:`:

```
CUT TO:
DISSOLVE TO:
```

Forced with `>` prefix: `> FADE TO BLACK`

### Centered Text

`>TEXT<` syntax:

```
>THE END<
```

### Emphasis

- Italics: `*text*`
- Bold: `**text**`
- Bold Italic: `***text***`
- Underline: `_text_`

### Page Breaks

Three or more equals signs: `===`

### Sections

Hash marks for hierarchy: `# Act One`, `## Scene 1`

### Synopses

Equals prefix: `= John arrives at the office.`

### Notes

Double brackets: `[[This is a note]]`

### Boneyard (Comments)

C-style block comments: `/* This is removed from output */`

### Lyrics

Tilde prefix: `~Singing in the rain`

### Dual Dialogue

Caret after second character: `JOHN ^`

## Existing Parser Implementations

### JavaScript

**Fountain.js** (mattdaly)

- GitHub: https://github.com/mattdaly/Fountain.js
- 12 commits, MIT license
- Plain JavaScript, no TypeScript, no dependencies
- Single monolithic file approach
- Works in browser (HTML5 File API) and Node.js
- Demo: https://mattdaly.github.io/Fountain.js/

**fountain-js** (npm package)

- npm: https://www.npmjs.com/package/fountain-js
- Modern TypeScript rewrite
- v1.2.4, clean separation: rules.ts, lexer.ts, fountain.ts
- 21 element types defined
- Extensible InlineLexer

**screenplay-tools** (wildwinter)

- GitHub: https://github.com/wildwinter/screenplay-tools
- Multi-language: C++, JavaScript, Python, C#
- 142 commits, MIT license, actively maintained
- Supports both Fountain and FDX (Final Draft XML)
- Clean architecture: Parser → Script object → Writer

### Python

**Jouvence**

- GitHub: https://github.com/ludovicchabant/Jouvence
- 47 commits, MIT license
- Most complete Python parser
- PyPI: https://pypi.org/project/Jouvence/
- Parse, render to HTML, terminal output

**fountain** (by Tagirijus)

- GitHub: https://github.com/Tagirijus/fountain
- Python port of the ObjC parser

### Original (Objective-C)

**nyousefi/Fountain**

- GitHub: https://github.com/nyousefi/Fountain
- 31 commits, MIT license
- Components: FNScript, FastFountainParser, FountainWriter
- Uses RegexKitLite (abandoned)
- macOS/iOS sample projects

### Other Languages

- **Go**: https://github.com/rsdoiel/fountain (stable, AGPL-3.0)
- **Ruby**: https://github.com/Joeboy/Textplay (CLI tool, Fountain → HTML/XML/FDX)
- **Perl**: https://github.com/Ovid/fountain-parser (early stage)

## Key Patterns for Hekaya's Design

1. **Regex-based detection** — all parsers use regex for element identification
2. **Two-pass parsing** — preprocess (strip boneyard/notes) then tokenize
3. **Context-dependent elements** — dialogue is only dialogue if preceded by character
4. **Force prefixes** — `@`, `.`, `!`, `>`, `~` override auto-detection
5. **The UPPERCASE problem** — Fountain's biggest assumption, doesn't work for Arabic

## What Hekaya Must Change

| Fountain Assumption              | Problem for Arabic  | Hekaya Solution                 |
| -------------------------------- | ------------------- | ------------------------------- |
| Character names = UPPERCASE      | Arabic has no case  | `@` prefix + Character Registry |
| Scene heading keywords (INT/EXT) | English only        | Add Arabic equivalents          |
| Transitions end in "TO:"         | English pattern     | Arabic keywords + `:` suffix    |
| Title page keys in English       | Not localized       | Arabic key mappings             |
| LTR text direction assumed       | Arabic is RTL       | BiDi auto-detection             |
| Emphasis via UPPERCASE           | No case distinction | Bold replaces uppercase         |
