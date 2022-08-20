export type Data = {
  entries?: number;
  buckets?: number;
  partials?: number;
}

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
}

export type Graph = {
  quality: {
    quality_2160?: number;
    quality_1080?: number;
    quality_720?: number;
    quality_480?: number;
    quality_360?: number;
  },
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
  }
}
