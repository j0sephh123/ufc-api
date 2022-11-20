import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/services/api.service';
import { CacheService } from 'src/services/cache.service';
import { ParserService } from 'src/services/parser.service';

@Injectable()
export class FightersService {
  constructor(
    private readonly apiService: ApiService,
    private readonly parserService: ParserService,
    private readonly cacheService: CacheService,
  ) {}

  async fetchFighters(sherdogUrl: string) {
    const fightersHtml = await this.apiService.fighter(sherdogUrl);
    const response = this.parserService.fighter(fightersHtml);
    response.fighter.sherdogUrl = sherdogUrl;
    this.cacheService.saveJson(response, sherdogUrl);
    return response;
  }

  async getFighters(key: string, skipCache: boolean) {
    if (skipCache || this.cacheService.isInvalid(key)) {
      return this.fetchFighters(key);
    }

    return this.cacheService.get(key);
  }
}
