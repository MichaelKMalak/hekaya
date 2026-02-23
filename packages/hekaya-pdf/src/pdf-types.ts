/**
 * Type definitions for pdfmake document structures.
 *
 * These types model the subset of pdfmake's document definition
 * used by the Hekaya PDF generator.
 */

/** An inline text segment with formatting. */
export interface PdfTextSegment {
  text: string;
  bold?: boolean;
  italics?: boolean;
  decoration?: string;
}

/** Inline formatting style applied to text segments. */
export interface InlineStyle {
  bold?: boolean;
  italics?: boolean;
  decoration?: string;
}

/** A pdfmake text node with optional styling. */
export interface PdfTextNode {
  text: string | (string | PdfTextSegment)[];
  font?: string;
  fontSize?: number;
  bold?: boolean;
  italics?: boolean;
  decoration?: string;
  alignment?: 'left' | 'center' | 'right';
  margin?: [number, number, number, number];
  color?: string;
  lineHeight?: number;
  pageBreak?: 'before' | 'after';
}

/** A column definition within a columns layout. */
export interface PdfColumnDef {
  width: string | number;
  stack?: PdfContentNode[];
  text?: string;
}

/** A pdfmake columns layout container. */
export interface PdfColumnsNode {
  columns: PdfColumnDef[];
  columnGap: number;
}

/** Union of all content node types used in document body. */
export type PdfContentNode = PdfTextNode | PdfColumnsNode;

/** The pdfmake document definition. */
export interface PdfDocDefinition {
  pageSize: { width: number; height: number };
  pageMargins: [number, number, number, number];
  content: PdfContentNode[];
  defaultStyle: {
    font: string;
    fontSize: number;
    lineHeight: number;
  };
  footer: (currentPage: number, pageCount: number) => PdfTextNode | null;
}
