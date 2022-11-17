import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { FetchTimestampKey } from '../models';
import { FsService } from './fs.service';

const sherdogBaseUrl = 'https://www.sherdog.com/';
const sherdogEventsUrl = `${sherdogBaseUrl}organizations/Ultimate-Fighting-Championship-UFC-2`;
const sherdogDbPath = 'db/sherdog.json';

@Injectable()
export class SherdogService {
  constructor(
    private readonly httpService: HttpService,
    private readonly fsService: FsService,
  ) {}

  private saveFetchTimestamp(path: FetchTimestampKey) {
    const sherdogConfig = this.fsService.readFile(sherdogDbPath);
    sherdogConfig.lastFetched[path] = new Date();
    this.fsService.writeFile(sherdogDbPath, sherdogConfig);
  }

  async events(): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(sherdogEventsUrl),
    );

    this.saveFetchTimestamp('events');

    return data;
  }

  async event(eventPageUrl: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${sherdogBaseUrl}${eventPageUrl}`),
    );

    this.saveFetchTimestamp('event');

    return data;
  }

  async fighter(fighterPageUrl: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${sherdogBaseUrl}fighter/${fighterPageUrl}`),
    );

    this.saveFetchTimestamp('fighter');

    return data;
  }
}
