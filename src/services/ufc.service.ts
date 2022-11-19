import { Injectable, Logger } from '@nestjs/common';
import { FetcherService } from './fetcher.service';

const rankingsUrl = 'https://www.ufc.com/rankings';

@Injectable()
export class UfcService {
  private readonly logger = new Logger(UfcService.name);

  constructor(private readonly fetcher: FetcherService) {}

  async rankings(): Promise<string> {
    this.logger.debug('Fetching rankings...');

    return this.fetcher.fetch(rankingsUrl);
  }
}
