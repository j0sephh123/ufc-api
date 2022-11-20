import { Controller, Get, Param, Query } from '@nestjs/common';
import { LastFetchedStaticKey } from '../models';
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
  constructor(private readonly eventsService: EventsService) {}

  @Get(':type')
  async getEvents(
    @Param('type') type: EventType,
    @Query('cache') cache?: 'false',
  ) {
    const skipCache = cache === 'false';
    const [resourceKey, selector] = mapEventType[type];

    return this.eventsService.getEvents(resourceKey, selector, skipCache);
  }
}
