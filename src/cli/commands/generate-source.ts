import { Command } from 'commander';
import { parseJson } from '../../parsers/json-parser';
import { generateTypes } from '../../generators/type-generator';
import { generateHooks } from '../../generators/hook-generator';
import chalk from 'chalk';
import path from 'path';

export function createGenerateSourceCommand(program: Command) {
  return program
    .command('generate:source <source>')
    .description('Generate TypeScript types and React hooks from a single source file')
    .option('-o, --output <dir>', 'Output directory', 'src/generated')
    .option('-n, --name <name>', 'Base name for the generated types and hooks')
    .option('--zod', 'Generate Zod schemas', (val: string | boolean) => val !== 'false' && val !== false)
    .option('--swr', 'Generate SWR hooks', (val: string | boolean) => val !== 'false' && val !== false)
    .option('--react-query', 'Generate React Query hooks', (val: string | boolean) => val !== 'false' && val !== false)
    .action(async (source: string, options: any) => {
      const outputDir = path.resolve(process.cwd(), options.output);
      try {
        console.log(chalk.blue('Starting code generation from source...'));
        
        // Parse the source file
        const sourcePath = path.resolve(process.cwd(), source);
        const data = await parseJson(sourcePath);
        
        // Generate types
        console.log(chalk.blue('Generating types...'));
        const typeDefinitions = await generateTypes(data, {
          outputDir,
          generateZodSchemas: options.zod,
        });
        
        // Generate hooks if requested
        if (options.swr || options.reactQuery) {
          console.log(chalk.blue('Generating hooks...'));
          const hooksOptions = {
            outputDir,
            useSwr: options.swr,
            useReactQuery: options.reactQuery,
            hookPrefix: undefined,
            baseUrl: `/${options.name.toLowerCase()}s`,
            enableMutations: true,
            enableGetById: true,
            enablePagination: true,
            typesImportPath: `./${options.name || 'types'}.types`
          };
          
          await generateHooks(typeDefinitions, hooksOptions);
        }
        
        console.log(chalk.green('\nCode generation completed successfully!'));
      } catch (error) {
        console.error(chalk.red('Error during code generation:'), error);
        process.exit(1);
      }
    });
}
