import * as fs from 'fs';
import * as path from 'path';

function parseProperties(filePath: string): Record<string, string> {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content
    .split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .reduce((config, line) => {
      const [key, ...rest] = line.split('=');
      config[key.trim()] = rest.join('=').trim();
      return config;
    }, {} as Record<string, string>);
}

export function getConfig(): Record<string, string> {
  const env = process.env.ENV ?? 'local';
  const configPath = path.resolve(process.cwd(), 'testData', env, 'config.properties');
  return parseProperties(configPath);
}
