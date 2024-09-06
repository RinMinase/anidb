import type { Qualities } from "@components";

export type Data = Array<{
  id: string;
  quality: Qualities;
  title: string;
  filesize: string;
  dateFinished?: string;
  rewatched?: boolean;
  episodes?: number;
  ovas?: number;
  specials?: number;
}>;

export type Sequences = Array<{
  id: number;
  title: string;
  dateFrom: string;
  dateTo: string;
}>;

export type Stats = {
  titlesPerDay?: number;
  epsPerDay?: number;
  quality2160?: number;
  quality1080?: number;
  quality720?: number;
  quality480?: number;
  quality360?: number;
  totalTitles?: number;
  totalEps?: number;
  totalSize?: string;
  totalDays?: number;
  startDate?: string;
  endDate?: string;
};
