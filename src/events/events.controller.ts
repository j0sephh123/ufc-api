import { Controller, Get, Param, Query } from '@nestjs/common';
import { EventDetails, LastFetchedStaticKey } from '../models';
import { CacheService } from 'src/services/cache.service';
import { EventsService } from './events.service';
import { generateEndpoint } from 'src/utils/routing';
import { generateHoursFromDays } from 'src/utils/generate';

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
  ): Promise<EventDetails> {
    const [resourceKey, selector] = mapEventType[type];
    const cacheInstance = this.cacheService.init(
      resourceKey,
      cache === 'false' ? 0 : generateHoursFromDays(2),
    );
    const cacheResult = cacheInstance.get() as EventDetails | null;

    if (cacheResult) {
      return cacheResult;
    }

    const result = await this.eventsService.getEventDetails(selector);

    cacheInstance.saveJson(result);
    return result;
  }
}
