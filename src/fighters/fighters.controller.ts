import { Controller, Get, Param, Query } from '@nestjs/common';
import { generateEndpoint } from 'src/utils/routing';
import { FightersService } from './fighters.service';

@Controller(generateEndpoint('fighters'))
export class FightersController {
  constructor(private readonly fightersService: FightersService) {}

  @Get(':sherdogUrl')
  async getFighter(
    @Param('sherdogUrl') sherdogUrl: string,
    @Query('cache') cache?: 'false',
  ) {
    const skipCache = cache === 'false';

    return this.fightersService.getFighters(sherdogUrl, skipCache);
  }
}
