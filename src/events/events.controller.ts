import { Controller, Get } from '@nestjs/common';
import { SherdogService } from '../sherdog.service';
import { UpcomingEvent } from '../models';
import { ParserService } from '../parser.service';

@Controller('api/v1/events')
export class EventsController {
  constructor(
    private readonly sherdogService: SherdogService,
    private readonly parserService: ParserService,
  ) {}

  @Get('/upcoming')
  async upcomingEvent(): Promise<UpcomingEvent> {
    const sherdogEventsHtml = await this.sherdogService.events();
    const upcomingEvent = this.parserService.sherdogEvents(sherdogEventsHtml);

    const upcomingEventHtml = await this.sherdogService.upcomingEvent(
      upcomingEvent.sherdogUrl,
    );
    const upcomingEventMatches =
      this.parserService.sherdogUpcomingMatches(upcomingEventHtml);

    return { ...upcomingEvent, matches: upcomingEventMatches };
  }
}
