declare module 'pdfmake/js/Printer.js' {
  import type { PdfDocDefinition } from './pdf-types';

  class PdfPrinter {
    constructor(fontDescriptors: Record<string, Record<string, string>>);
    createPdfKitDocument(
      docDefinition: PdfDocDefinition,
      options?: Record<string, unknown>,
    ): Promise<NodeJS.ReadableStream & { end(): void }>;
  }

  export default PdfPrinter;
}
