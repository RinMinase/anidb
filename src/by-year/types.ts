import type { Qualities } from "@components";

export type Data = {
  winter?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;

  spring?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;

  summer?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;

  fall?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;

  uncategorized?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;
};

export type YearData = Array<{
  year: number | null;
  seasons: null | {
    uncategorized?: number;
    winter?: number;
    spring?: number;
    summer?: number;
    fall?: number;
  };
  count: number | null;
}>;
