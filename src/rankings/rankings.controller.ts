import { Controller, Get } from '@nestjs/common';
import { LastFetchedStaticKey } from 'src/models';
import { ApiService } from 'src/services/api.service';
import { CacheService } from 'src/services/cache.service';
import { ParserService } from 'src/services/parser.service';

@Controller('api/v1/rankings')
export class RankingsController {
  constructor(
    private readonly api: ApiService,
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

    const rankingsHtml = await this.api.rankings();
    const response = this.parser.rankings(rankingsHtml);

    cache.saveJson(response);
    return response;
  }
}
