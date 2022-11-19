import { Controller, Get, Param, Query } from '@nestjs/common';
import { CacheService } from 'src/services/cache.service';
import { generateEndpoint } from 'src/utils/routing';
import { FightersService } from './fighters.service';

@Controller(generateEndpoint('fighters'))
export class FightersController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly fightersService: FightersService,
  ) {}

  @Get(':sherdogUrl')
  async single(
    @Param('sherdogUrl') sherdogUrl: string,
    @Query('cache') cache?: 'false',
  ) {
    const skipCache = cache === 'false';

    if (skipCache) {
      return this.fightersService.fetchFighters(sherdogUrl);
    }

    const cacheResult = this.cacheService.get(sherdogUrl);
    if (cacheResult) {
      return cacheResult;
    }

    return this.fightersService.fetchFighters(sherdogUrl);
  }
}
