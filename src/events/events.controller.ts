import { Controller, Get } from '@nestjs/common';
import { SherdogService } from '../sherdog.service';
import { EventDetails } from '../models';
import { ParserService } from '../parser.service';

const selectors = {
  upcomingEvent: 'upcoming_tab',
  recentEvent: 'recent_tab',
};

@Controller('api/v1/events')
export class EventsController {
  constructor(
    private readonly sherdogService: SherdogService,
    private readonly parserService: ParserService,
  ) {}

  @Get('/upcoming')
  async upcomingEvent(): Promise<EventDetails> {
    const sherdogEventsHtml = await this.sherdogService.events();
    const upcomingEvent = this.parserService.sherdogEvents(
      sherdogEventsHtml,
      selectors.upcomingEvent,
    );

    const upcomingEventHtml = await this.sherdogService.upcomingEvent(
      upcomingEvent.sherdogUrl,
    );
    const upcomingEventMatches =
      this.parserService.sherdogUpcomingMatches(upcomingEventHtml);

    return { ...upcomingEvent, matches: upcomingEventMatches };
  }
  @Get('/recent')
  async recentEvent(): Promise<EventDetails> {
    const sherdogEventsHtml = await this.sherdogService.events();
    const upcomingEvent = this.parserService.sherdogEvents(
      sherdogEventsHtml,
      selectors.recentEvent,
    );

    const upcomingEventHtml = await this.sherdogService.upcomingEvent(
      upcomingEvent.sherdogUrl,
    );
    const upcomingEventMatches =
      this.parserService.sherdogUpcomingMatches(upcomingEventHtml);

    return { ...upcomingEvent, matches: upcomingEventMatches };
  }
}
