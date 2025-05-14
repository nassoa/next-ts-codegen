import { promises as fs } from 'fs';
import * as path from 'path';
import { get, RequestOptions } from 'https';
import { URL } from 'url';

export interface ParserOptions {
  // Options spécifiques au parseur JSON
}

export interface ParsedData {
  typeName: string;
  schema: any;
  rawData: any;
}

async function fetchUrl(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    get(url, (res: any) => {
      let data = '';
      res.on('data', (chunk: string) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', (err: Error) => reject(err));
  });
}

export async function parseJson(filePath: string, options: ParserOptions & { name?: string } = {}): Promise<ParsedData> {
  try {
    let jsonData: any;
    let typeName: string;
    
    // Déterminer le nom du type à partir des options ou du nom du fichier
    typeName = options.name || 'ApiResponse';
    
    // Vérifier si c'est une URL
    if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
      const response = await fetchUrl(filePath);
      jsonData = JSON.parse(response);
    } else {
      // Lire le fichier local
      const fileContent = await fs.readFile(filePath, 'utf-8');
      jsonData = JSON.parse(fileContent);
    }
    
    // Créer un schéma de base
    const schema = inferSchemaFromData(jsonData);
    
    return {
      typeName,
      schema,
      rawData: jsonData
    };
  } catch (error) {
    console.error(`Error parsing JSON file: ${filePath}`, error);
    throw error;
  }
}

function inferSchemaFromData(data: any): any {
  if (Array.isArray(data)) {
    if (data.length > 0) {
      return {
        type: 'array',
        items: inferSchemaFromData(data[0])
      };
    }
    return { type: 'array' };
  } else if (data !== null && typeof data === 'object') {
    const properties: Record<string, any> = {};
    const required: string[] = [];
    
    for (const [key, value] of Object.entries(data)) {
      properties[key] = inferSchemaFromData(value);
      // On considère que toutes les propriétés sont requises pour l'instant
      required.push(key);
    }
    
    return {
      type: 'object',
      properties,
      required
    };
  } else if (typeof data === 'string') {
    return { type: 'string' };
  } else if (typeof data === 'number') {
    return { type: 'number' };
  } else if (typeof data === 'boolean') {
    return { type: 'boolean' };
  } else if (data === null) {
    return { type: 'null' };
  }
  
  return { type: 'any' };
}

export default parseJson;
