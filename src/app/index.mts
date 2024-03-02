#!/usr/bin/env node
import { ChalkLogger } from '../Context/shared/infrastructure/ChalkLogger.mjs';
import { CommandLine } from './commands/CommandLine.mjs';

const logger = new ChalkLogger(new Date());

logger.log('CLI', 'Starting electron-esbuild');
const commandLine = new CommandLine(logger);
commandLine.parse(process.argv);
