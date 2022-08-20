import type { Qualities } from "@components";

export type Data = Array<{
  id?: string;
  quality?: Qualities;
  title?: string;
  dateFinished?: string;
  rewatched?: boolean;
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
  dateLastEntry?: string;
  daysLastEntry?: number;
  dateOldestEntry?: string;
  daysOldestEntry?: number;
  totalEps?: number;
  totalTitles?: number;
  totalCours?: number;
  titlesPerWeek?: number;
  coursPerWeek?: number;
  epsPerWeek?: number;
  epsPerDay?: number;
}
