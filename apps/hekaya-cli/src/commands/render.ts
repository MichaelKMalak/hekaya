import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'node:fs';
import { Hekaya } from '@hekaya/parser';
import { render } from '@hekaya/renderer';
import chalk from 'chalk';
import { getErrorMessage } from '../utils';

export const renderCommand = new Command('render')
  .description('Render a .hekaya file to HTML')
  .argument('<file>', 'Input .hekaya or .fountain file')
  .option('-o, --output <file>', 'Output HTML file (default: stdout)')
  .option('--no-title-page', 'Exclude title page')
  .option('--meta', 'Include section/synopsis elements', false)
  .action(async (file: string, options: { output?: string; titlePage: boolean; meta: boolean }) => {
    try {
      const input = readFileSync(file, 'utf-8');
      const script = Hekaya.parse(input);

      const html = render(script, {
        includeTitlePage: options.titlePage,
        includeMetaElements: options.meta,
      });

      if (options.output) {
        writeFileSync(options.output, html, 'utf-8');
        console.log(chalk.green(`Rendered ${file} → ${options.output}`));
      } else {
        process.stdout.write(html + '\n');
      }
    } catch (err) {
      console.error(chalk.red(`Error rendering ${file}:`), getErrorMessage(err));
      process.exit(1);
    }
  });
