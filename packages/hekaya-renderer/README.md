# @hekaya/renderer

HTML renderer for [Hekaya](https://github.com/michaelkmalak/hekaya) screenplay markup with full RTL support.

## Install

```bash
npm install @hekaya/renderer
```

## Usage

```typescript
import { Hekaya } from '@hekaya/parser';
import { render } from '@hekaya/renderer';

const script = Hekaya.parse(`العنوان: آخر أيام الصيف
سيناريو: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

@سمير
(بهدوء)
قهوة سادة، لو سمحت.`);

const html = render(script);
// Returns a complete HTML document with RTL-aware CSS
```

### Options

```typescript
const html = render(script, {
  includeMetaElements: true, // include sections/synopses (default: false)
});
```

### Standalone stylesheet

```typescript
import { getStylesheet } from '@hekaya/renderer';

const css = getStylesheet();
// Returns the screenplay CSS as a string
```

## Output

Generates a standalone HTML document with:

- RTL/LTR direction based on script content
- Screenplay-formatted elements (scene headings, dialogue, transitions, etc.)
- Inline formatting (bold, italic, underline)
- Title page rendering
- Dual dialogue columns

## License

MIT
