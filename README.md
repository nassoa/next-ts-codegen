# Next.js TypeScript Code Generator

A powerful code generation tool for Next.js applications that automatically generates TypeScript types and React hooks from your data sources. Supports both SWR and React Query for data fetching.

## Features

- 🚀 Generate TypeScript types from JSON files or API responses
- ⚡ Create React Query or SWR hooks with a single command
- 🔄 Support for CRUD operations (Create, Read, Update, Delete)
- 🛠️ Configurable output directories and file structures
- 🔄 Automatic schema validation with Zod (optional)
- 📦 Works seamlessly with Next.js and TypeScript

## Installation

Install the package as a dev dependency:

```bash
npm install --save-dev next-ts-codegen
# or
yarn add -D next-ts-codegen
```

## Quick Start

1. Create a configuration file `next-ts-codegen.config.js` in your project root:

```javascript
module.exports = {
  // Source files or API endpoints
  sources: [
    {
      input: './public/mock/users.json',
      options: {
        type: 'json',
        name: 'User'  // This will be used for type and hook names
      }
    }
  ],
  
  // Output configuration
  output: {
    baseDir: './src',
    types: 'types',
    hooks: 'hooks',
    schemas: 'schemas',
  },
  
  // Generation options
  generateZodSchemas: false,  // Enable to generate Zod schemas
  generateSwrHooks: false,    // Generate SWR hooks
  generateReactQueryHooks: true,  // Generate React Query hooks
  hookPrefix: 'use',          // Prefix for generated hooks
  baseUrl: '/api',           // Base URL for API calls
};
```

2. Add a script to your `package.json`:

```json
{
  "scripts": {
    "generate": "next-ts-codegen generate"
  }
}
```

3. Run the generator:

```bash
npm run generate
# or
yarn generate
```

## Configuration Options

### Source Configuration

```typescript
interface SourceConfig {
  input: string;           // Path to JSON file or API endpoint
  options: {
    type: 'json' | 'api';  // Source type
    name: string;          // Base name for generated types/hooks
    [key: string]: any;    // Additional options
  };
}
```

### Output Configuration

```typescript
interface OutputConfig {
  baseDir: string;  // Base directory for all generated files
  types: string;    // Subdirectory for TypeScript types
  hooks: string;    // Subdirectory for React hooks
  schemas: string;  // Subdirectory for Zod schemas (if enabled)
}
```

## Generated Files

The generator will create the following structure:

```
src/
├── hooks/                  # Generated React hooks
│   ├── useUser.react-query.ts
│   └── ...
└── types/                 # Generated TypeScript types
    ├── User.types.ts
    └── ...
```

## Using Generated Hooks

### React Query Example

```typescript
import { useUser } from '../hooks/useUser.react-query';

function UserList() {
  const { data: users, isLoading, error } = useUser();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

## Development

### Building the Package

```bash
npm run build
```

### Running Tests

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [Your Name]

## Acknowledgments

- Inspired by various code generation tools in the TypeScript ecosystem
- Built with ❤️ for the Next.js community
