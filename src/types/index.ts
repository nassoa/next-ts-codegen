import { Config as SchemaConfig } from '../config/index';

export * from '../config/index';

export interface SourceConfig {
  input: string;
  options: {
    type: string;
    name: string;
    [key: string]: any;
  };
}

export interface OutputConfig {
  baseDir: string;
  types: string;
  hooks: string;
  schemas: string;
}

export interface TypeGeneratorOptions {
  outputDir: string;
  generateZodSchemas: boolean;
  schemasDir?: string | null;
}

export interface HookGeneratorOptions {
  outputDir: string;
  useSwr: boolean;
  useReactQuery: boolean;
  hookPrefix: string | undefined;
  baseUrl: string | undefined;
  enableMutations: boolean;
  enableGetById: boolean;
  enablePagination: boolean;
  typesImportPath: string;
}

export interface Config extends Omit<SchemaConfig, 'sources' | 'outputDir'> {
  sources: SourceConfig[];
  output: OutputConfig;
  generateZodSchemas: boolean;
  generateSwrHooks: boolean;
  generateReactQueryHooks: boolean;
  hookPrefix: string;
  baseUrl: string;
}
