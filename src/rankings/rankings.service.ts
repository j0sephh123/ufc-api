import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/services/api.service';
import { CacheService } from 'src/services/cache.service';
import { ParserService } from 'src/services/parser.service';

@Injectable()
export class RankingsService {
  constructor(
    private readonly apiService: ApiService,
    private readonly parserService: ParserService,
    private readonly cacheService: CacheService,
  ) {}

  async fetchRankings(key: string) {
    const rankingsHtml = await this.apiService.rankings();
    const response = this.parserService.rankings(rankingsHtml);

    this.cacheService.saveJson(response, key);
    return response;
  }
}
