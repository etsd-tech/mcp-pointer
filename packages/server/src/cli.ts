#!/usr/bin/env node

import { Command } from 'commander';
import { LogLevel } from '@mcp-pointer/shared/logger';
import start from './start';
import configCommand from './config';
import CLICommand from './commands';
import logger from './logger';

function parseLogLevel(level: string): LogLevel {
  const levelMap: Record<string, LogLevel> = {
    debug: LogLevel.DEBUG,
    info: LogLevel.INFO,
    warn: LogLevel.WARN,
    error: LogLevel.ERROR,
  };

  const parsedLevel = levelMap[level.toLowerCase()];

  if (parsedLevel === undefined) {
    logger.error(`Invalid log level: ${level}. Use debug|info|warn|error`);
    process.exit(1);
  }

  return parsedLevel;
}

const program = new Command();

program
  .option('-l, --log-level <level>', 'log level (debug|info|warn|error)', 'info')
  .option('-s, --silent', 'disable all logging', false);

program.on('option:log-level', (logLevelOption) => {
  const logLevel = parseLogLevel(logLevelOption);
  logger.setLevel(logLevel);
});

program.on('option:silent', () => {
  logger.setEnabled(false);
});

program
  .name('mcp-pointer')
  .description('👆 MCP Pointer Server')
  .version(process.env.npm_package_version ?? '0.1.0');

program
  .command(CLICommand.START)
  .description('👆 Start pointing at elements (start server)')
  .option('-p, --port <port>', 'WebSocket port', '7007')
  .action(start);

program
  .command(`${CLICommand.CONFIG} [tool]`)
  .description('Configure MCP Pointer for AI tools (claude, cursor, windsurf, manual)')
  .action(configCommand);

program.parse();
