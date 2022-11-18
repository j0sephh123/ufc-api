import { Injectable } from '@nestjs/common';
import { load } from 'cheerio';
import {
  Fighter,
  Match,
  Round,
  EventDetails,
  FighterResponse,
} from '../models';

const selectors = {
  sherdog: {
    url: '[itemprop="url"]',
    name: '[itemprop="name"]',
    startDate: '[itemprop="startDate"]',
    location: '[itemprop="location"]',
    subEvent: '[itemprop="subEvent"]',
    event: '[itemtype="http://schema.org/Event"]',
  },
};

@Injectable()
export class ParserService {
  private ufcRankings(data: string) {
    const $ = load(data);
    const divisions = $('.views-table').toArray().slice(0, -1);

    return divisions.map((division) => ({
      label: $(division).find('h4').text(),
      topFighter: $(division).find('h5 a').text(),
      fighters: $(division)
        .find('.views-field-title')
        .toArray()
        .map((fighterEl) => $(fighterEl).find('a').text()),
    }));
  }

  private sherdogFighter(data: string) {
    const $ = load(data);

    return {
      fighter: {
        name: $(".fighter-title [itemprop='name'] .fn").text(),
        sherdogUrl: 'our fighter sherdogUrl',
      },
      list: $('.fight_history tr:not(.table_head)')
        .toArray()
        .map((el) => {
          const [outcomeTd, fighterTd, eventTd, methodTd, round, time] =
            $(el).find('td');

          return {
            outcome: $(outcomeTd).find('.final_result').text(),
            event: {
              date: $(eventTd).find('.sub_line').text(),
              name: $(eventTd).find('a').text(),
              sherdogUrl: $(eventTd).find('a').attr('href'),
            },
            method: $(methodTd).children().first().text(),
            opponent: {
              name: $(fighterTd).find('a').text(),
              sherdogUrl: $(fighterTd).find('a').attr('href'),
            },
            round: +$(round).text() as Round,
            time: $(time).text(),
          };
        }),
    };
  }

  private sherdogUpcomingMatches(data: string) {
    const $ = load(data);

    return $(selectors.sherdog.subEvent)
      .toArray()
      .map((event, index) => {
        const category = $(event).find('.weight_class').text();

        if (index > 0) {
          const fighters = $(event)
            .find('.fighter_result_data')
            .toArray()
            .map((fighter) => ({
              sherdogUrl: $(fighter).find(selectors.sherdog.url).attr('href'),
              name: $(fighter)
                .find(selectors.sherdog.name)
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

  private sherdogEvents(data: string, selector: string) {
    const $ = load(data);
    const [event] = $(`#${selector} ${selectors.sherdog.event}`);

    const date = $(event)
      .find(selectors.sherdog.startDate)
      .attr('content')
      .slice(0, 10);
    const sherdogUrl = $(event).find(selectors.sherdog.url).attr('href');
    const name = $(event).find(selectors.sherdog.name).text().trim();
    const location = $(event).find(selectors.sherdog.location).text().trim();

    return {
      date,
      sherdogUrl,
      name,
      location,
    };
  }

  events = (data: string, selector: string): EventDetails =>
    this.sherdogEvents(data, selector);
  upcomingMatches = (data: string): Match[] =>
    this.sherdogUpcomingMatches(data);
  fighter = (data: string): FighterResponse => this.sherdogFighter(data);
  rankings = (data: string) => this.ufcRankings(data);
}
