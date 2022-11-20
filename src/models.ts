export type EventDetails = {
  sherdogUrl: string;
  date: string;
  name: string;
  location: string;
  matches?: Match[];
};

export type Fighter = {
  name: string;
  sherdogUrl: string;
};
type Category = string; // for now
export type Match = {
  fighters: [Fighter, Fighter];
  category: Category;
};

type Event = {
  name: string;
  sherdogUrl: string;
  date: string;
};
export type Round = 1 | 2 | 3 | 4 | 5;
export type FighterPastMatch = {
  outcome: string;
  opponent: Fighter;
  event: Event;
  method: string;
  round: Round;
  time: string;
};
export type FighterResponse = {
  list: FighterPastMatch[];
  fighter: Fighter;
};

export type LastFetchedStaticKey =
  | 'sherdog.upcomingEvent'
  | 'sherdog.recentEvent'
  | 'ufc.rankings';

export type Endpoint = 'event' | 'fighters' | 'rankings' | 'youtube' | 'cache';
