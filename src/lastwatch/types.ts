// commit to change to lf
import type { Qualities } from "@components";

export type Data = Array<{
  id?: string;
  quality?: Qualities;
  title?: string;
  dateFinished?: string;
  rewatched?: boolean;
  rewatchCount?: number;
  filesize?: string;
  episodes?: number;
  ovas?: number;
  specials?: number;
  encoder?: string;
  release?: string;
  remarks?: string | null;
  rating?: number;
}>;

export type Stats = {
  dateLastEntry: string;
  daysLastEntry: number;
  dateOldestEntry: string;
  daysOldestEntry: number;
  totalEps: number;
  totalTitles: number;
  totalCours: number;
  titlesPerWeek: number;
  coursPerWeek: number;
  epsPerWeek: number;
  epsPerDay: number;
  hoursWatchedAvgPerWeek: number;
  hoursWatchedLastWeek: number;
  hoursWatchedLastTwoWeeks: number;
};

export const statsDefaultValues: Stats = {
  totalEps: 0,
  totalTitles: 0,
  totalCours: 0,
  daysLastEntry: 0,
  dateLastEntry: "",
  daysOldestEntry: 0,
  dateOldestEntry: "",
  titlesPerWeek: 0,
  coursPerWeek: 0,
  epsPerWeek: 0,
  epsPerDay: 0,
  hoursWatchedAvgPerWeek: 0,
  hoursWatchedLastWeek: 0,
  hoursWatchedLastTwoWeeks: 0,
};
