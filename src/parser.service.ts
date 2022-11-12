import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import { Fighter, Match, UpcomingEvent } from './models';

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

  sherdogUpcomingEventUrl(data: string) {
    const $ = load(data);
    const [upcomingEvent] = $(
      '#upcoming_tab [itemtype="http://schema.org/Event"]',
    );

    const sherdogUrl = $(upcomingEvent).find('[itemprop="url"]').attr('href');

    return sherdogUrl;
  }

  sherdogUpcomingMatches(data: string): Match[] {
    const $ = load(data);

    return $("[itemProp='subEvent']")
      .toArray()
      .map((event, index) => {
        const category = $(event).find('.weight_class').text();

        if (index > 0) {
          const fighters = $(event)
            .find('.fighter_result_data')
            .toArray()
            .map((fighter) => ({
              sherdogUrl: $(fighter).find("[itemprop='url']").attr('href'),
              name: $(fighter)
                .find("[itemprop='name']")
                .html()
                .replace('<br>', ' '),
            })) as [Fighter, Fighter];

          return {
            category,
            fighters,
          };
        }

        const fighters = $(event)
          .find('.fight_card h3')
          .toArray()
          .map((fighter) => ({
            sherdogUrl: $(fighter).find('a').attr('href'),
            name: $(fighter).find("[itemprop='name']").text(),
          })) as [Fighter, Fighter];

        return {
          category,
          fighters,
        };
      });
  }
}
