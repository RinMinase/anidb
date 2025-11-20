import type { Item } from "../home/types";

export type { Data, Item } from "../home/types";

export type ColumnSetupType = {
  key: keyof Item;
  name: string;
  width: number;
}[];

export const defaultColumnSetup: ColumnSetupType = [
  { key: "title", name: "Title", width: 200 },
  { key: "episodes", name: "E / O / S", width: 120 },
  { key: "filesize", name: "Filesize", width: 100 },
  { key: "dateFinished", name: "Date Finished", width: 190 },
  { key: "release", name: "Release Date", width: 120 },
  { key: "encoder", name: "Encoder", width: 75 },
  { key: "rating", name: "Rating", width: 85 },
];
