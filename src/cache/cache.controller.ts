import { Controller, Get } from '@nestjs/common';
import { CacheService } from 'src/services/cache.service';
import { generateEndpoint } from 'src/utils/routing';

@Controller(generateEndpoint('cache'))
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('lastFetched')
  getLastFetched() {
    return this.cacheService.getLastFetched();
  }

  @Get('items')
  getItems() {
    return this.cacheService.getItems();
  }
}
