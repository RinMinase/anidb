export type Data = {
  Winter?: Array<{
    uuid: string;
    title: string;
  }>;

  Spring?: Array<{
    uuid: string;
    title: string;
  }>;

  Summer?: Array<{
    uuid: string;
    title: string;
  }>;

  Fall?: Array<{
    uuid: string;
    title: string;
  }>;

  Uncategorized?: Array<{
    uuid: string;
    title: string;
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
