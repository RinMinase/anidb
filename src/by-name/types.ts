import type { Qualities } from "@components";

export type Stats = Array<{
  letter: string;
  titles: number;
  filesize: string;
}>;

export type Data = Array<{
  id: string;
  quality: Qualities;
  title: string;
  filesize: string;
}>;
