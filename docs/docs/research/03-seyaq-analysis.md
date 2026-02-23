---
sidebar_position: 3
title: Seyaq Markup Analysis
---

# 03 - Seyaq Markup Language Analysis

## Background

Seyaq (سياق) was an open, plain-text markup language specifically designed for writing Arabic screenplays. The website seyaq.org was archived around July 2023 and the software is no longer available. Seyaq is the closest precedent to what Hekaya aims to achieve.

The ecosystem had two parts:

- **Seyaq** — the markup language (like Fountain/HTML)
- **Miktab** — the editor software (like Highland/a web browser)

## Seyaq's Design Philosophy

From the archived website: "a simple markup language designed specifically for writing movie scripts using plain text" — targeting Egyptian and Arabic-speaking screenwriters.

Key principles:

1. **Any text editor** — writers could use Notepad, TextEdit, etc.
2. **Content over presentation** — focus on the story, not formatting
3. **Open standard** — not locked to one editor
4. **Parser/renderer separation** — raw text → formatted screenplay

This is exactly the same philosophy as Fountain, applied to Arabic.

## Seyaq Syntax (Reconstructed from Archive)

### Version 1 Syntax (from seyaq.org)

```
#داخلي. كافيه - نهار

نشاهد فهد يحاسب على بعض الطلبات

@فهد
(متضايق)
يا اخي مرات ودك ما تطلع من بيتك

@يوسف
(يتلفت)
مين .. شفت مين

^قطع
```

Elements:
| Symbol | Element | Example |
|--------|---------|---------|
| `#` | Scene heading | `#داخلي. كافيه - نهار` |
| `@` | Character name | `@فهد` |
| `( )` | Parenthetical | `(متضايق)` |
| `^` | Transition | `^قطع` |
| Plain text | Action/Dialogue | Context-dependent |

### Version 2 Syntax (from screenshots/demos)

An alternative syntax was also found in demos:
| Symbol | Element |
|--------|---------|
| `#` | Scene heading |
| `##` | Character name (alternative to `@`) |
| `( )` | Parenthetical |
| Plain text | Action/Dialogue |

The double-hash `##` for character names formatted as bold, centered text.

## Seyaq's Parser Pipeline

```
Raw .seyaq text file
    ↓
Seyaq Parser (reads #, ##, @, parentheses, ^)
    ↓
Formatted Screenplay (PDF, Final Draft, etc.)
    ↓
Displayed in Miktab or exported for production
```

## What Hekaya Inherits from Seyaq

1. **`@` prefix for character names** — proven convention for Arabic screenwriters
2. **Arabic scene heading keywords** — `داخلي` (INT), `خارجي` (EXT)
3. **Plain-text, any-editor philosophy** — identical approach
4. **Parser/renderer separation** — content ≠ presentation
5. **Arabic-first design** — not a translation of an English system

## What Hekaya Improves Over Seyaq

1. **Fountain backward compatibility** — Seyaq was standalone; Hekaya extends Fountain
2. **Character Registry** — auto-detect names after first `@` introduction (Seyaq required `@` every time)
3. **Bilingual support** — mixed Arabic/English scripts work naturally
4. **Modern tooling** — TypeScript, npm ecosystem, pdfmake for PDF
5. **Open specification** — documented, versioned, testable
6. **Richer elements** — notes, boneyard, sections, synopses, dual dialogue (from Fountain)
7. **Export formats** — HTML, PDF (Seyaq only had Miktab rendering)

## Why Seyaq Matters

Seyaq proved that:

- Arabic screenwriters want a plain-text markup approach
- The `@` convention for characters works for Arabic writers
- Arabic-specific scene heading keywords (داخلي/خارجي) are intuitive
- A dedicated Arabic screenplay tool has genuine demand
- The concept is sound; the execution needs to be sustainable (open-source, community-driven)

Seyaq's disappearance creates both an opportunity and a responsibility: Hekaya must be sustainable, open, and well-documented so it doesn't meet the same fate.
