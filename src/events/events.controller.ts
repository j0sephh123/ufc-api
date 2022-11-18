import { Controller, Get, Param } from '@nestjs/common';
import { EventDetails, LastFetchedStaticKey } from '../models';
import { CacheService } from 'src/services/cache.service';
import { EventsService } from './events.service';

export type EventType = 'upcoming' | 'recent';
export type EventSelectors = 'upcoming_tab' | 'recent_tab';

const mapEventType = <
  Record<EventType, [LastFetchedStaticKey, EventSelectors]>
>{
  recent: ['sherdog.recentEvent', 'recent_tab'],
  upcoming: ['sherdog.upcomingEvent', 'upcoming_tab'],
};

@Controller('api/v1/events')
export class EventsController {
  constructor(
    private readonly cacheService: CacheService,
    private readonly eventsService: EventsService,
  ) {}

  @Get(':type')
  async single(@Param('type') type: EventType): Promise<EventDetails> {
    const [resourceKey, selector] = mapEventType[type];
    const cache = this.cacheService.init(resourceKey);
    const cacheResult = cache.get() as EventDetails | null;
    cache.saveTimestamp();

    if (cacheResult) {
      return cacheResult;
    }

    const result = await this.eventsService.getEventDetails(selector);
    cache.saveJson(result);
    return result;
  }
}
