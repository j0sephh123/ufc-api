import { Controller, Get, Param } from '@nestjs/common';
import { EventDetails, ResourceKey } from '../models';
import { CacheService } from 'src/services/cache.service';
import { EventsService } from './events.service';

export type EventType = 'upcoming' | 'recent';
export type EventSelectors = 'upcoming_tab' | 'recent_tab';

const mapEventType = <Record<EventType, [ResourceKey, EventSelectors]>>{
  recent: ['sherdog.recentEvent', 'recent_tab'],
  upcoming: ['sherdog.upcomingEvent', 'upcoming_tab'],
};

@Controller('api/v1/events')
export class EventsController {
  constructor(
    private readonly cache: CacheService,
    private readonly eventsService: EventsService,
  ) {}

  @Get(':type')
  async single(@Param('type') type: EventType): Promise<EventDetails> {
    const [resourceKey, selector] = mapEventType[type];
    const cacheResult = this.cache.get(resourceKey) as EventDetails | null;
    this.cache.saveTimestamp(resourceKey);

    if (!cacheResult) {
      const result = await this.eventsService.getEventDetails(selector);
      this.cache.saveJson(resourceKey, result);
      return result;
    }

    return cacheResult;
  }
}
