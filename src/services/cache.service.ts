import { Injectable } from '@nestjs/common';
import { ResourceKey } from 'src/models';
import { FsService } from './fs.service';
import { differenceInHours } from 'date-fns';

const lastFetchedPath = 'db/lastFetched.json';
const hoursDiffToInvalidateCache = 6;

@Injectable()
export class CacheService {
  resourceKey: ResourceKey;

  constructor(private readonly fs: FsService) {}

  private generatePath(resourceKey: ResourceKey) {
    return `db/cache/${resourceKey}.json`;
  }

  private getLastFetched(resourceKey: ResourceKey) {
    return new Date(this.fs.readFile(lastFetchedPath)[resourceKey]);
  }

  private shouldReadFromCache(lastFetchedDate: Date) {
    return (
      differenceInHours(new Date(), lastFetchedDate) <
      hoursDiffToInvalidateCache
    );
  }

  private readFromCache(path: string) {
    return this.fs.readFile(path);
  }

  init(resourceKey: ResourceKey) {
    this.resourceKey = resourceKey;

    return this;
  }

  saveTimestamp() {
    const sherdogConfig = this.fs.readFile(lastFetchedPath);
    sherdogConfig[this.resourceKey] = new Date();
    this.fs.writeFile(lastFetchedPath, sherdogConfig);
  }

  saveJson(json: any) {
    const path = this.generatePath(this.resourceKey);
    this.fs.writeFile(path, json);
  }

  get() {
    const path = this.generatePath(this.resourceKey);
    const exists = this.fs.fileExists(path);

    if (!exists) {
      return null;
    }

    const lastFetchedDate = this.getLastFetched(this.resourceKey);
    const shouldReadFromCache = this.shouldReadFromCache(lastFetchedDate);

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
