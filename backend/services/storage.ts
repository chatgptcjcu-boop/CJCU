import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'backend', 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export function readData<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(content);
}

export function writeData<T>(filename: string, data: T[]): void {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

export function findById<T extends { id: string }>(filename: string, id: string): T | undefined {
  const data = readData<T>(filename);
  return data.find(item => item.id === id);
}

export function saveItem<T extends { id: string }>(filename: string, item: T): void {
  const data = readData<T>(filename);
  const index = data.findIndex(i => i.id === item.id);
  if (index !== -1) {
    data[index] = item;
  } else {
    data.push(item);
  }
  writeData(filename, data);
}

export function deleteItem(filename: string, id: string): void {
  const data = readData<{ id: string }>(filename);
  const filtered = data.filter(item => item.id !== id);
  writeData(filename, filtered);
}
