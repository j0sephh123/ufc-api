import { Controller, Get, Query } from '@nestjs/common';
import { LastFetchedStaticKey } from 'src/models';
import { ApiService } from 'src/services/api.service';
import { CacheService } from 'src/services/cache.service';
import { ParserService } from 'src/services/parser.service';
import { generateHoursFromDays } from 'src/utils/generate';
import { generateEndpoint } from 'src/utils/routing';

@Controller(generateEndpoint('rankings'))
export class RankingsController {
  constructor(
    private readonly api: ApiService,
    private readonly parser: ParserService,
    private readonly cacheService: CacheService,
  ) {}

  @Get('/')
  async get(@Query('cache') cache?: 'false') {
    const key: LastFetchedStaticKey = 'ufc.rankings';
    const cacheInstance = this.cacheService.init(
      key,
      cache === 'false' ? 0 : generateHoursFromDays(5),
    );
    const cacheResult = cacheInstance.get();
    cacheInstance.saveTimestamp();

    if (cacheResult) {
      return cacheResult;
    }

    const rankingsHtml = await this.api.rankings();
    const response = this.parser.rankings(rankingsHtml);

    cacheInstance.saveJson(response);
    return response;
  }
}
