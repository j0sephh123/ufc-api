import { Controller, Get, Param, Query } from '@nestjs/common';
import { FighterResponse } from 'src/models';
import { ApiService } from 'src/services/api.service';
import { CacheService } from 'src/services/cache.service';
import { ParserService } from 'src/services/parser.service';
import { generateHoursFromDays } from 'src/utils/generate';
import { generateEndpoint } from 'src/utils/routing';

@Controller(generateEndpoint('fighters'))
export class FightersController {
  constructor(
    private readonly apiService: ApiService,
    private readonly parserService: ParserService,
    private readonly cacheService: CacheService,
  ) {}

  @Get(':sherdogUrl')
  async single(
    @Param('sherdogUrl') sherdogUrl: string,
    @Query('cache') cache?: 'false',
  ) {
    const cacheInstance = this.cacheService.init(
      sherdogUrl,
      cache === 'false' ? 0 : generateHoursFromDays(2),
    );
    const cacheResult = cacheInstance.get() as FighterResponse | null;

    if (cacheResult) {
      return cacheResult;
    }

    const fightersHtml = await this.apiService.fighter(sherdogUrl);
    const response = this.parserService.fighter(fightersHtml);
    response.fighter.sherdogUrl = sherdogUrl;

    cacheInstance.saveJson(response);
    return response;
  }
}
