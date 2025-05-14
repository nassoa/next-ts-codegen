import { Config } from '../types/index';

export const defaultConfig: Partial<Config> = {
  output: {
    baseDir: 'src/generated',
    types: 'types',
    hooks: 'hooks',
    schemas: 'schemas',
  },
  generateZodSchemas: true,
  generateSwrHooks: false,
  generateReactQueryHooks: false,
  hookPrefix: 'use',
  baseUrl: '/api',
  sources: [],
};
