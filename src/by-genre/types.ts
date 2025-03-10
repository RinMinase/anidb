import type { Qualities } from "@components";

type GenreData = {
  id: number;
  genre: string;
};

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
  genres: Array<GenreData>;
}>;

export type GenreStatData = {
  genre: string;
  count: number;
};

export type Stats = Array<GenreStatData>;
