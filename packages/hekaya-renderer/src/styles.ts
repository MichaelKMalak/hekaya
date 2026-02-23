/**
 * CSS styles for screenplay HTML output.
 *
 * Margins and layout follow standard screenplay format, mirrored for RTL:
 *   - RTL: right margin 1.5" (binding), left margin 1.0"
 *   - LTR: left margin 1.5" (binding), right margin 1.0"
 *
 * Font sizing and spacing calibrated against real Egyptian production
 * screenplays (الشيخ جاكسون, هيبتا, سهر الليالي, etc.).
 */

export function getStylesheet(direction: 'rtl' | 'ltr'): string {
  const isRtl = direction === 'rtl';
  const bindingSide = isRtl ? 'right' : 'left';
  const openSide = isRtl ? 'left' : 'right';

  return `
    @page {
      size: A4;
      margin: 1in;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: 'Courier New', 'Courier', monospace;
      font-size: 12pt;
      line-height: 1.0;
      direction: ${direction};
      text-align: ${isRtl ? 'right' : 'left'};
      max-width: 8in;
      margin: 0 auto;
      padding: 1in;
      padding-${bindingSide}: 1.5in;
      padding-${openSide}: 1in;
      color: #000;
      background: #fff;
    }

    /* Arabic font override — production scripts use proportional fonts */
    body[dir="rtl"] {
      font-family: 'Noto Naskh Arabic', 'Amiri', 'Cairo', 'Traditional Arabic', serif;
      font-size: 14pt;
      line-height: 1.6;
    }

    .screenplay {
      width: 100%;
    }

    /* Title Page */
    .title-page {
      text-align: center;
      padding: 2in 0;
      page-break-after: always;
    }

    .title-page .title {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 0.5in;
    }

    .title-page .author {
      font-size: 14pt;
      margin-bottom: 0.25in;
    }

    .title-page .meta {
      font-size: 11pt;
      color: #333;
      margin-bottom: 0.1in;
    }

    /* Scene Heading */
    .scene-heading {
      font-weight: bold;
      text-transform: uppercase;
      margin-top: 1em;
      margin-bottom: 0.5em;
    }

    body[dir="rtl"] .scene-heading {
      text-transform: none;
    }

    .scene-heading .scene-number {
      float: ${openSide};
    }

    /* Action */
    .action {
      margin-bottom: 1em;
    }

    /* Character */
    .character {
      font-weight: bold;
      margin-top: 1em;
      margin-bottom: 0;
      margin-${bindingSide}: 0;
      margin-${openSide}: 0;
      text-align: center;
    }

    body[dir="ltr"] .character {
      text-transform: uppercase;
      text-align: left;
      margin-left: 2.2in;
    }

    .character .extension {
      font-weight: normal;
    }

    /* Dialogue */
    .dialogue {
      margin-${bindingSide}: 1in;
      margin-${openSide}: 1.5in;
      margin-bottom: 0;
    }

    /* Parenthetical */
    .parenthetical {
      margin-${bindingSide}: 0.6in;
      margin-${openSide}: 2in;
      margin-bottom: 0;
    }

    /* Transition */
    .transition {
      text-align: center;
      font-weight: bold;
      margin-top: 1em;
      margin-bottom: 1em;
    }

    body[dir="ltr"] .transition {
      text-transform: uppercase;
      text-align: right;
    }

    /* Centered */
    .centered {
      text-align: center;
      margin-top: 1em;
      margin-bottom: 1em;
    }

    /* Page Break */
    .page-break {
      page-break-after: always;
      border: none;
      margin: 0;
      padding: 0;
    }

    /* Lyrics */
    .lyrics {
      font-style: italic;
      margin-${bindingSide}: 1in;
      margin-bottom: 0.5em;
    }

    /* Dual Dialogue */
    .dual-dialogue {
      display: flex;
      gap: 1em;
      direction: ${direction};
    }

    .dual-dialogue .dual-column {
      flex: 1;
    }

    /* Section (not rendered in final output, but included for previews) */
    .section {
      display: none;
    }

    /* Synopsis (not rendered in final output, but included for previews) */
    .synopsis {
      display: none;
    }

    /* Screen/print media queries */
    @media screen {
      body {
        background: #f5f5f5;
      }

      .screenplay {
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
        padding: 1in;
        padding-${bindingSide}: 1.5in;
        padding-${openSide}: 1in;
        min-height: 11in;
      }
    }

    @media print {
      body {
        padding: 0;
      }
    }
  `;
}
