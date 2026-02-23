---
sidebar_position: 6
title: PDF Generation Research
---

# 06 - PDF Generation Research

## Standard Screenplay Format

### Page Dimensions

- US Letter: 8.5" x 11" (215.9mm x 279.4mm)
- A4 also acceptable for international markets

### Margins (English/LTR)

- Left: 1.5" (for binding with brads)
- Right: 1.0"
- Top: 1.0"
- Bottom: 0.5" - 1.0"

### Margins (Arabic/RTL — Mirrored)

- Right: 1.5" (binding side — Arabic books/scripts bind on right)
- Left: 1.0"
- Top: 1.0"
- Bottom: 0.5" - 1.0"

### Element Positioning (English)

| Element        | Left Margin | Right Margin | Alignment               |
| -------------- | ----------- | ------------ | ----------------------- |
| Scene Heading  | 1.5"        | 1.0"         | Left                    |
| Action         | 1.5"        | 1.0"         | Left, justified         |
| Character Name | 3.7"        | 1.0"         | Left (appears centered) |
| Parenthetical  | 3.1"        | 2.0"         | Left                    |
| Dialogue       | 2.5"        | 2.5"         | Left                    |
| Transition     | 1.5"        | 1.0"         | Right                   |

### Element Positioning (Arabic — Mirrored)

| Element        | Right Margin | Left Margin | Alignment                |
| -------------- | ------------ | ----------- | ------------------------ |
| Scene Heading  | 1.5"         | 1.0"        | Right                    |
| Action         | 1.5"         | 1.0"        | Right, justified         |
| Character Name | 3.7"         | 1.0"        | Right (appears centered) |
| Parenthetical  | 3.1"         | 2.0"        | Right                    |
| Dialogue       | 2.5"         | 2.5"        | Right                    |
| Transition     | 1.5"         | 1.0"        | Left                     |

### Font

- English standard: Courier 12pt (monospaced)
- Arabic: No standard exists. Recommendations below.

### Spacing

- Scene heading: preceded by 2 blank lines (first scene after title page: 0)
- Between elements: 1 blank line
- Dialogue after character: 0 blank lines
- Parenthetical: 0 blank lines
- Page numbers: top right (English) or top left (Arabic), starting from page 2

### Formatting

| Element        | English                      | Arabic            |
| -------------- | ---------------------------- | ----------------- |
| Scene Heading  | UPPERCASE, bold or underline | Bold, underline   |
| Character Name | UPPERCASE                    | Bold              |
| Transition     | UPPERCASE                    | Bold              |
| Action         | Normal                       | Normal            |
| Dialogue       | Normal                       | Normal            |
| Parenthetical  | Normal, in parens            | Normal, in parens |

## Node.js PDF Libraries

### pdfmake-rtl / @digicole/pdfmake-rtl (RECOMMENDED)

**Why**: Purpose-built for RTL content, drop-in replacement for pdfmake.

Features:

- Automatic RTL detection — no manual configuration
- Smart table column reversal
- Unicode script detection
- Automatic font selection for different scripts
- Proper text alignment for RTL
- List bullet positioning for RTL
- Mixed content support (LTR + RTL in same document)
- 100% pdfmake API compatible

Usage:

```javascript
import pdfMake from '@digicole/pdfmake-rtl';

const docDefinition = {
  content: [
    { text: 'داخلي. مقهى - نهار', style: 'sceneHeading' },
    { text: 'فهد يجلس وحيداً', style: 'action' },
  ],
  defaultStyle: {
    font: 'Cairo',
    alignment: 'right',
  },
  styles: {
    sceneHeading: { bold: true, decoration: 'underline' },
    action: {
      /* default */
    },
  },
};
```

### pdfmake (base)

- General purpose PDF generation
- No built-in RTL support
- Large community, well-documented
- npm: https://www.npmjs.com/package/pdfmake

### jsPDF

- Partial RTL via BiDi algorithm
- Works for Arabic-only content
- Limited with mixed-language documents
- npm: https://www.npmjs.com/package/jspdf

### PDFKit

- NO RTL support — not suitable for Arabic

### pdf-lib

- Create/modify PDFs with JavaScript
- No RTL support — not suitable

## Arabic Fonts for PDF

### Recommended Fonts

**Cairo** (Google Fonts)

- Style: Modern sans-serif
- Weights: 200-1000 (ExtraLight to Black)
- Good for: Action text, dialogue
- License: SIL Open Font License
- URL: https://fonts.google.com/specimen/Cairo

**Noto Naskh Arabic** (Google Fonts)

- Style: Traditional naskh
- Weights: 400, 500, 600, 700
- Good for: Body text, formal scripts
- License: SIL Open Font License
- URL: https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic

**Scheherazade New** (SIL)

- Style: Calligraphic naskh
- Good for: Title pages, decorative text
- License: SIL Open Font License

**Amiri** (Google Fonts)

- Style: High-quality naskh
- Good for: Formal, traditional scripts
- License: SIL Open Font License
- URL: https://fonts.google.com/specimen/Amiri

**IBM Plex Arabic** (Google Fonts)

- Style: Modern, clean
- Has IBM Plex Mono for mixed-language monospaced needs
- License: SIL Open Font License
- URL: https://fonts.google.com/specimen/IBM+Plex+Sans+Arabic

### Font Embedding Strategy

1. Fonts NOT committed to git (binary files, downloaded at build time)
2. Build script downloads from Google Fonts API
3. Embedded in PDF for consistent rendering
4. User can configure font in CLI: `hekaya export --font cairo`

### The Monospaced Problem

English screenplays use Courier 12pt. The monospaced font ensures:

- ~55 lines per page
- ~1 minute of screen time per page

Arabic has no standard monospaced screenplay font. Options:

1. Use proportional font (Cairo/Noto) with calibrated font size
2. Document that page count ≈ screen time ratio differs
3. Provide a "timing calibration" option in the CLI

## Flutter PDF (Phase 2)

### pdf package (dart)

- Pure Dart PDF generation
- Recent RTL improvements
- Arabic font support via TTF embedding
- npm equivalent of pdfmake

### Syncfusion Flutter PDF

- Enterprise-grade
- `PdfTextDirection.rightToLeft` explicit support
- Tested with Arabic, Hebrew, Persian, Urdu
- TrueType font embedding

### Recommendation for Flutter Phase

Use Syncfusion Flutter PDF for best RTL results. The `pdf` package is improving but Syncfusion has more mature Arabic support.

## References

- [Screenplay Format Guide - Final Draft](https://www.finaldraft.com/learn/how-to-format-a-screenplay/)
- [Screenplay Format Guide - Scribophile](https://www.scribophile.com/academy/how-to-format-a-screenplay)
- [Screenplay Format Guide - MasterClass](https://www.masterclass.com/articles/what-is-screenplay-formatting-tips-and-tricks)
- [pdfmake-rtl GitHub](https://github.com/aysnet1/pdfmake-rtl)
- [@digicole/pdfmake-rtl npm](https://www.npmjs.com/package/@digicole/pdfmake-rtl)
- [pdfmake Documentation](https://pdfmake.github.io/docs/)
- [Flutter PDF Creation with Arabic](https://medium.com/@aboayman27x1/flutter-pdf-creation-with-arabic-context-fff4b89f5d4d)
- [Print Arabic PDFs with Flutter](https://medium.com/@wellroundedappdev/print-arabic-pdfs-with-flutter-0e7fc11c9ac9)
- [Syncfusion Flutter PDF Text Drawing](https://help.syncfusion.com/flutter/pdf/working-with-text)
- [Google Fonts - Cairo](https://fonts.google.com/specimen/Cairo)
- [Google Fonts - Noto Naskh Arabic](https://fonts.google.com/noto/specimen/Noto+Naskh+Arabic)
