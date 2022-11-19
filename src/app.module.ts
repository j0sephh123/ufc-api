import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';

import { EventsController } from './events/events.controller';
import { FightersController } from './fighters/fighters.controller';

import { SherdogService } from './services/sherdog.service';
import { ParserService } from './services/parser.service';
import { FsService } from './services/fs.service';
import { YoutubeService } from './services/youtube.service';
import { YoutubeController } from './youtube/youtube.controller';
import { CacheService } from './services/cache.service';
import { EventsService } from './events/events.service';
import { RankingsController } from './rankings/rankings.controller';
import { UfcService } from './services/ufc.service';
import { ApiService } from './services/api.service';
import { FetcherService } from './services/fetcher.service';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [
    EventsController,
    FightersController,
    YoutubeController,
    RankingsController,
  ],
  providers: [
    SherdogService,
    ParserService,
    FsService,
    YoutubeService,
    CacheService,
    EventsService,
    UfcService,
    ApiService,
    FetcherService,
  ],
})
export class AppModule {}
