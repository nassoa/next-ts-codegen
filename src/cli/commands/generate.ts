import { Command } from 'commander';
import { Config, HookGeneratorOptions } from '../../types';
import { parseJson } from '../../parsers/json-parser';
import { generateTypes } from '../../generators/type-generator';
import { generateHooks } from '../../generators/hook-generator';
import chalk from 'chalk';
import path from 'path';
import { promises as fs } from 'fs';

export function createGenerateCommand(program: Command) {
  return program
    .command('generate')
    .description('Generate TypeScript types and React hooks using configuration file')
    .action(async () => {
      try {
        const configPath = path.join(process.cwd(), 'next-ts-codegen.config.js');
        const config: Config = await import(configPath).then(m => m.default || m);
        
        console.log(chalk.blue('Starting code generation with config:'));
        console.log(JSON.stringify(config, null, 2));
        
        for (const source of config.sources) {
          try {
            console.log(chalk.cyan(`\nProcessing source: ${source.input}`));
            
            // Parse the source file
            const parsedData = await parseJson(source.input, source.options);
            
            // Create output directories
            const baseDir = path.resolve(process.cwd(), config.output.baseDir);
            const typesDir = path.join(baseDir, config.output.types);
            const hooksDir = path.join(baseDir, config.output.hooks);
            const schemasDir = config.generateZodSchemas ? path.join(baseDir, config.output.schemas) : null;
            
            // Ensure directories exist
            await fs.mkdir(typesDir, { recursive: true });
            await fs.mkdir(hooksDir, { recursive: true });
            if (schemasDir) {
              await fs.mkdir(schemasDir, { recursive: true });
            }
            
            // Ajouter le typeName aux données parsées
            const dataWithTypeName = {
              ...parsedData,
              typeName: source.options.name
            };
            
            // Generate types
            console.log(chalk.blue('\nGenerating types...'));
            const typeDefinitions = await generateTypes(dataWithTypeName, {
              outputDir: typesDir,
              generateZodSchemas: config.generateZodSchemas,
              schemasDir,
            });
            
            // Generate hooks if enabled
            if (config.generateSwrHooks || config.generateReactQueryHooks) {
              console.log(chalk.blue('\nGenerating hooks...'));
              const hooksOptions: HookGeneratorOptions = {
                outputDir: hooksDir,
                useSwr: config.generateSwrHooks,
                useReactQuery: config.generateReactQueryHooks,
                hookPrefix: config.hookPrefix,
                baseUrl: config.baseUrl,
                enableMutations: true,
                enableGetById: true,
                enablePagination: true,
                typesImportPath: `../${path.relative(hooksDir, typesDir).replace(/\\/g, '/')}/${source.options.name}.types`,
              };
              
              await generateHooks(dataWithTypeName, hooksOptions);
            }
          } catch (error) {
            console.error(chalk.red(`Error processing source ${source.input}:`), error);
            throw error;
          }
        }
        
        console.log(chalk.green('\nCode generation completed successfully!'));
      } catch (error) {
        console.error(chalk.red('Error during code generation:'), error);
        process.exit(1);
      }
    });
}
