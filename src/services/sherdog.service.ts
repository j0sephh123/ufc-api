import { Injectable } from '@nestjs/common';
import { FetcherService } from './fetcher.service';

const sherdogBaseUrl = 'https://www.sherdog.com/';
const sherdogEventsUrl = `${sherdogBaseUrl}organizations/Ultimate-Fighting-Championship-UFC-2`;

@Injectable()
export class SherdogService {
  constructor(private readonly fetcher: FetcherService) {}

  events = (): Promise<string> => this.fetcher.fetch(sherdogEventsUrl);

  event = (eventPageUrl: string): Promise<string> =>
    this.fetcher.fetch(`${sherdogBaseUrl}${eventPageUrl}`);

  fighter = (fighterPageUrl: string): Promise<string> =>
    this.fetcher.fetch(`${sherdogBaseUrl}fighter/${fighterPageUrl}`);
}
