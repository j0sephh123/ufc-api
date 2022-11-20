import { Controller, Get, Query } from '@nestjs/common';
import { generateEndpoint } from 'src/utils/routing';
import { RankingsService } from './rankings.service';

@Controller(generateEndpoint('rankings'))
export class RankingsController {
  constructor(private readonly rankingsService: RankingsService) {}

  @Get('/')
  async getRankings(@Query('cache') cache?: 'false') {
    const skipCache = cache === 'false';

    return this.rankingsService.getRankings(skipCache);
  }
}
