import { Controller, Get } from '@nestjs/common';
import { LastFetchedStaticKey } from 'src/models';
import { CacheService } from 'src/services/cache.service';
import { ParserService } from 'src/services/parser.service';
import { UfcService } from 'src/services/ufc.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(
    private readonly ufc: UfcService,
    private readonly parser: ParserService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('/')
  async get() {
    const key: LastFetchedStaticKey = 'ufc.rankings';
    const cache = this.cacheService.init(key);
    const cacheResult = cache.get();
    cache.saveTimestamp();

    if (cacheResult) {
      return cacheResult;
    }

    const rankingsHtml = await this.ufc.rankings();
    const response = this.parser.ufcRankings(rankingsHtml);

    cache.saveJson(response);
    return response;
  }
}
