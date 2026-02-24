---
sidebar_position: 8
title: FDX Format & WriterSolo Analysis
---

# 08 - FDX Format & WriterSolo Analysis

## Overview

FDX (Final Draft XML) is the industry-standard screenplay exchange format used by Final Draft, WriterSolo, and other professional screenwriting tools. This document analyzes the FDX format based on exports from WriterSolo and maps every element to its Hekaya/Fountain equivalent.

**Analysis date**: 2026-02-24
**Source**: WriterSolo FDX and Fountain exports

## FDX Document Structure

```xml
<FinalDraft DocumentType="Script" Template="No" Version="2">
  <Content>           <!-- Script body: paragraphs -->
  <HeaderAndFooter>   <!-- Page headers/footers -->
  <PageLayout>        <!-- Page size, margins -->
  <ElementSettings>   <!-- Per-element formatting (margins, fonts, styles) -->
  <TitlePage>         <!-- Title page content -->
  <MoresAndContinueds> <!-- Page break continuation markers -->
  <ScriptNoteDefinitions> <!-- Note type categories -->
  <SmartType>         <!-- Autocomplete lists -->
  <Revisions>         <!-- Draft revision tracking -->
</FinalDraft>
```

## Element-by-Element Mapping

### Core Script Elements (1-to-1 with Hekaya)

| FDX Type        | Fountain Syntax      | Hekaya Type     | Status                              |
| --------------- | -------------------- | --------------- | ----------------------------------- |
| `Scene Heading` | `INT. PLACE - TIME`  | `scene_heading` | Supported                           |
| `Action`        | Plain text paragraph | `action`        | Supported                           |
| `Character`     | `UPPERCASE NAME`     | `character`     | Supported (+ `@` prefix for Arabic) |
| `Dialogue`      | Text after character | `dialogue`      | Supported                           |
| `Parenthetical` | `(text)` in dialogue | `parenthetical` | Supported                           |
| `Transition`    | `CUT TO:` or `>text` | `transition`    | Supported                           |
| `Lyrics`        | `~text`              | `lyrics`        | Supported                           |

### FDX-Only Elements (No Direct Hekaya Equivalent)

| FDX Type                | Fountain Workaround          | Hekaya Behavior                  | Priority |
| ----------------------- | ---------------------------- | -------------------------------- | -------- |
| `Shot` (e.g., POV SHOT) | `.POV SHOT` (forced heading) | Parsed as forced `scene_heading` | Low      |
| `General` (plain text)  | No equivalent                | Falls to `action`                | Low      |
| `New Act`               | `.NEW ACT` (forced heading)  | Parsed as forced `scene_heading` | Medium   |
| `End of Act`            | `.END ACT` (forced heading)  | Parsed as forced `scene_heading` | Medium   |
| `Cast List`             | No equivalent                | Not supported                    | Low      |
| `Image`                 | No equivalent                | Not supported                    | Low      |

### Structural/Metadata Features

| FDX Feature                    | Fountain Equivalent     | Hekaya Status                            | Notes                       |
| ------------------------------ | ----------------------- | ---------------------------------------- | --------------------------- |
| `TitlePage` section            | Title page block        | Supported                                | Bilingual keys              |
| `DualDialogue` wrapper         | `^` on second character | Supported                                |                             |
| `SceneProperties > Summary`    | `[[outline text]]`      | Notes extracted but not linked to scenes | Useful for outlining        |
| `ScriptNote` (with categories) | `[[note]]`              | Basic notes work, no categories          |                             |
| `MoresAndContinueds`           | Not in Fountain         | Not in Hekaya PDF                        | Needed for professional PDF |
| `Revisions` (color-coded)      | Not in Fountain         | Not supported                            | Phase 2 editor feature      |
| `SmartType` autocomplete       | Not in Fountain         | Not supported                            | Phase 2 editor feature      |
| `SceneNumberOptions`           | `#num#` syntax          | `sceneNumber` field supported            |                             |

## FDX Page Layout (Industry Standard)

From the WriterSolo FDX export (`ElementSettings`):

| Element       | Left Indent | Right Indent | Alignment | SpaceBefore | Style             |
| ------------- | ----------- | ------------ | --------- | ----------- | ----------------- |
| Scene Heading | 1.50"       | 7.50"        | Left      | 24pt        | AllCaps           |
| Action        | 1.50"       | 7.50"        | Left      | 12pt        | Normal            |
| Character     | 3.50"       | 7.25"        | Left      | 12pt        | AllCaps           |
| Dialogue      | 2.50"       | 5.94"        | Left      | 0           | Normal            |
| Parenthetical | 3.00"       | 5.50"        | Left      | 0           | Normal            |
| Transition    | 1.50"       | 7.00"        | Right     | 12pt        | AllCaps           |
| Shot          | 1.50"       | 7.50"        | Left      | 24pt        | AllCaps           |
| General       | 1.50"       | 7.50"        | Left      | 0           | Normal            |
| New Act       | 1.00"       | 7.57"        | Center    | 12pt        | AllCaps+Underline |
| End of Act    | 1.50"       | 7.50"        | Center    | 12pt        | AllCaps+Underline |
| Lyrics        | 2.50"       | 5.94"        | Left      | 0           | AllCaps           |
| Cast List     | 1.60"       | 7.50"        | Left      | 0           | AllCaps           |

**Page settings**: US Letter (8.50" x 11.00"), Top/Bottom margins 72pt (1"), Font: Courier Final Draft 12pt.

## WriterSolo Fountain Export Analysis

WriterSolo's Fountain export maps elements as follows:

```
Scene Heading  → INT. PLACE TIME
Action         → Plain paragraph
Character      → UPPERCASE NAME
Dialogue       → Text after character
Parenthetical  → (text) in dialogue
Shot           → .POV SHOT (forced heading)
Transition     → >FADE IN: (forced transition)
General        → Plain paragraph (becomes action)
Notes          → [[text]] (inline notes)
Outline/Summary → [[text]] (indistinguishable from notes)
Lyrics         → ~TEXT
Dual Dialogue  → ^ marker on line
Page Break     → === (not in test file, but standard)
New Act        → .NEW ACT (forced heading)
End of Act     → .END ACT (forced heading)
Section        → # (hash marks)
```

### Loss of Information in Fountain Export

When WriterSolo exports to Fountain, these distinctions are lost:

1. **Shot vs Scene Heading** — both become `.FORCED HEADING`
2. **General vs Action** — both become plain text
3. **New Act / End of Act vs Scene Heading** — all become forced headings
4. **ScriptNote categories** (Important/Information/Suggestion) — all become `[[note]]`
5. **Scene Summary/Outline vs Note** — both become `[[text]]`
6. **Revision tracking** — completely lost
7. **Cast list** — completely lost

## FDX ScriptNote System

FDX supports typed notes attached to specific paragraphs:

```xml
<ScriptNoteDefinitions Active="1">
  <ScriptNoteDefinition Color="#000000" ID="1" Marker="!" Name="Important"/>
  <ScriptNoteDefinition Color="#000000" ID="2" Marker="?" Name="Information"/>
  <ScriptNoteDefinition Color="#000000" ID="3" Marker="*" Name="Suggestion"/>
</ScriptNoteDefinitions>
```

Notes attach to paragraph elements (not inline like Fountain `[[text]]`). In the test FDX export, a ScriptNote is attached to the "General" paragraph containing "Just normal info no action" — the Fountain `[[This is a note]]` was converted to a paragraph-level ScriptNote.

## MoresAndContinueds (Page Break Markers)

Professional screenplays use continuation markers when dialogue or scenes break across pages:

```xml
<MoresAndContinueds>
  <DialogueBreaks
    AutomaticCharacterContinueds="Yes"
    BottomOfPage="Yes"
    DialogueBottom="(MORE)"
    DialogueTop="(CONT'D)"
    TopOfNext="Yes"/>
  <SceneBreaks
    ContinuedNumber="No"
    SceneBottom="(CONTINUED)"
    SceneBottomOfPage="No"
    SceneTop="CONTINUED:"
    SceneTopOfNext="No"/>
</MoresAndContinueds>
```

**Arabic equivalents** needed for Hekaya PDF:

- `(MORE)` → `(تابع)` or `(يتبع)`
- `(CONT'D)` → `(تابع)` or `(تكملة)`
- `(CONTINUED)` → `(يتبع)`
- `CONTINUED:` → `تابع:`

## Import/Export Roadmap

### Phase 1: FDX Import (`hekaya convert script.fdx`)

Parse FDX XML and convert to Hekaya tokens:

- `Scene Heading` → `scene_heading`
- `Action` → `action`
- `Character` → `character` (register in CharacterRegistry)
- `Dialogue` → `dialogue`
- `Parenthetical` → `parenthetical`
- `Transition` → `transition`
- `Shot` → `scene_heading` (forced)
- `General` → `action`
- `Lyrics` → `lyrics`
- `New Act` / `End of Act` → `section` (with depth 1)
- `DualDialogue` → set `dualDialogue: true` on second character
- `TitlePage` → `titleEntries[]`
- `ScriptNote` → `notes[]`

### Phase 1: FDX Export (`hekaya export script.hekaya --format fdx`)

Convert Hekaya tokens to FDX XML:

- All core elements map directly
- Include `ElementSettings` with proper margins (mirrored for RTL)
- Include `TitlePage` section
- Include `MoresAndContinueds` with Arabic markers
- Scene numbers in `SceneNumberOptions`

### Phase 2: Enhanced Features

- Act start/end as distinct Hekaya element types
- ScriptNote categories on notes
- Scene summary/outline metadata linked to scene headings
- Revision tracking in editor
- SmartType autocomplete data

## References

- **Final Draft FDX format**: Proprietary XML, reverse-engineered by community
- **WriterSolo**: https://writersolo.com/ — Free web-based screenwriting tool with FDX export
- **screenplay-tools** (wildwinter): https://github.com/wildwinter/screenplay-tools — Multi-language parser supporting both Fountain and FDX
- **Fountain spec**: https://fountain.io/syntax/
