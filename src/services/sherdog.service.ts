import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { CacheService } from './cache.service';

const sherdogBaseUrl = 'https://www.sherdog.com/';
const sherdogEventsUrl = `${sherdogBaseUrl}organizations/Ultimate-Fighting-Championship-UFC-2`;

@Injectable()
export class SherdogService {
  constructor(
    private readonly httpService: HttpService,
    private readonly cache: CacheService,
  ) {}

  async events(): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(sherdogEventsUrl),
    );

    return data;
  }

  async event(eventPageUrl: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${sherdogBaseUrl}${eventPageUrl}`),
    );

    return data;
  }

  async fighter(fighterPageUrl: string): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService.get(`${sherdogBaseUrl}fighter/${fighterPageUrl}`),
    );

    return data;
  }
}
