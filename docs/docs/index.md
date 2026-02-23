---
sidebar_position: 1
title: Overview
---

# Hekaya (حكاية)

Hekaya is a screenplay markup language and toolchain built for Egyptian and Arabic-speaking screenwriters. It extends the [Fountain](https://fountain.io/) specification with native RTL (right-to-left) support.

Hekaya was created for the [Cairo Indie Filmmakers Club](https://cairoindie.com/) to standardize Arabic screenwriting and make it easier to write, share, and export screenplays in a standard PDF format.

## What Problem Does Hekaya Solve?

Egyptian and Arabic-speaking screenwriters have no open-source, dedicated tool for writing screenplays in Arabic. Existing tools (Final Draft, Highland, StudioBinder) are English-first. The defunct Seyaq/Miktab project proved demand exists but left a gap when it went offline in 2023.

Hekaya fills this gap with:

- A **plain-text markup language** that feels natural for writing in Egyptian dialect and formal Arabic
- A **parser** that understands Arabic screenplay elements (scene headings, character names, dialogue, transitions)
- **PDF export** in standard screenplay format with proper RTL layout
- Full **backward compatibility** with standard Fountain files

## Quick Example

```
العنوان: آخر أيام الصيف
المؤلف: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

سمير قاعد لوحده في ركن القهوة، بيبص على فنجان القهوة اللي قدامه.

@سمير
(بهدوء)
قهوة سادة، لو سمحت.

@نادية
مكنتش عارفة إنك هنا.

@سمير
ولا أنا كنت ناوي أجي.

- قطع -
```

## Try It

Download a pre-built binary from the [Releases page](https://github.com/michaelkmalak/hekaya/releases) — no installation needed, just [Node.js](https://nodejs.org/) 20+:

```bash
# Download the binary for your platform (example: macOS ARM)
curl -LO https://github.com/michaelkmalak/hekaya/releases/latest/download/hekaya-macos-arm64.cjs

# Run it
node hekaya-macos-arm64.cjs render script.hekaya -o script.html
node hekaya-macos-arm64.cjs export script.hekaya -o script.pdf
```

Or build from source:

```bash
git clone https://github.com/michaelkmalak/hekaya.git
cd hekaya
pnpm install && pnpm build
node apps/hekaya-cli/dist/index.js render script.hekaya -o script.html
```

## Packages

| Package            | Description                                    |
| ------------------ | ---------------------------------------------- |
| `@hekaya/parser`   | Core markup parser (zero runtime dependencies) |
| `@hekaya/renderer` | HTML renderer with RTL-aware screenplay CSS    |
| `@hekaya/pdf`      | PDF generator with proper font support         |
| `@hekaya/cli`      | Command-line tool                              |

## Documentation

- [Hekaya Markup Specification](spec/hekaya-markup-spec) — full element-by-element specification
- [Fountain Compatibility](spec/fountain-compatibility) — how Hekaya relates to Fountain
- [Architecture](architecture) — system design and package structure
- [Research](research/landscape) — market analysis, technical research, and references

## Roadmap

### `.hekaya` Extension Registration

To establish `.hekaya` as a recognized file extension:

- [ ] **VS Code Extension** — Create a language extension with syntax highlighting, snippets, and autocomplete
- [ ] **npm Packages** — Publish `@hekaya/parser`, `@hekaya/renderer`, `@hekaya/pdf`, `@hekaya/cli`
- [ ] **GitHub Linguist** — Add `.hekaya` to [github-linguist](https://github.com/github/linguist) for GitHub syntax highlighting
- [ ] **IANA Media Type** — Register `text/x-hekaya` via [IANA](https://www.iana.org/form/media-types)
- [ ] **Domain & Website** — Launch hekaya.com with documentation and playground

### Phase 2: Desktop App

- [ ] Port parser to Dart (zero-dep design enables this)
- [ ] Flutter desktop app (macOS + Windows) with WYSIWYG editor
- [ ] StudioBinder-style autocomplete for character names, scene headings, and transitions
- [ ] Real-time preview pane
