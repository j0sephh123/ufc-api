import { Injectable } from '@nestjs/common';
import { ApiService } from 'src/services/api.service';
import { CacheService } from 'src/services/cache.service';
import { ParserService } from 'src/services/parser.service';
import { EventSelectors } from './event.controller';

@Injectable()
export class EventService {
  constructor(
    private readonly api: ApiService,
    private readonly parserService: ParserService,
    private readonly cacheService: CacheService,
  ) {}

  async getEventDetails(selector: EventSelectors) {
    const eventsHtml = await this.api.events();
    const event = this.parserService.events(eventsHtml, selector);
    const eventHtml = await this.api.event(event.sherdogUrl);
    const eventMatches = this.parserService.upcomingMatches(eventHtml);

    return { ...event, matches: eventMatches };
  }

  async fetchEvents(resourceKey: string, selector: EventSelectors) {
    const result = await this.getEventDetails(selector);
    this.cacheService.saveJson(result, resourceKey);
    return result;
  }

  async getEvents(
    resourceKey: string,
    selector: EventSelectors,
    skipCache: boolean,
  ) {
    if (skipCache || this.cacheService.isInvalid(resourceKey)) {
      return this.fetchEvents(resourceKey, selector);
    }

    return this.cacheService.get(resourceKey);
  }
}
