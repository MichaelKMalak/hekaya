**[اقرأ بالعربي](README.ar.md)**

# Hekaya (حكاية)

[![CI](https://github.com/michaelkmalak/hekaya/actions/workflows/ci.yml/badge.svg)](https://github.com/michaelkmalak/hekaya/actions/workflows/ci.yml)
[![Release](https://img.shields.io/github/v/release/michaelkmalak/hekaya)](https://github.com/michaelkmalak/hekaya/releases)
[![codecov](https://codecov.io/github/MichaelKMalak/hekaya/graph/badge.svg?token=N3MGEDYDKY)](https://codecov.io/github/MichaelKMalak/hekaya)
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

| Package            | Description                                 | Coverage                                                                                                                                                     |
| ------------------ | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@hekaya/parser`   | Core markup parser (zero dependencies)      | [![parser](https://codecov.io/github/MichaelKMalak/hekaya/graph/badge.svg?token=N3MGEDYDKY&flag=parser)](https://codecov.io/github/MichaelKMalak/hekaya)     |
| `@hekaya/renderer` | HTML renderer with RTL-aware screenplay CSS | [![renderer](https://codecov.io/github/MichaelKMalak/hekaya/graph/badge.svg?token=N3MGEDYDKY&flag=renderer)](https://codecov.io/github/MichaelKMalak/hekaya) |
| `@hekaya/pdf`      | PDF generator with proper font support      | [![pdf](https://codecov.io/github/MichaelKMalak/hekaya/graph/badge.svg?token=N3MGEDYDKY&flag=pdf)](https://codecov.io/github/MichaelKMalak/hekaya)           |
| `@hekaya/cli`      | Command-line tool                           | [![cli](https://codecov.io/github/MichaelKMalak/hekaya/graph/badge.svg?token=N3MGEDYDKY&flag=cli)](https://codecov.io/github/MichaelKMalak/hekaya)           |

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

Full sample screenplays are available on the [documentation site](https://michaelkmalak.github.io/hekaya/docs/examples/full-drama) for best RTL readability:

| Sample                                                                               | Description                                                        |
| ------------------------------------------------------------------------------------ | ------------------------------------------------------------------ |
| [آخر أيام الصيف](https://michaelkmalak.github.io/hekaya/docs/examples/full-drama)    | Drama — a writer rediscovering hope in Cairo                       |
| [بكرا السما ح تقع](https://michaelkmalak.github.io/hekaya/docs/examples/full-comedy) | Comedy — a satirical tale of misinformation spreading across Cairo |

## Documentation

- [Hekaya Markup Specification](https://michaelkmalak.github.io/hekaya/docs/spec/hekaya-markup-spec)
- [Fountain Compatibility](https://michaelkmalak.github.io/hekaya/docs/spec/fountain-compatibility)
- [Architecture](https://michaelkmalak.github.io/hekaya/docs/architecture)
- [Research & References](https://michaelkmalak.github.io/hekaya/docs/research/references)

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
