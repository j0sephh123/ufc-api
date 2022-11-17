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

  async getEventDetails(selector: string) {
    const event = this.parserService.sherdogEvents(
      await this.sherdogService.events(),
      selector,
    );

    const upcomingEventHtml = await this.sherdogService.event(event.sherdogUrl);
    const upcomingEventMatches =
      this.parserService.sherdogUpcomingMatches(upcomingEventHtml);

    return { ...event, matches: upcomingEventMatches };
  }

  @Get('/upcoming')
  async upcomingEvent(): Promise<EventDetails> {
    return this.getEventDetails(selectors.upcomingEvent);
  }
  @Get('/recent')
  async recentEvent(): Promise<EventDetails> {
    return this.getEventDetails(selectors.recentEvent);
  }
}
