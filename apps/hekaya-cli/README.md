# @hekaya/cli

Command-line tool for [Hekaya](https://github.com/michaelkmalak/hekaya) screenplay markup. Parse, render, export, validate, and convert Arabic screenplays.

## Install

```bash
npm install -g @hekaya/cli
```

## Commands

### Parse to JSON

```bash
hekaya parse script.hekaya
hekaya parse script.hekaya -o script.json
hekaya parse script.hekaya --no-pretty
```

### Render to HTML

```bash
hekaya render script.hekaya
hekaya render script.hekaya -o script.html
```

### Export to PDF

```bash
hekaya export script.hekaya -o script.pdf
hekaya export script.hekaya --no-title-page
hekaya export script.hekaya --meta              # include sections/synopses
hekaya export script.hekaya --include-notes      # include [[notes]] in PDF
```

### Validate

```bash
hekaya validate script.hekaya
# Checks: title page, scene headings, orphaned dialogue, empty body
```

### Convert between formats

```bash
hekaya convert script.hekaya -o script.fountain
hekaya convert script.fountain -o script.hekaya
```

## Example

```bash
# Write a screenplay
cat > film.hekaya << 'EOF'
العنوان: آخر أيام الصيف
سيناريو: سمير عبدالحميد

داخلي - قهوة بلدي - نهار

سمير قاعد لوحده في ركن القهوة.

@سمير
(بهدوء)
قهوة سادة، لو سمحت.
EOF

# Export to PDF
hekaya export film.hekaya -o film.pdf
```

## License

MIT
