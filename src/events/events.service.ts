import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/services/api.service';
import { ParserService } from 'src/services/parser.service';
import { EventSelectors } from './events.controller';

@Injectable()
export class EventsService {
  constructor(
    private readonly api: ApiService,
    private readonly parserService: ParserService,
  ) {}

  async getEventDetails(selector: EventSelectors) {
    const eventsHtml = await this.api.events();
    const event = this.parserService.events(eventsHtml, selector);
    const eventHtml = await this.api.event(event.sherdogUrl);
    const eventMatches = this.parserService.upcomingMatches(eventHtml);

    return { ...event, matches: eventMatches };
  }
}
