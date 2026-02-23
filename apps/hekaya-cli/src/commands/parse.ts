import { Command } from 'commander';
import { readFileSync, writeFileSync } from 'node:fs';
import { Hekaya } from '@hekaya/parser';
import chalk from 'chalk';
import { getErrorMessage } from '../utils';

export const parseCommand = new Command('parse')
  .description('Parse a .hekaya file and output JSON tokens')
  .argument('<file>', 'Input .hekaya or .fountain file')
  .option('-o, --output <file>', 'Output file (default: stdout)')
  .option('--pretty', 'Pretty-print JSON output', true)
  .option('--no-pretty', 'Compact JSON output')
  .action(async (file: string, options: { output?: string; pretty: boolean }) => {
    try {
      const input = readFileSync(file, 'utf-8');
      const script = Hekaya.parse(input);

      const json = options.pretty ? JSON.stringify(script, null, 2) : JSON.stringify(script);

      if (options.output) {
        writeFileSync(options.output, json, 'utf-8');
        console.log(chalk.green(`Parsed ${file} → ${options.output}`));
      } else {
        process.stdout.write(json + '\n');
      }
    } catch (err) {
      console.error(chalk.red(`Error parsing ${file}:`), getErrorMessage(err));
      process.exit(1);
    }
  });
