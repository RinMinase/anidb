import { Stats } from "src/by-name/types";
import { Bucket } from "src/bucket/types";

export type Sims = Array<{
  uuid: string;
  description?: string;
}>;

export type Data = Item[];
export type Item = Bucket;
export type ByNameData = Stats;

// export type Item = {
//   id: number;
//   from: string;
//   to: string;
//   free?: string;
//   freeTB?: string | null;
//   used?: string;
//   percent: number;
//   total?: string;
//   rawTotal?: number;
//   titles?: number;
//   bucketColor?: string;
//   progressColor?: "success" | "error" | "warning";
//   purchaseDate: string | null;
// };
