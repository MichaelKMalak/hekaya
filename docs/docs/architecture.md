---
sidebar_position: 2
title: Architecture
---

# System Architecture

## Overview

Hekaya is a monorepo containing four packages that form a pipeline from plain text to formatted output:

```
.hekaya file → Parser → Token Stream → Renderer → HTML/PDF
```

## Package Dependency Graph

```
@hekaya/parser (zero dependencies)
    ↓
@hekaya/renderer (depends on parser)
    ↓
@hekaya/pdf (depends on parser)
    ↓
@hekaya/cli (depends on all above)
```

## Package Details

### @hekaya/parser

The core package. Converts `.hekaya` plain text into a structured token stream.

**Key modules:**

- `types.ts` — TypeScript interfaces for all token types, script structure, parse options
- `rules.ts` — All regex patterns for element detection (Arabic + English)
- `keywords.ts` — Arabic↔English keyword mappings (scene headings, transitions, title page keys)
- `lexer.ts` — Two-pass tokenizer (preprocess → tokenize)
- `character-registry.ts` — Tracks character names; enables auto-detection after first `@` introduction
- `bidi.ts` — Bidirectional text utilities (direction detection, Unicode markers)
- `inline-lexer.ts` — Inline formatting (bold, italic, underline)
- `serializer.ts` — Converts token stream back to Fountain/Hekaya plain text (round-trip support)
- `hekaya.ts` — Public API class

**Design constraints:**

- Zero runtime dependencies (critical for Dart porting in Phase 2)
- All regex uses Unicode flag (`u`)
- Arabic keywords alongside English (not replacing)

### @hekaya/renderer

Converts parser token stream to screenplay-formatted HTML.

**Key modules:**

- `html-renderer.ts` — Token → HTML conversion
- `styles.ts` — CSS for both RTL and LTR screenplay layouts

### @hekaya/pdf

Converts parser token stream to PDF using pdfmake-rtl.

**Key modules:**

- `pdf-generator.ts` — Token → pdfmake document definition
- `page-layout.ts` — Screenplay page layout (margins, element positioning) for both LTR and RTL
- `fonts.ts` — Arabic font loading and embedding

**Dependencies:** `@digicole/pdfmake-rtl`

### @hekaya/cli

Command-line interface wrapping all packages.

**Commands:**

- `hekaya parse` — Output token stream as JSON
- `hekaya render` — Generate HTML
- `hekaya export` — Generate PDF
- `hekaya validate` — Check file against spec
- `hekaya convert` — Convert between `.fountain` and `.hekaya`

**Dependencies:** `commander`, `chalk`

## Parser Architecture

### Two-Pass Tokenization

**Pass 1: Preprocessing**

1. Strip boneyard content (`/* ... */`), save references
2. Extract notes (`[[ ... ]]`), save references
3. Normalize line endings
4. Detect base text direction

**Pass 2: Tokenization**

1. Split into blocks by blank lines
2. Check for title page (first block with key-value pairs)
3. For each block, test against rules in priority order:
   - Forced elements (`@`, `.`, `!`, `>`, `~`)
   - Page breaks (`===`)
   - Scene headings (Arabic keywords, then English)
   - Transitions (Arabic keywords, then English)
   - Sections (`#`)
   - Synopses (`=`)
   - Centered text (`>...<`)
   - Character (forced `@`, then registered name, then UPPERCASE English)
   - Dialogue (if previous token was character/parenthetical)
   - Parenthetical (if inside dialogue block)
   - Default: action

### Character Registry Flow

```
1. Writer types: @سمير
2. Parser detects @ prefix → character element
3. CharacterRegistry.register("سمير")
4. Later, writer types: سمير (standalone line before dialogue)
5. Parser checks CharacterRegistry.isKnown("سمير") → true
6. Detected as character element (no @ needed)
```

## Technology Stack

| Concern         | Choice                  | Rationale                     |
| --------------- | ----------------------- | ----------------------------- |
| Language        | TypeScript 5.x (strict) | Type safety, Dart portability |
| Package Manager | pnpm workspaces         | Fast, disk-efficient          |
| Build           | tsup                    | Fast ESM + CJS output         |
| Tests           | Vitest                  | TypeScript-native, fast       |
| PDF             | @digicole/pdfmake-rtl   | Best RTL PDF in Node.js       |
| CLI             | Commander.js            | Standard, well-documented     |
| Docs            | Docusaurus              | Modern, Markdown-based        |

## Phase 2: Flutter Desktop App

The TypeScript parser design facilitates Dart porting:

- Zero dependencies → straightforward translation
- Type interfaces map to Dart classes
- Regex patterns work identically in Dart
- The spec document is language-agnostic

Flutter app will use:

- `super_editor` or `flutter_quill` for rich text editing
- Character Registry for autocomplete suggestions
- Syncfusion Flutter PDF for export
- macOS + Windows builds via Flutter desktop
