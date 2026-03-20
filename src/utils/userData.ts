import * as fs from 'fs';
import * as path from 'path';

export interface User {
  key: string;
  email: string;
  name: string;
  role: string;
  password: string;
}

function parseCSV(filePath: string): User[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i]?.trim() ?? '';
      return obj;
    }, {} as Record<string, string>) as unknown as User;
  });
}

export function getUserByKey(key: string): User {
  const env = process.env.ENV ?? 'local';
  const csvPath = path.resolve(process.cwd(), 'testData', env, 'users.csv');
  const users = parseCSV(csvPath);
  const user = users.find(u => u.key === key);
  if (!user) {
    throw new Error(`User with key "${key}" not found in ${csvPath}`);
  }
  return user;
}
