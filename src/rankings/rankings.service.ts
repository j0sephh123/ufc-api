import { Injectable } from '@nestjs/common';
import { LastFetchedStaticKey } from 'src/models';
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

  key: LastFetchedStaticKey = 'ufc.rankings';

  private async fetchRankings() {
    const rankingsHtml = await this.apiService.rankings();
    const response = this.parserService.rankings(rankingsHtml);

    this.cacheService.saveJson(response, this.key);
    return response;
  }

  async getRankings(skipCache: boolean) {
    if (skipCache || this.cacheService.isInvalid(this.key)) {
      return this.fetchRankings();
    }

    return this.cacheService.get(this.key);
  }
}
