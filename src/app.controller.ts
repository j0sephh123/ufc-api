import { Controller, Get } from '@nestjs/common';
import { SherdogService } from './sherdog.service';
import { Match, UpcomingEvent } from './models';
import { ParserService } from './parser.service';

@Controller('api/v1/events')
export class AppController {
  constructor(
    private readonly sherdogService: SherdogService,
    private readonly parserService: ParserService,
  ) {}

  @Get('/upcoming')
  async upcomingEvent(): Promise<UpcomingEvent> {
    const data = await this.sherdogService.events();
    const parsedData = this.parserService.sherdogEvents(data);

    return parsedData;
  }

  @Get('/upcomingMatches')
  async upcomingMatches(): Promise<{ matches: Match[] }> {
    const eventsHtml = await this.sherdogService.events();
    const upcomingEventUrl = this.parserService.upcomingEventUrl(eventsHtml);
    const upcomingEventHtml = await this.sherdogService.upcomingEvent(
      upcomingEventUrl,
    );

    return {
      matches: this.parserService.sherdogUpcomingMatches(upcomingEventHtml),
    };
  }
}
