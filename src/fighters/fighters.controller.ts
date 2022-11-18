import { Controller, Get, Param } from '@nestjs/common';
import { FighterResponse } from 'src/models';
import { ApiService } from 'src/services/api.service';
import { CacheService } from 'src/services/cache.service';
import { ParserService } from 'src/services/parser.service';
import { generateEndpoint } from 'src/utils/routing';

@Controller(generateEndpoint('fighters'))
export class FightersController {
  constructor(
    private readonly apiService: ApiService,
    private readonly parserService: ParserService,
    private readonly cacheService: CacheService,
  ) {}

  @Get(':sherdogUrl')
  async single(@Param('sherdogUrl') sherdogUrl: string) {
    const cache = this.cacheService.init(sherdogUrl);
    const cacheResult = cache.get() as FighterResponse | null;
    cache.saveTimestamp();

    if (cacheResult) {
      return cacheResult;
    }

    const fightersHtml = await this.apiService.fighter(sherdogUrl);
    const response = this.parserService.fighter(fightersHtml);
    response.fighter.sherdogUrl = sherdogUrl;

    cache.saveJson(response);
    return response;
  }
}
