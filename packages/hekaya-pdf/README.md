# @hekaya/pdf

PDF generator for [Hekaya](https://github.com/michaelkmalak/hekaya) screenplays with Arabic/RTL support. Produces industry-standard screenplay PDFs on A4 paper.

## Install

```bash
npm install @hekaya/pdf
```

## Usage

```typescript
import { Hekaya } from '@hekaya/parser';
import { generatePdf } from '@hekaya/pdf';
import { writeFileSync } from 'node:fs';

const script = Hekaya.parse(`العنوان: آخر أيام الصيف
سيناريو: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

سمير قاعد لوحده في ركن القهوة.

@سمير
(بهدوء)
قهوة سادة، لو سمحت.

- قطع -`);

const pdf = await generatePdf(script);
writeFileSync('screenplay.pdf', pdf);
```

### Options

```typescript
const pdf = await generatePdf(script, {
  includeTitlePage: true, // include title page (default: true)
  includeMetaElements: false, // include sections/synopses (default: false)
  includeNotes: false, // include [[notes]] in output (default: false)
  fontsDir: '/path/to/fonts', // custom fonts directory (optional)
});
```

### Including notes in working drafts

```typescript
const script = Hekaya.parse(input, { includeNotes: true });
const pdf = await generatePdf(script, { includeNotes: true });
// Notes render in italic gray text: [note content]
```

## Features

- A4 page size with standard screenplay margins
- RTL-aware layout (binding margin on right for Arabic)
- Arabic fonts: Cascadia Mono (bundled)
- English fonts: Courier (bundled)
- Title page with centered title, author, metadata
- Scene heading 3-column layout (type - location - time of day)
- Dual dialogue columns
- Inline formatting (bold, italic, underline)
- Page numbers (Arabic-Indic numerals for RTL)

## License

MIT
