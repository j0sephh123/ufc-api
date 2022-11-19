import { Injectable } from '@nestjs/common';
import { FetcherService } from './fetcher.service';

const rankingsUrl = 'https://www.ufc.com/rankings';

@Injectable()
export class UfcService {
  constructor(private readonly fetcher: FetcherService) {}

  async rankings(): Promise<string> {
    return this.fetcher.fetch(rankingsUrl);
  }
}
