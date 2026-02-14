export type Part = {
  type: string;
  label: string;
};

export type PartsList = Array<Part>;

export type Item = {
  id: number;
  date: string;
  description: string;
  odometer: number;
  parts: PartsList;
  partSummaryKeys: Array<string>;
  partSummaryLabels: Array<string>;
};

export type Data = Array<Item>;
