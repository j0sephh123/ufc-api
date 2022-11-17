import { Injectable } from '@nestjs/common';
import { readFileSync, writeFileSync } from 'fs';
import { FetchTimestampKey } from 'src/models';

@Injectable()
export class FsService {
  private readFile(path: string) {
    return JSON.parse(readFileSync(path, 'utf8'));
  }

  private writeFile(path: string, data: any) {
    writeFileSync(path, JSON.stringify(data), 'utf8');
  }

  saveFetchTimestamp(path: FetchTimestampKey) {
    const sherdogConfig = this.readFile('db/lastFetched.json');
    sherdogConfig[path] = new Date();
    this.writeFile('db/lastFetched.json', sherdogConfig);
  }
}
