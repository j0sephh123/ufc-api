import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';

@Injectable()
export class FsService {
  cachePath = 'db/cache';

  readFile(path: string) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }

  writeFile(path: string, data: any) {
    writeFileSync(path, JSON.stringify(data), 'utf8');
  }

  fileExists(path: string) {
    return existsSync(path);
  }

  readCacheFiles() {
    return readdirSync(this.cachePath);
  }
}
