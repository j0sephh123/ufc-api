import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { SherdogService } from './sherdog.service';
import { ParserService } from './parser.service';

@Module({
  imports: [HttpModule],
  controllers: [AppController],
  providers: [SherdogService, ParserService],
})
export class AppModule {}
