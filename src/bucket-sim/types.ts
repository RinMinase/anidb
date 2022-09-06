export type Sims = Array<{
  uuid: string;
  description?: string;
}>;

export type Data = Item[];

export type Item = {
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
};