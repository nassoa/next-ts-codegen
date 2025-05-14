import { Command } from 'commander';
import { createGenerateCommand } from './commands/generate';
import { createGenerateSourceCommand } from './commands/generate-source';

export function createCli() {
  const program = new Command();
  
  program
    .name('next-ts-codegen')
    .description('CLI to generate TypeScript types and React hooks from various data sources')
    .version('0.1.0');
  
  // Register commands
  createGenerateCommand(program);
  createGenerateSourceCommand(program);
  
  return program;
}

export async function run() {
  const program = createCli();
  
  // Display help if no arguments provided
  if (process.argv.length <= 2) {
    program.outputHelp();
    process.exit(0);
  }
  
  await program.parseAsync(process.argv);
}
