import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync } from 'fs';

@Injectable()
export class FsService {
  readFile(path: string) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }

  writeFile(path: string, data: any) {
    writeFileSync(path, JSON.stringify(data), 'utf8');
  }

  fileExists(path: string) {
    return existsSync(path);
  }
}
