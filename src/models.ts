export type UpcomingEvent = {
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
