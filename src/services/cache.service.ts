import { Injectable } from '@nestjs/common';
import { FsService } from './fs.service';
import { differenceInHours } from 'date-fns';
import { generateHoursFromDays } from 'src/utils/generate';

const lastFetchedPath = 'db/lastFetched.json';

@Injectable()
export class CacheService {
  path: string;
  hoursDiffToInvalidateCache = generateHoursFromDays(2);

  constructor(private readonly fs: FsService) {}

  private generatePath(path: string) {
    return `db/cache/${path}.json`;
  }

  private getLastFetched(path: string) {
    return new Date(this.fs.readFile(lastFetchedPath)[path]);
  }

  private shouldReadFromCache(lastFetchedDate: Date) {
    const diff =
      differenceInHours(new Date(), lastFetchedDate) <
      this.hoursDiffToInvalidateCache;

    return diff;
  }

  private readFromCache(path: string) {
    return this.fs.readFile(path);
  }

  init(path: string, hoursDiffToInvalidateCache?: number) {
    this.path = path;
    if (hoursDiffToInvalidateCache !== undefined) {
      this.hoursDiffToInvalidateCache = hoursDiffToInvalidateCache;
    }

    return this;
  }

  saveTimestamp() {
    const sherdogConfig = this.fs.readFile(lastFetchedPath);
    sherdogConfig[this.path] = new Date();
    this.fs.writeFile(lastFetchedPath, sherdogConfig);
  }

  saveJson(json: any) {
    const path = this.generatePath(this.path);
    this.fs.writeFile(path, json);
  }

  get() {
    const path = this.generatePath(this.path);
    const exists = this.fs.fileExists(path);

    if (!exists) {
      return null;
    }

    const lastFetchedDate = this.getLastFetched(this.path);
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
