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
  titles?: number;
  bucketColor?: string;
  progressColor?: "success" | "error" | "warning";
};

export type Stats = {
  from: string;
  to: string;
};
