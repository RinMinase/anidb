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

export type FullData = {
  id?: string;
  quality?: string;
  id_quality?: number;
  quality_color?: string;
  title?: string;

  dateInitFinished?: string;
  dateLastFinished?: string;

  duration?: string;
  filesize?: string;
  episodes?: number;
  ovas?: number;
  specials?: number;
  seasonNumber?: number;
  seasonFirstTitle?: string;

  prequel?: {
    id: string;
    title: string;
  };

  sequel?: {
    id: string;
    title: string;
  };

  offquels?: Array<{
    id: string;
    title: string;
  }>;

  encoder?: string;
  encoderVideo?: string | null;
  encoderAudio?: string | null;
  encoderSubs?: string | null;

  releaseSeason?: string;
  release?: string;
  variants?: string | null;
  remarks?: string | null;

  codecHDR?: number;
  codecVideo?: string;
  codecAudio?: string;

  rewatches?: Array<{
    id: string;
    dateIso: string;
    date: string;
  }>;

  ratingAverage?: number;
  rating?: {
    audio: number;
    enjoyment: number;
    graphics: number;
    plot: number;
  };

  image?: string;
};

export type AutofillProps = {
  encoderVideo?: string;
  encoderAudio?: string;
  encoderSub?: string;
  episodes?: number;
  filesize?: number;
  durationSec?: number;
  durationMin?: number;
  durationHr?: number;
};

export type TitleObjects = Array<{
  id: string;
  title: string;
}>;

export type TitleObject = {
  id: string;
  title: string;
};

export type MalTitle = {
  url: string;
  title: string;
  synonyms: string;
  episodes: number;
  premiered: string;
};
