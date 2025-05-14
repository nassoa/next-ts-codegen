# Next.js TypeScript Code Generator

A powerful code generation tool for Next.js applications that automatically generates TypeScript types and React hooks from your data sources. Supports both SWR and TanStack Query for data fetching.

## Features

- Generate TypeScript types from JSON files or API responses
- Create TanStack Query or SWR hooks with a single command
- Support for CRUD operations (Create, Read, Update, Delete)
- Configurable output directories and file structures
- Automatic schema validation with Zod (optional)
- Works seamlessly with Next.js and TypeScript

## Installation

```bash
npm install --save-dev next-ts-codegen
# or
yarn add -D next-ts-codegen
```

## Quick Start

### Option 1: Using CLI (No config needed)

Generate types from a local JSON file:
```bash
npx next-ts-codegen generate:source path/to/your/file.json
```

Generate types from a URL:
```bash
npx next-ts-codegen generate:source https://api.example.com/data.json
```

### Option 2: Using Configuration File

Create a configuration file `next-ts-codegen.config.js` in your project root:

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
  generateTanStackQueryHooks: true,  // Generate TanStack Query hooks
};
```

## CLI Commands

### Generate from Source

```bash
# Basic usage
npx next-ts-codegen generate:source <input>

# With options
npx next-ts-codegen generate:source <input> \
  --name TypeName \
  --output src/generated \
  --watch

# Example with URL
npx next-ts-codegen generate:source https://api.example.com/users
```

#### Options:
- `--name, -n`: Name of the main type (default: inferred from filename)
- `--output, -o`: Output directory (default: `src/generated`)
- `--watch, -w`: Watch for changes and regenerate automatically
- `--help`: Show help

### Generate from Schema

```bash
npx next-ts-codegen generate:schema <schema-file>
```

## Examples

### 1. Basic JSON File

`data.json`:
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

Command:
```bash
npx next-ts-codegen generate:source data.json --name User
```

### 2. API Response

```bash
npx next-ts-codegen generate:source https://jsonplaceholder.typicode.com/todos/1 --name Todo
```

## Using Generated Types

After generating types, you can import and use them in your components:

```typescript
import { User } from '@/generated/User.types';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  return (
    <div>
      <h1>{user.name}</h1>
      <p>Email: {user.email}</p>
      <p>Member since: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}
```

### With TanStack Query Hooks

If you generated TanStack Query hooks:

```typescript
'use client';

import { useQuery } from '@tanstack/react-query';
import { useGetTodo } from './generated/hooks';

export function TodoItem({ id }) {
  // Using the generated TanStack Query hook
  const { data: todo, isLoading, error } = useGetTodo({ id });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading todo</div>;

  return (
    <div>
      <h2>{todo.title}</h2>
      <p>Completed: {todo.completed ? '✅' : '❌'}</p>
    </div>
  );
}
```

## Advanced Configuration

### Configuration File

`next-ts-codegen.config.js`:
```javascript
  generateTanStackQueryHooks: true,  // Generate TanStack Query hooks
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

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License.

<!-- ## Acknowledgments

- Inspired by various code generation tools in the TypeScript ecosystem
- Built with ❤️ for the Next.js community -->
