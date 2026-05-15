export type AppStep =
  | 'loading'
  | 'introduce'
  | 'login'
  | 'home'
  | 'great'
  | 'sad'
  | 'understanding'
  | 'free-date'
  | 'proposal'
  | 'excited'
  | 'end';

export interface DateSelection {
  date: string;
  time: string;
}

export type DateActivity =
  | 'walk'
  | 'movie'
  | 'meal'
  | 'game'
  | 'other'
  | 'photos';
