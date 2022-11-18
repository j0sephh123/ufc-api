import { Injectable } from '@nestjs/common';
import { ResourceKey } from 'src/models';
import { FsService } from './fs.service';
import { differenceInHours } from 'date-fns';

const date = new Date('2022-11-18T04:37:01.704Z');
const result = differenceInHours(new Date(), date);

console.log(result);

const lastFetchedPath = 'db/lastFetched.json';

@Injectable()
export class CacheService {
  constructor(private readonly fs: FsService) {}

  private generatePath(resourceKey: ResourceKey) {
    return `db/cache/${resourceKey}.json`;
  }

  private getLastFetched(resourceKey: ResourceKey) {
    return new Date(this.fs.readFile(lastFetchedPath)[resourceKey]);
  }

  private shouldReadFromCache(lastFetchedDate: Date) {
    const diff = differenceInHours(new Date(), lastFetchedDate);
    console.log({ diff });
    return diff < 6;
  }

  private readFromCache(path: string) {
    return this.fs.readFile(path);
  }

  saveTimestamp(resourceKey: ResourceKey) {
    const sherdogConfig = this.fs.readFile(lastFetchedPath);
    sherdogConfig[resourceKey] = new Date();
    this.fs.writeFile(lastFetchedPath, sherdogConfig);
  }

  saveJson(resourceKey: ResourceKey, json: any) {
    const path = this.generatePath(resourceKey);
    this.fs.writeFile(path, json);
  }

  get(resourceKey: ResourceKey) {
    const path = this.generatePath(resourceKey);
    const exists = this.fs.fileExists(path);

    if (!exists) {
      return null;
    }

    const lastFetchedDate = this.getLastFetched(resourceKey);
    const shouldReadFromCache = this.shouldReadFromCache(lastFetchedDate);
    console.log({ shouldReadFromCache });

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
