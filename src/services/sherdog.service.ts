import { Injectable, Logger } from '@nestjs/common';
import { FetcherService } from './fetcher.service';

const sherdogBaseUrl = 'https://www.sherdog.com/';
const sherdogEventsUrl = `${sherdogBaseUrl}organizations/Ultimate-Fighting-Championship-UFC-2`;

@Injectable()
export class SherdogService {
  private readonly logger = new Logger(SherdogService.name);
  constructor(private readonly fetcher: FetcherService) {}

  events = (): Promise<string> => {
    this.logger.debug('fetching events...');

    return this.fetcher.fetch(sherdogEventsUrl);
  };

  event = (eventPageUrl: string): Promise<string> => {
    this.logger.debug('fetching event...');

    return this.fetcher.fetch(`${sherdogBaseUrl}${eventPageUrl}`);
  };

  fighter = (fighterPageUrl: string): Promise<string> => {
    this.logger.debug(`fetching fighter ${fighterPageUrl}...`);

    return this.fetcher.fetch(`${sherdogBaseUrl}fighter/${fighterPageUrl}`);
  };
}
