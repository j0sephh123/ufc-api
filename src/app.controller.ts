import { Controller, Get } from '@nestjs/common';
import { SherdogService } from './sherdog.service';
import { UpcomingEvent } from './models';
import { ParserService } from './parser.service';

@Controller()
export class AppController {
  constructor(
    private readonly sherdogService: SherdogService,
    private readonly parserService: ParserService,
  ) {}

  @Get()
  async getUpcomingEvent(): Promise<UpcomingEvent> {
    const data = await this.sherdogService.fetchSherdogEventsPage();
    const parsedData = this.parserService.sherdogEvents(data);

    return parsedData;
  }
}
