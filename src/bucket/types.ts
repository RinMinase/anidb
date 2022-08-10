export type Data = Array<{
  id?: string;
  quality?: string;
  title?: string;
  filesize?: string;
}>

export type Buckets = Array<{
  id: number;
  from: string;
  to: string;
  free?: string;
  freeTB?: string | null;
  used?: string;
  percent?: number;
  total?: string;
  titles?: number;
}>;

export type Stats = {
  from: string;
  to: string;
};
