import { Controller, Get, Param, Query } from '@nestjs/common';
import { LastFetchedStaticKey } from '../models';
import { EventService } from './event.service';
import { generateEndpoint } from 'src/utils/routing';

export type EventType = 'upcoming' | 'recent';
export type EventSelectors = 'upcoming_tab' | 'recent_tab';

const mapEventType = <
  Record<EventType, [LastFetchedStaticKey, EventSelectors]>
>{
  recent: ['sherdog.recentEvent', 'recent_tab'],
  upcoming: ['sherdog.upcomingEvent', 'upcoming_tab'],
};

@Controller(generateEndpoint('event'))
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Get(':type')
  getEvents(@Param('type') type: EventType, @Query('cache') cache?: 'false') {
    const skipCache = cache === 'false';
    const [resourceKey, selector] = mapEventType[type];

    return this.eventService.getEvents(resourceKey, selector, skipCache);
  }

  @Get('sherdog/:sherdogUrl')
  async getEventFromSherdog(
    @Param('sherdogUrl') sherdogUrl: string,
    @Query('cache') cache?: 'false',
  ) {
    const skipCache = cache === 'false';

    return this.eventService.getEventFromSherdog(sherdogUrl, skipCache);
  }
}
