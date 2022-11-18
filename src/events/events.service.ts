import { Injectable } from '@nestjs/common';
import { ParserService } from 'src/services/parser.service';
import { SherdogService } from 'src/services/sherdog.service';
import { EventSelectors } from './events.controller';

@Injectable()
export class EventsService {
  constructor(
    private readonly sherdogService: SherdogService,
    private readonly parserService: ParserService,
  ) {}

  async getEventDetails(selector: EventSelectors) {
    const eventsHtml = await this.sherdogService.events();
    const event = this.parserService.events(eventsHtml, selector);
    const eventHtml = await this.sherdogService.event(event.sherdogUrl);
    const eventMatches = this.parserService.upcomingMatches(eventHtml);

    return { ...event, matches: eventMatches };
  }
}
