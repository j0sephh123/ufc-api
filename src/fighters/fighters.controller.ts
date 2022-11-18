import { Controller, Get, Param } from '@nestjs/common';
import { FighterResponse } from 'src/models';
import { CacheService } from 'src/services/cache.service';
import { ParserService } from 'src/services/parser.service';
import { SherdogService } from 'src/services/sherdog.service';

@Controller('api/v1/fighters')
export class FightersController {
  constructor(
    private readonly sherdogService: SherdogService,
    private readonly parserService: ParserService,
    private readonly cacheService: CacheService,
  ) {}

  @Get(':sherdogUrl')
  async single(@Param('sherdogUrl') sherdogUrl: string) {
    const cache = this.cacheService.init(sherdogUrl);
    const cacheResult = cache.get() as FighterResponse | null;
    cache.saveTimestamp();

    if (!cacheResult) {
      const fightersHtml = await this.sherdogService.fighter(sherdogUrl);
      const response = this.parserService.sherdogFighter(fightersHtml);
      response.fighter.sherdogUrl = sherdogUrl;

      cache.saveJson(response);
      return response;
    }

    return cacheResult;
  }
}
