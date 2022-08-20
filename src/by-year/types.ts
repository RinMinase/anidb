import type { Qualities } from "@components";

export type Data = {
  Winter?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;

  Spring?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;

  Summer?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;

  Fall?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;

  Uncategorized?: Array<{
    uuid: string;
    title: string;
    quality: Qualities;
  }>;
};

export type YearData = Array<{
  year: number | null;
  seasons: null | {
    None?: number;
    Winter?: number;
    Spring?: number;
    Summer?: number;
    Fall?: number;
  };
  count: number | null;
}>;
