#!/usr/bin/env node
import { CommandLine } from './commands/CommandLine';
import { ChalkLogger } from '../Context/shared/infrastructure/ChalkLogger';

const logger = new ChalkLogger(new Date());

logger.log('CLI', 'Starting electron-esbuild');
const commandLine = new CommandLine(logger);
commandLine.parse(process.argv);
