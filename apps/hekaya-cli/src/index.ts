#!/usr/bin/env node

/**
 * Hekaya CLI — command-line tool for Hekaya screenplay markup.
 *
 * Commands:
 *   parse    - Parse a .hekaya file and output JSON tokens
 *   render   - Render a .hekaya file to HTML
 *   export   - Export a .hekaya file to PDF
 *   validate - Validate a .hekaya file for errors
 */

import { Command } from 'commander';
import { parseCommand } from './commands/parse';
import { renderCommand } from './commands/render';
import { exportCommand } from './commands/export';
import { validateCommand } from './commands/validate';

const program = new Command();

program.name('hekaya').description('Hekaya screenplay markup toolchain').version('0.1.0');

program.addCommand(parseCommand);
program.addCommand(renderCommand);
program.addCommand(exportCommand);
program.addCommand(validateCommand);

program.parse();
