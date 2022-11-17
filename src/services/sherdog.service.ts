import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
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

  async events(): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(sherdogEventsUrl),
    );

    this.fsService.saveFetchTimestamp('sherdog.events');

    return data;
  }

  async event(eventPageUrl: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${sherdogBaseUrl}${eventPageUrl}`),
    );

    this.fsService.saveFetchTimestamp('sherdog.event');

    return data;
  }

  async fighter(fighterPageUrl: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${sherdogBaseUrl}fighter/${fighterPageUrl}`),
    );

    this.fsService.saveFetchTimestamp('sherdog.fighter');

    return data;
  }
}
