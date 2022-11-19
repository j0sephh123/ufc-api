import { Controller, Get, Param, Query } from '@nestjs/common';
import { LastFetchedStaticKey } from '../models';
import { CacheService } from 'src/services/cache.service';
import { EventsService } from './events.service';
import { generateEndpoint } from 'src/utils/routing';

export type EventType = 'upcoming' | 'recent';
export type EventSelectors = 'upcoming_tab' | 'recent_tab';

const mapEventType = <
  Record<EventType, [LastFetchedStaticKey, EventSelectors]>
>{
  recent: ['sherdog.recentEvent', 'recent_tab'],
  upcoming: ['sherdog.upcomingEvent', 'upcoming_tab'],
};

@Controller(generateEndpoint('events'))
export class EventsController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly eventsService: EventsService,
  ) {}

  @Get(':type')
  async single(
    @Param('type') type: EventType,
    @Query('cache') cache?: 'false',
  ) {
    const skipCache = cache === 'false';
    const [resourceKey, selector] = mapEventType[type];

    if (skipCache) {
      return this.eventsService.fetchEvents(resourceKey, selector);
    }

    const cacheResult = this.cacheService.get(resourceKey);
    if (cacheResult) {
      return cacheResult;
    }

    return this.eventsService.fetchEvents(resourceKey, selector);
  }
}
