# @hekaya/parser

Arabic-first screenplay markup parser implementing the [Hekaya](https://github.com/michaelkmalak/hekaya) specification. Extends Fountain for RTL languages.

## Install

```bash
npm install @hekaya/parser
```

## Usage

```typescript
import { Hekaya } from '@hekaya/parser';

const script = Hekaya.parse(`العنوان: آخر أيام الصيف
سيناريو: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

سمير قاعد لوحده في ركن القهوة.

@سمير
(بهدوء)
قهوة سادة، لو سمحت.

- قطع -

خارجي - شارع وسط البلد - ليل`);

console.log(script.direction); // 'rtl'
console.log(script.tokens.length); // 10
console.log(script.characters); // ['سمير']
```

### Parse options

```typescript
const script = Hekaya.parse(input, {
  defaultDirection: 'rtl', // 'rtl' | 'ltr' | 'auto' (default: 'auto')
  enableCharacterRegistry: true, // auto-detect character names (default: true)
  includeNotes: false, // keep [[notes]] as tokens (default: false)
});
```

### Serialize back to text

```typescript
import { serialize } from '@hekaya/parser';

const text = serialize(script);
// Produces valid Hekaya/Fountain plain text from parsed tokens
```

### Character Registry

The parser auto-detects character names after they're introduced with `@`:

```typescript
const script = Hekaya.parse(`
@سمير
أهلاً يا نادية.

سمير
أنا رايح القهوة.
`);

// Both lines are detected as character elements
// because @سمير registered the name on first use
console.log(script.characters); // ['سمير']
```

### Bidirectional text utilities

```typescript
import { detectDirection, containsArabic } from '@hekaya/parser';

detectDirection('سمير'); // 'rtl'
detectDirection('Hello'); // 'ltr'
containsArabic('سمير says'); // true
```

## Token types

`scene_heading`, `action`, `character`, `dialogue`, `parenthetical`, `transition`, `centered`, `page_break`, `section`, `synopsis`, `note_inline`, `boneyard`, `lyrics`, `blank`

## License

MIT
