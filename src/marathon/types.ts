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
  date_from: string;
  date_to: string;
}>;

export type Stats = {
  titles_per_day?: number;
  eps_per_day?: number;
  quality_2160?: number;
  quality_1080?: number;
  quality_720?: number;
  quality_480?: number;
  quality_360?: number;
  total_titles?: number;
  total_eps?: number;
  total_size?: string;
  total_days?: number;
  start_date?: string;
  end_date?: string;
};
