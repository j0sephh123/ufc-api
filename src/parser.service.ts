import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import { Fighter, Match, UpcomingEvent } from './models';

const selectors = {
  url: '[itemprop="url"]',
  name: '[itemprop="name"]',
  startDate: '[itemprop="startDate"]',
  location: '[itemprop="location"]',
  subEvent: '[itemprop="subEvent"]',
  event: '[itemtype="http://schema.org/Event"]',
};

@Injectable()
export class ParserService {
  public sherdogEvents(data: string): UpcomingEvent {
    const $ = load(data);
    const [upcomingEvent] = $(`#upcoming_tab ${selectors.event}`);

    const date = $(upcomingEvent)
      .find(selectors.startDate)
      .attr('content')
      .slice(0, 10);
    const sherdogUrl = $(upcomingEvent).find(selectors.url).attr('href');
    const name = $(upcomingEvent).find(selectors.name).text().trim();
    const location = $(upcomingEvent).find(selectors.location).text().trim();

    return {
      date,
      sherdogUrl,
      name,
      location,
    };
  }

  public upcomingEventUrl(data: string) {
    const $ = load(data);
    const [upcomingEvent] = $(`#upcoming_tab ${selectors.event}`);

    return $(upcomingEvent).find(selectors.url).attr('href');
  }

  public sherdogUpcomingMatches(data: string): Match[] {
    const $ = load(data);

    return $(selectors.subEvent)
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
