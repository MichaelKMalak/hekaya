# Contributing to Hekaya

Thank you for your interest in contributing to Hekaya! This project was created for the members of [Cairo Indie Filmmakers Club](https://cairoindie.com/) to help Egyptian and Arabic-speaking screenwriters.

## Prerequisites

- Node.js >= 20
- pnpm >= 9

## Setup

```bash
git clone https://github.com/michaelkmalak/hekaya.git
cd hekaya
pnpm install
pnpm build
pnpm test
```

## Development Workflow

1. Create a branch from `main`
2. Make your changes
3. Run `pnpm test` and `pnpm lint` to verify
4. Submit a pull request

## Commands

```bash
pnpm build          # Build all packages
pnpm test           # Run all tests
pnpm test:coverage  # Run tests with coverage
pnpm lint           # Lint all source files
pnpm format         # Format all files
pnpm format:check   # Check formatting
```

## Project Structure

```
packages/hekaya-parser     # Core parser (zero dependencies)
packages/hekaya-renderer   # HTML renderer
packages/hekaya-pdf        # PDF generator
apps/hekaya-cli            # Command-line tool
```

## Coding Conventions

- TypeScript strict mode
- Single quotes for strings
- Named exports only (no default exports)
- No `any` types (ESLint enforces this)
- Comments in English; user-facing strings bilingual

## Arabic Content Guidelines

- Use Egyptian Arabic dialect for sample dialogue
- Use Egyptian character names (e.g., سمير، نادية، حسن، ليلى)
- Refer to users as "Egyptian and Arabic-speaking screenwriters"
- Test with: plain Arabic, Arabic with diacritics, mixed Arabic/English

## RTL-Specific Notes

- Always use the Unicode flag (`u`) on regex patterns
- Test both RTL and LTR outputs
- Account for optional diacritical marks between base characters
- Use BiDi utilities from `packages/hekaya-parser/src/bidi.ts`

## Test Guidelines

- Write tests before implementation for new parser rules
- Every Arabic keyword/pattern needs positive AND negative test cases
- Test with diacritics (تشكيل) wherever applicable
- Coverage targets: 95% parser, 90% renderer, 80% PDF, 80% CLI
