import { Controller, Get, Param } from '@nestjs/common';
import { CacheService } from 'src/services/cache.service';
import { generateEndpoint } from 'src/utils/routing';

@Controller(generateEndpoint('cache'))
export class CacheController {
  constructor(private readonly cacheService: CacheService) {}

  @Get('lastFetched')
  getLastFetched() {
    return this.cacheService.getLastFetched();
  }

  @Get('files')
  getFiles() {
    return this.cacheService.getFiles();
  }

  @Get('files/:fileName')
  getFile(@Param('fileName') fileName: string) {
    return this.cacheService.getFile(fileName);
  }
}
