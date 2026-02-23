import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'node:fs';
import { Hekaya } from '@hekaya/parser';
import { generatePdf } from '@hekaya/pdf';
import chalk from 'chalk';
import { getErrorMessage } from '../utils';

export const exportCommand = new Command('export')
  .description('Export a .hekaya file to PDF')
  .argument('<file>', 'Input .hekaya or .fountain file')
  .option('-o, --output <file>', 'Output PDF file (default: <input>.pdf)')
  .option('--no-title-page', 'Exclude title page')
  .option('--meta', 'Include section/synopsis elements', false)
  .action(async (file: string, options: { output?: string; titlePage: boolean; meta: boolean }) => {
    try {
      const input = readFileSync(file, 'utf-8');
      const script = Hekaya.parse(input);

      const pdfBuffer = await generatePdf(script, {
        includeTitlePage: options.titlePage,
        includeMetaElements: options.meta,
      });

      const outputPath = options.output || file.replace(/\.(hekaya|fountain)$/, '.pdf');
      writeFileSync(outputPath, pdfBuffer);
      console.log(
        chalk.green(
          `Exported ${file} → ${outputPath} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`,
        ),
      );
    } catch (err) {
      console.error(chalk.red(`Error exporting ${file}:`), getErrorMessage(err));
      process.exit(1);
    }
  });
