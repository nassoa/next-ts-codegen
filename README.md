<div align="center">
  <h1>Next.js TypeScript Code Generator</h1>
  
  [![npm](https://img.shields.io/npm/v/next-ts-codegen.svg)](https://www.npmjs.com/package/next-ts-codegen)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/nassoa/next-ts-codegen/test.yml)](https://github.com/nassoa/next-ts-codegen/actions)
  [![npm](https://img.shields.io/npm/dw/next-ts-codegen)](https://www.npmjs.com/package/next-ts-codegen)
  [![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
</div>

---

A powerful code generation tool for Next.js applications that automatically generates TypeScript types and React hooks from your data sources. Supports both SWR and React Query for data fetching.

## ✨ Fonctionnalités

- 🚀 Generate TypeScript types from JSON files or API responses
- ⚡ Create React Query or SWR hooks with a single command
- 🔄 Support for CRUD operations (Create, Read, Update, Delete)
- 🛠️ Configurable output directories and file structures
- 🔄 Automatic schema validation with Zod (optional)
- 📦 Works seamlessly with Next.js and TypeScript

## 📦 Installation

```bash
# En tant que dépendance de développement
npm install --save-dev next-ts-codegen
# ou
yarn add -D next-ts-codegen

# En global
npm install -g next-ts-codegen
```

## 🔧 Configuration requise

- Node.js 20 ou supérieur
- npm 9 ou supérieur ou yarn

Install the package as a dev dependency:

```bash
npm install --save-dev next-ts-codegen
# or
yarn add -D next-ts-codegen
```

## 🚀 Démarrage rapide

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
};

## ⌨️ Commandes CLI

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

## 📚 Exemples

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

## 🔍 Utilisation des types générés

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

### 🔄 Avec les hooks React Query

If you generated React Query hooks:

```typescript
'use client';

import { useGetUsers } from '@/generated/hooks/useUsers.hooks';

export function UsersList() {
  const { data: users, isLoading, error } = useGetUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {users?.map(user => (
        <li key={user.id}>
          {user.name} - {user.email}
        </li>
      ))}
    </ul>
  );
}
```

## 🔧 Configuration avancée

### Fichier de configuration

`next-ts-codegen.config.js`:
```javascript
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

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 License

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 📝 Changelog

Consultez le [CHANGELOG.md](CHANGELOG.md) pour voir l'historique des changements.

## 🔗 Liens utiles

- [Documentation complète](https://github.com/nassoa/next-ts-codegen#readme)
- [Signaler un bug](https://github.com/nassoa/next-ts-codegen/issues)
- [Contribuer](https://github.com/nassoa/next-ts-codegen/pulls)

MIT © Nasoavina

## Acknowledgments

- Inspired by various code generation tools in the TypeScript ecosystem
- Built with ❤️ for the Next.js community
