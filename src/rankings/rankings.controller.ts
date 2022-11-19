import { Controller, Get, Query } from '@nestjs/common';
import { LastFetchedStaticKey } from 'src/models';
import { CacheService } from 'src/services/cache.service';
import { generateEndpoint } from 'src/utils/routing';
import { RankingsService } from './rankings.service';

@Controller(generateEndpoint('rankings'))
export class RankingsController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly rankingsService: RankingsService,
  ) {}

  @Get('/')
  async get(@Query('cache') cache?: 'false') {
    const key: LastFetchedStaticKey = 'ufc.rankings';
    const skipCache = cache === 'false';

    if (skipCache) {
      return this.rankingsService.fetchRankings(key);
    }

    const cacheResult = this.cacheService.get(key);

    if (cacheResult) {
      return cacheResult;
    }

    return this.rankingsService.fetchRankings(key);
  }
}
