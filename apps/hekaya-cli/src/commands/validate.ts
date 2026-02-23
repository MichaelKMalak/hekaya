import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { Hekaya, type HekayaToken } from '@hekaya/parser';
import chalk from 'chalk';
import { getErrorMessage } from '../utils';

export const validateCommand = new Command('validate')
  .description('Validate a .hekaya file')
  .argument('<file>', 'Input .hekaya or .fountain file')
  .action(async (file: string) => {
    try {
      const input = readFileSync(file, 'utf-8');
      const script = Hekaya.parse(input);

      const issues: string[] = [];

      // Check title page
      if (script.titleEntries.length === 0) {
        issues.push('No title page metadata found');
      } else {
        const hasTitle = script.titleEntries.some((e) => e.key === 'title');
        if (!hasTitle) issues.push('Missing title (العنوان/Title)');
      }

      // Check for empty script
      const bodyTokens = script.tokens.filter((t) => t.type !== 'blank');
      if (bodyTokens.length === 0) {
        issues.push('Script body is empty');
      }

      // Check for orphaned dialogue (dialogue without character)
      for (let i = 0; i < script.tokens.length; i++) {
        const token = script.tokens[i];
        if (token.type === 'dialogue') {
          const prev = findPrevNonBlank(script.tokens, i);
          if (
            prev < 0 ||
            (script.tokens[prev].type !== 'character' &&
              script.tokens[prev].type !== 'parenthetical' &&
              script.tokens[prev].type !== 'dialogue')
          ) {
            issues.push(`Line ${i + 1}: Dialogue without a character name`);
          }
        }
      }

      // Check for scene headings
      const hasScenes = script.tokens.some((t) => t.type === 'scene_heading');
      if (!hasScenes && bodyTokens.length > 0) {
        issues.push('No scene headings found');
      }

      // Report results
      if (issues.length === 0) {
        console.log(chalk.green(`${file}: Valid`));
        console.log(
          `  ${bodyTokens.length} elements, ${
            script.tokens.filter((t) => t.type === 'scene_heading').length
          } scenes`,
        );
      } else {
        console.log(chalk.yellow(`${file}: ${issues.length} issue${issues.length > 1 ? 's' : ''}`));
        for (const issue of issues) {
          console.log(chalk.yellow(`  - ${issue}`));
        }
        process.exit(1);
      }
    } catch (err) {
      console.error(chalk.red(`Error validating ${file}:`), getErrorMessage(err));
      process.exit(1);
    }
  });

function findPrevNonBlank(tokens: HekayaToken[], index: number): number {
  for (let i = index - 1; i >= 0; i--) {
    if (tokens[i].type !== 'blank') return i;
  }
  return -1;
}
