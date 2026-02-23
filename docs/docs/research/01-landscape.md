---
sidebar_position: 1
title: Market & Tool Landscape
---

# 01 - Market & Tool Landscape

## The Problem

Egyptian and Arabic-speaking screenwriters lack adequate tooling. The dominant screenplay writing tools (Final Draft, Highland, WriterSolo) are English-first. While some tools offer partial RTL support, none provide a native experience for screenwriters writing in Arabic.

## Existing Screenplay Writing Tools

### Commercial Tools with Arabic Support

| Tool              | Arabic/RTL | Platforms      | Notes                                                                            |
| ----------------- | ---------- | -------------- | -------------------------------------------------------------------------------- |
| **StudioBinder**  | Partial    | Web            | Excellent autocomplete for English. Limited RTL.                                 |
| **WriterDuet**    | Yes        | Web            | RTL screenplay template available. Supports 20+ languages.                       |
| **TwelvePoint**   | Yes        | macOS, iOS     | Full RTL/LTR support. UI adapts to writing language.                             |
| **Final Draft**   | No         | macOS, Windows | Industry standard for English. No Arabic support.                                |
| **Highland**      | No         | macOS          | Beautiful Fountain editor. English only.                                         |
| **Fade In**       | Partial    | Cross-platform | Some international support.                                                      |
| **Dramatify**     | Yes        | Web            | Arabic/Farsi support. Bold replaces uppercase for Arabic. RTL button in toolbar. |
| **Script Studio** | Yes        | Unknown        | Supports Hebrew, Arabic, Persian, Urdu RTL scripts.                              |

### Open-Source Screenplay Editors

| Tool                        | Language   | Platform      | Fountain | Status                                                       |
| --------------------------- | ---------- | ------------- | -------- | ------------------------------------------------------------ |
| **Beat**                    | Swift/ObjC | macOS, iOS    | Yes      | Active. Has autocomplete, plugin system. GPL.                |
| **Scrite**                  | C++/Qt     | Win/Mac/Linux | No       | Active. Multilingual (English + 10 Indian languages). GPLv3. |
| **Story Architect (Starc)** | C++        | All platforms | Import   | Active. Successor to KIT Scenarist. Open core.               |
| **Trelby**                  | Python     | Win/Linux     | Yes      | Semi-active. 200k+ name database for autocomplete. GPL.      |
| **Afterwriting**            | JavaScript | Web + CLI     | Yes      | Semi-active. PDF generation, character analysis.             |
| **BetterFountain**          | TypeScript | VS Code       | Yes      | Active VS Code extension.                                    |

### Defunct Arabic-Specific Tools

**Seyaq/Miktab** (seyaq.org — archived July 2023)

- The only known dedicated Arabic screenplay markup language
- "Seyaq" = markup language (like Fountain), "Miktab" = the editor (like Highland)
- Created an open plain-text syntax specifically for Arabic screenwriters
- Philosophy: write in any text editor, format later
- No longer available — website archived, software unavailable
- Hekaya aims to fill this exact gap

## Why Fork Fountain's Approach (Not Existing Editors)

1. **Beat** — macOS-only (Swift/ObjC). Can't target Windows. Great reference for autocomplete UX.
2. **Scrite** — Qt/C++. Cross-platform but no Fountain support. Multilingual approach is instructive.
3. **Trelby** — Python. Good autocomplete database but dated codebase.
4. **Afterwriting** — JavaScript/web. Fountain support but no RTL.
5. **None have Arabic-first design** — all treat Arabic as a secondary language if at all.

The Fountain plain-text specification is the right foundation because:

- It's an open standard, not tied to any specific editor
- It separates content from presentation (like Seyaq)
- It has a proven ecosystem of parsers in many languages
- Extending it is simpler than building a new format from scratch
- Backward compatibility means existing Fountain scripts still work

## StudioBinder Autocomplete Analysis

StudioBinder's autocomplete (referenced by user as ideal UX):

- Auto-applies industry-standard formatting as you type
- Autocomplete for scene headings (INT./EXT., locations, times of day)
- Character name suggestions based on previously used names
- Transition suggestions (CUT TO:, DISSOLVE TO:, etc.)
- Context-aware: knows when to suggest a character vs. a scene heading based on cursor position
- Fast, inline suggestions that don't interrupt writing flow

Hekaya's autocomplete (Phase 2 Flutter app) should replicate this with:

- Arabic scene heading keyword suggestions (داخلي، خارجي)
- Character names from the Character Registry
- Arabic transition keywords
- Location suggestions from previously used locations
- Time of day suggestions (نهار، ليل، غروب، فجر)

## References

- [StudioBinder Screenwriting Software](https://www.studiobinder.com/screenwriting-software/)
- [Beat App](https://www.beat-app.fi/) | [GitHub](https://github.com/lmparppei/Beat)
- [Scrite](https://www.scrite.io/) | [GitHub](https://github.com/teriflix/scrite)
- [Story Architect](https://starc.app/) | [GitHub](https://github.com/story-apps/starc)
- [Trelby](https://trelby.org/) | [GitHub](https://github.com/trelby/trelby)
- [Afterwriting](https://afterwriting.com/) | [GitHub](https://github.com/ifrost/afterwriting-labs)
- [BetterFountain](https://github.com/piersdeseilligny/betterfountain)
- [WriterDuet RTL Template](https://www.writerduet.com/article/418-right-to-left-screenplay-template)
- [TwelvePoint Arabic FAQ](https://www.twelvept.com/faq/en/questions/FAQ009-arabic-screenwriting.html)
- [Dramatify Arabic Support](https://dramatify.com/now-supporting-scripts-screenplays-in-arabic-farsi)
