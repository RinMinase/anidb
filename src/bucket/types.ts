import type { Qualities } from "@components";

export type Data = Array<{
  id?: string;
  quality?: Qualities;
  title?: string;
  filesize?: string;
}>;

export type Buckets = Bucket[];

export type Bucket = {
  id: number;
  from: string;
  to: string;
  free?: string;
  freeTB?: string | null;
  used?: string;
  percent: number;
  total?: string;
  rawTotal?: number;
  titles?: number;
  bucketColor?: string;
  progressColor?: "success" | "error" | "warning";
  purchaseDate: string | null;
};

export type Stats = {
  from: string;
  to: string;
};
