**[اقرأ بالعربي](README.ar.md)**

# Hekaya (حكاية)

[![CI](https://github.com/michaelkmalak/hekaya/actions/workflows/ci.yml/badge.svg)](https://github.com/michaelkmalak/hekaya/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/michaelkmalak/hekaya)](https://github.com/michaelkmalak/hekaya/releases)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A screenplay markup language and toolchain built for Egyptian and Arabic-speaking screenwriters.

Hekaya extends the [Fountain](https://fountain.io/) specification with native support for RTL (right-to-left) text, enabling screenwriters across Egypt and the Arab world to write professionally formatted screenplays in plain text.

Hekaya was created for the [Cairo Indie Filmmakers Club](https://cairoindie.com/) to standardize Arabic screenwriting and make it easier to write, share, and export screenplays in a standard PDF format.

## What is Hekaya?

Hekaya is to Egyptian and Arabic-speaking screenwriters what Fountain is to English screenwriters: a simple, plain-text markup language that lets you write screenplays in any text editor. The syntax feels natural for writing in Egyptian dialect and formal Arabic while remaining fully backward-compatible with standard Fountain files.

<pre dir="rtl">
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
</pre>

## Packages

| Package            | Description                                 |
| ------------------ | ------------------------------------------- |
| `@hekaya/parser`   | Core markup parser (zero dependencies)      |
| `@hekaya/renderer` | HTML renderer with RTL-aware screenplay CSS |
| `@hekaya/pdf`      | PDF generator with proper font support      |
| `@hekaya/cli`      | Command-line tool                           |

## Quick Start

```bash
# Parse a Hekaya file
hekaya parse script.hekaya --format json

# Render to HTML
hekaya render script.hekaya -o script.html

# Export to PDF
hekaya export script.hekaya -o script.pdf

# Validate
hekaya validate script.hekaya
```

## Samples

The [`samples/`](samples/) directory contains complete `.hekaya` screenplays:

| File                                                         | Description                                                        |
| ------------------------------------------------------------ | ------------------------------------------------------------------ |
| [`آخر-أيام-الصيف.hekaya`](samples/آخر-أيام-الصيف.hekaya)     | Drama — a writer rediscovering hope in Cairo                       |
| [`بكرا-السما-ح-تقع.hekaya`](samples/بكرا-السما-ح-تقع.hekaya) | Comedy — a satirical tale of misinformation spreading across Cairo |

## Documentation

- [Hekaya Markup Specification](docs/spec/hekaya-markup-spec.md)
- [Fountain Compatibility](docs/spec/fountain-compatibility.md)
- [Architecture](docs/architecture.md)
- [Research & References](docs/research/)

## Roadmap

### `.hekaya` Extension Registration

To establish `.hekaya` as a recognized file extension:

- [ ] **VS Code Extension** — Create a VS Code language extension providing syntax highlighting, snippets, and autocomplete for `.hekaya` files
- [ ] **npm Packages** — Publish `@hekaya/parser`, `@hekaya/renderer`, `@hekaya/pdf`, `@hekaya/cli` to npm
- [ ] **GitHub Linguist** — Submit a PR to [github-linguist](https://github.com/github/linguist) to add `.hekaya` as a recognized language for syntax highlighting on GitHub
- [ ] **IANA Media Type** — Register `text/x-hekaya` as a media type via [IANA](https://www.iana.org/form/media-types)
- [ ] **Domain & Website** — Launch hekaya.com with documentation, playground, and download links

### Phase 2: Desktop & Web App

- [ ] Port parser to Dart (zero-dep design enables this)
- [ ] Flutter desktop app (macOS + Windows) with WYSIWYG editor
- [ ] StudioBinder-style autocomplete for character names, scene headings, and transitions
- [ ] Real-time preview pane
- [ ] **app.hekaya.com** — Web-based screenplay editor (Flutter web app)

### Website

- [ ] **hekaya.com** — Landing page with documentation, download links, and getting started guide

## Development

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Watch mode
pnpm test:watch
```

## License

MIT
