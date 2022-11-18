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

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  controllers: [EventsController, FightersController, YoutubeController],
  providers: [SherdogService, ParserService, FsService, YoutubeService, CacheService, EventsService],
})
export class AppModule {}
