// commit to change to lf
export type Data = {
  entries?: number;
  buckets?: number;
  partials?: number;
};

export type Stats = {
  watchSeconds?: number;
  watch?: string;
  watchSubtext?: string;
  rewatchSeconds?: number;
  rewatch?: string;
  rewatchSubtext?: string;
  bucketSize?: string;
  entrySize?: string;
  episodes?: number;
  titles?: number;
  seasons?: number;
};

export type Graph = {
  quality: {
    quality2160?: number;
    quality1080?: number;
    quality720?: number;
    quality480?: number;
    quality360?: number;
  };
  ratings: Array<number>;
  months: {
    jan?: number;
    feb?: number;
    mar?: number;
    apr?: number;
    may?: number;
    jun?: number;
    jul?: number;
    aug?: number;
    sep?: number;
    oct?: number;
    nov?: number;
    dec?: number;
  };
  years: Array<{
    year: string;
    value: number;
  }>;
  seasons: Array<{
    season: string;
    value: number;
  }>;
  genres: {
    list: Array<string>;
    values: Array<{
      genre: string;
      value: number;
    }>;
  };
};

export type ByYearData = Array<number>;
