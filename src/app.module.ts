import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SherdogService } from './sherdog.service';
import { ParserService } from './parser.service';
import { EventsController } from './events/events.controller';
import { FightersController } from './fighters/fighters.controller';

@Module({
  imports: [HttpModule],
  controllers: [EventsController, FightersController],
  providers: [SherdogService, ParserService],
})
export class AppModule {}
