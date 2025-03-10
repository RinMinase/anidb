// commit to change to lf
export type { Data, Item } from "../home/types";

export type TableHeadings = Array<{
  id: string;
  label: string;
  width?: number;
  minWidth?: number;
  align?: "left" | "center" | "right";
}>;
