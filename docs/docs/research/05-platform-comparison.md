---
sidebar_position: 5
title: Platform Comparison
---

# 05 - Platform Comparison: Flutter vs Electron vs Qt

## Context

Hekaya Phase 2 requires a desktop application for macOS and Windows. This document compares platform options for the eventual WYSIWYG editor.

**Note**: Phase 1 is TypeScript-only (parser + CLI). The platform choice for Phase 2 informed the Phase 1 design (e.g., zero-dep parser for easy Dart porting).

## Flutter

### Pros

- **Cross-platform**: macOS, Windows, Linux, iOS, Android, Web from single codebase
- **Performance**: Compiles to native code; ~170 MB memory vs Electron's ~2.2 GB
- **Native feel**: Custom rendering engine (Skia/Impeller) for consistent, smooth UI
- **RTL support**: Built-in via `TextDirection.rtl`, Directionality widget, intl package
- **Text shaping**: Uses HarfBuzz — same engine as Chrome, Firefox, LibreOffice, Android
- **Hot reload**: Fast development iteration
- **Desktop maturity**: Production-ready as of 2025 (SDK 3.26.0+), used by enterprises

### Cons

- **No existing Flutter screenplay editors** — this would be pioneering
- **Rich text editor caveats**: flutter_quill has RTL list bugs; super_editor is newer
- **Arabic diacritics edge cases**: Known Flutter issues (#16886, #54529)
- **Learning curve**: Dart is less common than JavaScript
- **Smaller desktop ecosystem** compared to Electron's web ecosystem

### RTL Assessment

- Native `TextDirection.rtl` support
- `flutter_bidi_text` package for auto-detection
- HarfBuzz handles Arabic letter shaping correctly
- Known issues with diacritics in complex text spans

### Rich Text Editors

| Package         | RTL                 | Maturity | Customization |
| --------------- | ------------------- | -------- | ------------- |
| flutter_quill   | Partial (list bugs) | High     | Good          |
| super_editor    | Yes (has RTL demo)  | Medium   | Excellent     |
| appflowy_editor | Yes                 | High     | Excellent     |

### PDF Generation

- `pdf` package: Recent RTL improvements, Arabic font support
- Syncfusion Flutter PDF: Enterprise-grade, explicit `PdfTextDirection.rightToLeft`
- Ligature support still imperfect in some packages

### Overall Rating for Hekaya: 7.5/10

## Electron

### Pros

- **Mature ecosystem**: Web technologies (HTML/CSS/JS), vast npm library
- **Proven for editors**: VS Code, Atom, Typora built on Electron
- **RTL**: Browser-native `dir="rtl"` support, excellent BiDi
- **Rich text**: Monaco editor, CodeMirror, ProseMirror, Tiptap all available
- **PDF**: Can leverage server-side rendering or Puppeteer for HTML→PDF

### Cons

- **Memory**: ~2.2 GB baseline (Chromium process)
- **Performance**: ~20% slower than native; noticeable on older hardware
- **Bundle size**: 150+ MB minimum
- **"Web app in a wrapper" feel**: Not truly native
- **No mobile path**: Desktop only (separate effort for mobile)

### RTL Assessment

- Excellent — browsers handle BiDi natively
- CSS `direction: rtl` well-supported
- All major text editors (CodeMirror, ProseMirror) have RTL plugins

### Rich Text Editors

| Package      | RTL    | Maturity  | Notes                          |
| ------------ | ------ | --------- | ------------------------------ |
| CodeMirror 6 | Plugin | Very High | Code editor, highly extensible |
| ProseMirror  | Yes    | Very High | Document editor framework      |
| Tiptap       | Yes    | High      | Built on ProseMirror           |
| Monaco       | Plugin | Very High | VS Code's editor               |

### Overall Rating for Hekaya: 6.5/10

(Lower due to memory/performance concerns for a writing app that should feel light)

## Qt (C++)

### Pros

- **Proven**: Scrite (screenplay editor) uses Qt successfully
- **Native performance**: Compiled C++
- **Excellent RTL**: Qt has mature Arabic/RTL support (used in KDE on Arabic systems)
- **Cross-platform**: Windows, macOS, Linux
- **Rich text**: QTextEdit, QML TextArea are powerful

### Cons

- **C++ complexity**: Harder to maintain, slower development
- **Licensing**: Qt open-source (LGPL/GPL) has conditions
- **Smaller contributor pool**: C++/Qt developers harder to find
- **No mobile path** without significant effort
- **Build system complexity**: CMake, Qt Creator dependency

### Overall Rating for Hekaya: 7.0/10

## Comparison Matrix

| Factor               | Flutter           | Electron          | Qt               |
| -------------------- | ----------------- | ----------------- | ---------------- |
| Performance          | Excellent         | Poor              | Excellent        |
| Memory usage         | Low (~170MB)      | High (~2.2GB)     | Low              |
| RTL/Arabic           | Good (7/10)       | Excellent (9/10)  | Excellent (9/10) |
| Rich text editors    | Medium (6/10)     | Excellent (9/10)  | Good (7/10)      |
| Cross-platform       | All (6 platforms) | Desktop + Web     | Desktop          |
| Developer experience | Good (hot reload) | Great (web tools) | Moderate         |
| Bundle size          | Medium (~50MB)    | Large (~150MB+)   | Small (~30MB)    |
| Ecosystem            | Growing           | Massive           | Moderate         |
| Future mobile        | Built-in          | Separate effort   | Separate effort  |
| PDF generation       | Good              | Good              | Good             |

## Decision: Flutter

**Rationale**:

1. **Multi-platform**: macOS + Windows + future mobile from one codebase
2. **Performance**: Writing apps should feel light and responsive; Electron's overhead is excessive
3. **Arabic text shaping**: HarfBuzz (used by Flutter) is the gold standard
4. **TypeScript → Dart porting**: TypeScript and Dart have similar type systems; parser ports cleanly
5. **Growing desktop maturity**: Flutter desktop is production-ready and improving rapidly
6. **User preference**: User expressed interest in Flutter specifically

**Risks to mitigate**:

- Rich text editor: Evaluate super_editor early; prototype screenplay-specific formatting
- Diacritics: Test thoroughly with Arabic text containing tashkeel
- PDF: Use Syncfusion Flutter PDF for best RTL results

## References

- [Flutter Desktop Documentation](https://docs.flutter.dev/platform-integration/desktop)
- [Flutter vs Electron Performance (Stream)](https://getstream.io/blog/flutter-desktop-vs-electron/)
- [Flutter vs Electron (Pieces)](https://pieces.app/blog/flutter-vs-electron-whats-the-difference)
- [Flutter vs Electron (CodeMagic)](https://blog.codemagic.io/flutter-vs-electron/)
- [Flutter Desktop 2026 Guide](https://dasroot.net/posts/2026/02/flutter-desktop-applications-windows-macos-linux/)
- [Scrite (Qt screenplay editor)](https://www.scrite.io/) | [GitHub](https://github.com/teriflix/scrite)
- [super_editor](https://pub.dev/packages/super_editor) | [GitHub](https://github.com/Flutter-Bounty-Hunters/super_editor)
- [flutter_quill](https://pub.dev/packages/flutter_quill) | [GitHub](https://github.com/singerdmx/flutter-quill)
- [appflowy_editor](https://pub.dev/packages/appflowy_editor) | [GitHub](https://github.com/AppFlowy-IO/appflowy-editor)
