#!/usr/bin/env node
import { ChalkLogger } from '../Context/shared/infrastructure/ChalkLogger';
import { CommandLine } from './commands/CommandLine';

const logger = new ChalkLogger(new Date());

logger.log('CLI', 'Starting electron-esbuild');
const commandLine = new CommandLine(logger);
commandLine.parse(process.argv);
