#!/usr/bin/env node
import { CommandLine } from './commands/CommandLine';

const commandLine = new CommandLine();
commandLine.parse(process.argv);
