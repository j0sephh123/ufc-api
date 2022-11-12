import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import { UpcomingEvent } from './models';

@Injectable()
export class ParserService {
  sherdogEvents(data: string): UpcomingEvent {
    const $ = load(data);
    const [upcomingEvent] = $(
      '#upcoming_tab [itemtype="http://schema.org/Event"]',
    );

    const date = $(upcomingEvent)
      .find('[itemprop="startDate"]')
      .attr('content')
      .slice(0, 10);
    const sherdogUrl = $(upcomingEvent).find('[itemprop="url"]').attr('href');
    const name = $(upcomingEvent).find('[itemprop="name"]').text().trim();
    const location = $(upcomingEvent)
      .find('[itemprop="location"]')
      .text()
      .trim();

    return {
      date,
      sherdogUrl,
      name,
      location,
    };
  }
}
