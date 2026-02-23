/**
 * Fountain backward-compatibility regression tests.
 *
 * Verifies that standard Fountain files (English, uppercase conventions)
 * parse correctly through the Hekaya parser.
 */
import { describe, it, expect } from 'vitest';
import { parse } from '../src/lexer';

describe('Fountain backward compatibility', () => {
  it('parses standard Fountain title page (Title/Author/Draft date)', () => {
    const input = `Title: The Godfather
Author: Mario Puzo
Draft date: March 1971

INT. OFFICE - DAY`;

    const script = parse(input);
    expect(script.titleEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'title', value: 'The Godfather' }),
        expect.objectContaining({ key: 'author', value: 'Mario Puzo' }),
        expect.objectContaining({ key: 'draft date', value: 'March 1971' }),
      ]),
    );
  });

  it('detects UPPERCASE character names (English only, no @)', () => {
    const input = `Title: Test

INT. OFFICE - DAY

MICHAEL
Hello.

FREDO
Hey there.
`;

    const script = parse(input);
    const characters = script.tokens.filter((t) => t.type === 'character');
    expect(characters).toHaveLength(2);
    expect(characters[0].text).toContain('MICHAEL');
    expect(characters[1].text).toContain('FREDO');
  });

  it('parses forced scene heading with period prefix', () => {
    const input = `Title: Test

.FLASHBACK

Action here.
`;

    const script = parse(input);
    const heading = script.tokens.find((t) => t.type === 'scene_heading');
    expect(heading).toBeDefined();
    expect(heading!.forced).toBe(true);
  });

  it('parses forced action with ! prefix', () => {
    const input = `Title: Test

INT. ROOM - DAY

!SOME FORCED ACTION
`;

    const script = parse(input);
    const action = script.tokens.find((t) => t.type === 'action' && t.forced);
    expect(action).toBeDefined();
  });

  it('parses page break ===', () => {
    const input = `Title: Test

INT. ROOM - DAY

Some action.

===

EXT. PARK - DAY
`;

    const script = parse(input);
    const pb = script.tokens.find((t) => t.type === 'page_break');
    expect(pb).toBeDefined();
  });

  it('parses boneyard /* ... */', () => {
    const input = `Title: Test

INT. ROOM - DAY

/* This scene was deleted */

Some action.
`;

    const script = parse(input);
    expect(script.boneyards).toHaveLength(1);
    expect(script.boneyards[0]).toContain('This scene was deleted');
  });

  it('parses notes [[ ... ]]', () => {
    const input = `Title: Test

INT. ROOM - DAY

Some action. [[Note about this scene]]
`;

    const script = parse(input);
    expect(script.notes).toHaveLength(1);
    expect(script.notes[0]).toContain('Note about this scene');
  });

  it('parses dual dialogue with caret ^', () => {
    const input = `Title: Test

INT. ROOM - DAY

JOHN
Hello!

MARY ^
Hi there!
`;

    const script = parse(input);
    const characters = script.tokens.filter((t) => t.type === 'character');
    expect(characters).toHaveLength(2);
    const mary = characters[1];
    expect(mary.dualDialogue).toBe(true);
  });

  it('parses lyrics with ~ prefix', () => {
    const input = `Title: Test

INT. ROOM - DAY

~Twinkle twinkle little star
`;

    const script = parse(input);
    const lyrics = script.tokens.find((t) => t.type === 'lyrics');
    expect(lyrics).toBeDefined();
    expect(lyrics!.text).toContain('Twinkle twinkle little star');
  });
});
