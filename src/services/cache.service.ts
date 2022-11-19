import { Injectable } from '@nestjs/common';
import { FsService } from './fs.service';
import { differenceInHours } from 'date-fns';

const lastFetchedPath = 'db/lastFetched.json';

@Injectable()
export class CacheService {
  constructor(private readonly fs: FsService) {}

  private generatePath(path: string) {
    return `db/cache/${path}.json`;
  }

  private getLastFetched(path: string) {
    return new Date(this.fs.readFile(lastFetchedPath)[path]);
  }

  shouldReadFromCache(key: string) {
    const lastFetchedDate = this.getLastFetched(key);

    return differenceInHours(new Date(), lastFetchedDate) < 48;
  }

  private readFromCache(path: string) {
    return this.fs.readFile(path);
  }

  saveJson(json: any, key: string) {
    const path = this.generatePath(key);
    this.fs.writeFile(path, json);
    const sherdogConfig = this.fs.readFile(lastFetchedPath);
    sherdogConfig[key] = new Date();
    this.fs.writeFile(lastFetchedPath, sherdogConfig);
  }

  get(key: string) {
    console.log(key);

    const path = this.generatePath(key);
    const exists = this.fs.fileExists(path);

    if (!exists) {
      return null;
    }

    const shouldReadFromCache = this.shouldReadFromCache(key);

    if (!shouldReadFromCache) {
      return null;
    }

    try {
      return this.readFromCache(path);
    } catch (e) {
      return null;
    }
  }
}
