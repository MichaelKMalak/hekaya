/**
 * Screenplay page layout configuration.
 *
 * Dimensions in points (1 inch = 72 points).
 * Based on standard screenplay format with RTL mirroring.
 *
 * Sources:
 *   - Standard screenplay format (Final Draft, StudioBinder)
 *   - Production Egyptian screenplays (الشيخ جاكسون, هيبتا, سهر الليالي)
 *   - docs/research/06-pdf-generation.md
 */

const INCH = 72; // 1 inch = 72 PDF points

/** US Letter page size in points. */
export const PAGE_SIZE = {
  width: 8.5 * INCH, // 612
  height: 11 * INCH, // 792
};

/**
 * Get page margins for a given direction.
 * Binding side (1.5") is right for RTL, left for LTR.
 */
export function getPageMargins(dir: 'rtl' | 'ltr'): [number, number, number, number] {
  const binding = 1.5 * INCH; // 108pt — binding side
  const open = 1.0 * INCH; // 72pt — open side
  const top = 1.0 * INCH; // 72pt
  const bottom = 0.75 * INCH; // 54pt

  if (dir === 'rtl') {
    return [open, top, binding, bottom]; // [left, top, right, bottom]
  }
  return [binding, top, open, bottom];
}

/**
 * Element-specific indentation.
 * Returns [marginLeft, marginRight] in points, relative to page margins.
 * These are ADDITIONAL margins on top of the page margins.
 */
export interface ElementLayout {
  marginLeft: number;
  marginRight: number;
  alignment: 'left' | 'center' | 'right';
  bold?: boolean;
  fontSize?: number;
  lineHeight?: number;
  marginTop?: number;
  marginBottom?: number;
}

/**
 * Get layout rules for each element type.
 * Follows standard screenplay format, mirrored for RTL.
 */
export function getElementLayouts(dir: 'rtl' | 'ltr'): Record<string, ElementLayout> {
  const isRtl = dir === 'rtl';

  // For RTL: "binding" = right side, "open" = left side
  const bothIndent = (bindingInches: number, openInches: number) => {
    const b = bindingInches * INCH;
    const o = openInches * INCH;
    return isRtl ? { marginLeft: o, marginRight: b } : { marginLeft: b, marginRight: o };
  };

  return {
    scene_heading: {
      marginLeft: 0,
      marginRight: 0,
      alignment: isRtl ? 'right' : 'left',
      bold: true,
      marginTop: 18,
      marginBottom: 12,
    },

    action: {
      marginLeft: 0,
      marginRight: 0,
      alignment: isRtl ? 'right' : 'left',
      marginBottom: 12,
    },

    character: {
      ...(isRtl
        ? { marginLeft: 0, marginRight: 0, alignment: 'center' as const }
        : { marginLeft: 2.2 * INCH, marginRight: 0, alignment: 'left' as const }),
      bold: true,
      marginTop: 12,
      marginBottom: 0,
    },

    dialogue: {
      ...bothIndent(1.0, 1.5),
      alignment: isRtl ? 'right' : 'left',
      marginBottom: 0,
    },

    parenthetical: {
      ...bothIndent(1.5, 2.0),
      alignment: 'center',
      marginBottom: 0,
    },

    transition: {
      marginLeft: 0,
      marginRight: 0,
      alignment: isRtl ? 'left' : 'right',
      bold: true,
      marginTop: 12,
      marginBottom: 12,
    },

    centered: {
      marginLeft: 0,
      marginRight: 0,
      alignment: 'center',
      marginTop: 12,
      marginBottom: 12,
    },

    lyrics: {
      ...(isRtl
        ? { marginLeft: 0, marginRight: 1.0 * INCH }
        : { marginLeft: 1.0 * INCH, marginRight: 0 }),
      alignment: isRtl ? 'right' : 'left',
      marginBottom: 6,
    },

    section: {
      marginLeft: 0,
      marginRight: 0,
      alignment: isRtl ? 'right' : 'left',
      bold: true,
      marginTop: 12,
      marginBottom: 6,
    },

    synopsis: {
      marginLeft: 0,
      marginRight: 0,
      alignment: isRtl ? 'right' : 'left',
      marginBottom: 6,
    },
  };
}

/** Font sizes for RTL (Arabic) and LTR (English) scripts. */
export const FONT_CONFIG = {
  rtl: { fontSize: 12, lineHeight: 1.5 },
  ltr: { fontSize: 12, lineHeight: 1.0 },
};

/** Title page font sizes. */
export const TITLE_PAGE = {
  titleSize: 24,
  authorSize: 14,
  metaSize: 11,
};
