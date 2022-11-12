import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { load } from 'cheerio';
import { firstValueFrom } from 'rxjs';
import { UpcomingEvent } from './models';

const sherdogEventsUrl =
  'https://www.sherdog.com/organizations/Ultimate-Fighting-Championship-UFC-2';

@Injectable()
export class AppService {
  constructor(private readonly httpService: HttpService) {}

  async getUpcomingEvent(): Promise<UpcomingEvent> {
    const { data } = await firstValueFrom(
      this.httpService.get(sherdogEventsUrl),
    );
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
