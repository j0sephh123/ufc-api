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
  async getUpcomingEvent(): Promise<UpcomingEvent> {
    const data = await this.sherdogService.fetchSherdogEventsPage();
    const parsedData = this.parserService.sherdogEvents(data);

    return parsedData;
  }

  @Get('/upcomingMatches')
  async getUpcomingMatches(): Promise<{ matches: Match[] }> {
    const data = await this.sherdogService.fetchSherdogEventsPage();
    const parsedUpcomingEventUrl =
      this.parserService.sherdogUpcomingEventUrl(data);

    const sherdogUpcomingEventPage =
      await this.sherdogService.fetchSherdogUpcomingEventPage(
        parsedUpcomingEventUrl,
      );

    return {
      matches: this.parserService.sherdogUpcomingMatches(
        sherdogUpcomingEventPage,
      ),
    };
  }
}
