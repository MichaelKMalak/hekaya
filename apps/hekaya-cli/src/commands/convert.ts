import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'node:fs';
import { Hekaya } from '@hekaya/parser';
import chalk from 'chalk';
import { getErrorMessage } from '../utils';

export const convertCommand = new Command('convert')
  .description('Convert between .hekaya and .fountain formats')
  .argument('<file>', 'Input .hekaya or .fountain file')
  .option('-o, --output <file>', 'Output file (default: swaps extension)')
  .action(async (file: string, options: { output?: string }) => {
    try {
      const input = readFileSync(file, 'utf-8');
      const script = Hekaya.parse(input);
      const output = Hekaya.serialize(script);

      // Default output: swap extension
      let outputPath = options.output;
      if (!outputPath) {
        if (file.endsWith('.hekaya')) {
          outputPath = file.replace(/\.hekaya$/, '.fountain');
        } else if (file.endsWith('.fountain')) {
          outputPath = file.replace(/\.fountain$/, '.hekaya');
        } else {
          outputPath = file + '.fountain';
        }
      }

      writeFileSync(outputPath, output, 'utf-8');
      console.log(chalk.green(`Converted ${file} → ${outputPath}`));
    } catch (err) {
      console.error(chalk.red(`Error converting ${file}:`), getErrorMessage(err));
      process.exit(1);
    }
  });
