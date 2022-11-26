import { Injectable } from '@nestjs/common';
import { FsService } from './fs.service';
import { differenceInHours } from 'date-fns';

@Injectable()
export class CacheService {
  constructor(private readonly fs: FsService) {}

  lastFetchedPath = 'db/lastFetched.json';

  private generatePath(path: string) {
    return `db/cache/${path}.json`;
  }

  private getLastFetchedDate(path: string) {
    return new Date(this.fs.readFile(this.lastFetchedPath)[path]);
  }

  shouldReadFromCache(key: string) {
    const lastFetchedDate = this.getLastFetchedDate(key);

    return differenceInHours(new Date(), lastFetchedDate) > 48;
  }

  private readFromCache(path: string) {
    return this.fs.readFile(path);
  }

  saveJson(json: any, key: string) {
    console.log(json);

    const path = this.generatePath(key);
    this.fs.writeFile(path, json);
    const sherdogConfig = this.fs.readFile(this.lastFetchedPath);
    sherdogConfig[key] = new Date();
    this.fs.writeFile(this.lastFetchedPath, sherdogConfig);
  }

  isInvalid(key: string) {
    const path = this.generatePath(key);
    const exists = this.fs.fileExists(path);

    if (!exists) {
      return true;
    }

    return this.shouldReadFromCache(key);
  }

  get(key: string) {
    const path = this.generatePath(key);

    return this.readFromCache(path);
  }

  getLastFetched() {
    return this.fs.readFile(this.lastFetchedPath);
  }

  getFiles() {
    return this.fs.readCacheFiles().map((item) => item.slice(0, -5));
  }

  getFile(fileName: string) {
    return this.fs.readFile(this.generatePath(fileName));
  }
}
