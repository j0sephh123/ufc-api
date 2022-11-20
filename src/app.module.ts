import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { EventController } from './event/event.controller';
import { FightersController } from './fighters/fighters.controller';

import { SherdogService } from './services/sherdog.service';
import { ParserService } from './services/parser.service';
import { FsService } from './services/fs.service';
import { YoutubeService } from './services/youtube.service';
import { YoutubeController } from './youtube/youtube.controller';
import { CacheService } from './services/cache.service';
import { EventService } from './event/event.service';
import { RankingsController } from './rankings/rankings.controller';
import { UfcService } from './services/ufc.service';
import { ApiService } from './services/api.service';
import { FetcherService } from './services/fetcher.service';
import { FightersService } from './fighters/fighters.service';
import { RankingsService } from './rankings/rankings.service';
import { CacheController } from './cache/cache.controller';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [
    EventController,
    FightersController,
    YoutubeController,
    RankingsController,
    CacheController,
  ],
  providers: [
    SherdogService,
    ParserService,
    FsService,
    YoutubeService,
    CacheService,
    EventService,
    UfcService,
    ApiService,
    FetcherService,
    FightersService,
    RankingsService,
  ],
})
export class AppModule {}
