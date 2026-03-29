# مرجع — Reference

## Complete Element Type Reference

### Element Detection Priority

The parser detects elements in this order:

1. **Title Page** — Key-value pairs at top of file, before first blank line
2. **Boneyard/Comment** — `/* ... */`
3. **Page Break** — `===` (3+ equals signs)
4. **Section** — `#`, `##`, `###`, etc.
5. **Synopsis** — `= text`
6. **Scene Heading** — Arabic/English keywords or forced with `.`
7. **Transition** — Arabic keywords or forced with `>`
8. **Character** — `@name` or auto-detected registered name
9. **Parenthetical** — `(text)` on its own line inside dialogue
10. **Dialogue** — Text following a character element
11. **Lyrics** — `~text`
12. **Centered** — `>text<`
13. **Note** — `[[text]]`
14. **Action** — Everything else (default)

---

## Arabic Keywords — Complete List

### Scene Headings

| Arabic       | English | Notes             |
| ------------ | ------- | ----------------- |
| داخلي        | INT     | Interior          |
| خارجي        | EXT     | Exterior          |
| لقطة تأسيسية | EST     | Establishing shot |
| داخلي/خارجي  | INT/EXT | Interior/Exterior |
| خارجي/داخلي  | EXT/INT | Exterior/Interior |
| د/خ          | I/E     | Abbreviation      |

### Time of Day

| Arabic      | English      |
| ----------- | ------------ |
| نهار        | Day          |
| ليل         | Night        |
| صباح        | Morning      |
| مساء        | Evening      |
| غروب        | Sunset       |
| شروق        | Sunrise      |
| فجر         | Dawn         |
| ظهر         | Noon         |
| عصر         | Afternoon    |
| منتصف الليل | Midnight     |
| قبل الفجر   | Before dawn  |
| بعد الغروب  | After sunset |

### Title Page Keys

| Arabic        | English Equivalent | Maps To    |
| ------------- | ------------------ | ---------- |
| العنوان       | Title              | title      |
| سيناريو       | Author             | author     |
| كتابة         | Author             | author     |
| تأليف         | Author             | author     |
| المصدر        | Source             | source     |
| مسودة         | Draft              | draft      |
| تاريخ المسودة | Draft date         | draft date |
| تاريخ         | Date               | date       |
| تواصل         | Contact            | contact    |
| حقوق النشر    | Copyright          | copyright  |
| ملاحظات       | Notes              | notes      |

### Character Extensions

| Arabic             | English | Abbreviation |
| ------------------ | ------- | ------------ |
| صوت من خارج المشهد | V.O.    | ص.خ          |
| خارج الشاشة        | O.S.    | خ.ش          |
| خارج الكادر        | O.C.    | —            |
| تابع               | CONT'D  | —            |

### Transitions — Complete List

| Arabic         | English        |
| -------------- | -------------- |
| قطع            | CUT TO         |
| قطع إلى        | CUT TO         |
| قطع مباشر      | CUT TO         |
| قطع مفاجئ      | SMASH CUT TO   |
| قطع متطابق     | MATCH CUT TO   |
| قطع قافز       | JUMP CUT TO    |
| اختفاء تدريجي  | FADE OUT       |
| ظهور تدريجي    | FADE IN        |
| مزج            | DISSOLVE TO    |
| ذوبان          | DISSOLVE TO    |
| تلاشي          | FADE           |
| تلاشي إلى أسود | FADE TO BLACK  |
| تلاشي إلى أبيض | FADE TO WHITE  |
| تلاشي متقاطع   | CROSS FADE     |
| مسح            | WIPE TO        |
| تجميد الكادر   | FREEZE FRAME   |
| شاشة منقسمة    | SPLIT SCREEN   |
| شاشة سوداء     | SMASH TO BLACK |
| قطع على صوت    | SOUND CUT      |
| قطع على فعل    | ACTION CUT     |
| تأسيس          | ESTABLISHING   |
| بداية مشهد     | BEGIN          |
| نهاية المشهد   | END OF SCENE   |
| نهاية الفصل    | END OF ACT     |
| نهاية          | THE END        |
| البداية        | THE BEGINNING  |

---

## Separator Styles

### Recommended: Dash Style

```
داخلي - قهوة بلدي - نهار
```

### Accepted: Period Style (backward compatibility)

```
داخلي. قهوة بلدي - نهار
```

**The dash style is preferred** — it's more natural in Arabic and matches real Egyptian production scripts.

---

## Character Registry Behavior

### Registration

```
@سمير          ← registers "سمير"
```

### Auto-Detection (after registration)

```
سمير            ← auto-detected as character (if followed by dialogue)
```

### Alef Normalization

The registry treats these as equivalent:

- `أ` (alef with hamza above)
- `إ` (alef with hamza below)
- `آ` (alef with madda)
- `ا` (bare alef)

So `@أحمد` and `احمد` will match.

### Diacritics

Arabic diacritics (حركات/تشكيل) are handled — `سَمِير` matches `سمير`.

---

## Force Prefixes

| Prefix  | Forces Element As | Example              |
| ------- | ----------------- | -------------------- |
| `.`     | Scene Heading     | `.المشهد الخاص`      |
| `@`     | Character         | `@سمير`              |
| `!`     | Action            | `!سمير بيتكلم لوحده` |
| `>`     | Transition        | `>أي نص`             |
| `~`     | Lyrics            | `~يا ليل يا عين`     |
| `>...<` | Centered          | `>النهاية<`          |

---

## Emphasis Escaping

Use backslash to escape emphasis markers:

```
سمير بيقول \*مش عايز\* بس مش بجد.
```

Output: سمير بيقول _مش عايز_ (literal asterisks, no italic)

---

## Multi-line Title Page Values

Indent continuation lines with spaces or tabs:

```
تواصل:
    نادية حسن
    nadia@example.com
    ٠١٠٠٠٠٠٠٠٠٠
```

---

## Text Direction

### Auto-Detection

The parser detects text direction from content. Majority Arabic = RTL. Majority English = LTR.

### Manual Override

In title page:

```
Direction: rtl
```

or

```
Direction: ltr
```

Note: `Direction` is English-only (no Arabic equivalent).

---

## File Format Compatibility

| Feature                 | `.hekaya` | `.fountain` |
| ----------------------- | --------- | ----------- |
| Arabic scene headings   | ✅        | ✅          |
| `@` character prefix    | ✅        | ✅          |
| Arabic transitions      | ✅        | ✅          |
| Arabic title page keys  | ✅        | ✅          |
| English Fountain syntax | ✅        | ✅          |
| RTL auto-detection      | ✅        | ✅          |

Both formats are fully supported. `.hekaya` is the primary extension.

---

## npm Packages

| Package            | Description                       | Install                        |
| ------------------ | --------------------------------- | ------------------------------ |
| `@hekaya/parser`   | Zero-dependency TypeScript parser | `npm install @hekaya/parser`   |
| `@hekaya/renderer` | HTML renderer with RTL CSS        | `npm install @hekaya/renderer` |
| `@hekaya/pdf`      | PDF generator (pdfmake-rtl)       | `npm install @hekaya/pdf`      |
| `@hekaya/cli`      | CLI tool                          | `npm install -g @hekaya/cli`   |

### Programmatic Usage

```typescript
import { parse } from '@hekaya/parser';
import { render } from '@hekaya/renderer';

const tokens = parse(scriptText);
const html = render(tokens);
```

---

## CLI Commands

```bash
hekaya parse <file>                    # Parse to JSON token stream
hekaya render <file> -o <output.html>  # Render to formatted HTML
hekaya export <file> -o <output.pdf>   # Export to PDF
hekaya export <file> --include-notes   # PDF with notes included
hekaya validate <file>                 # Validate structure
hekaya convert <file> -o <output>      # Convert between formats
```

---

## Links

- [Hekaya Markup Spec](https://michaelkmalak.github.io/hekaya/docs/spec/hekaya-markup-spec/)
- [GitHub Repository](https://github.com/MichaelKMalak/hekaya)
- [Fountain Syntax (original)](https://fountain.io/syntax/)
- [npm: @hekaya/cli](https://www.npmjs.com/package/@hekaya/cli)
- [npm: @hekaya/parser](https://www.npmjs.com/package/@hekaya/parser)
