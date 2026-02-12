export type Item = {
  id: number;
  date: string;
  fromBars: number;
  toBars: number;
  odometer: number;
  pricePerLiter: number | null;
  litersFilled: number | null;
};

export type Data = Array<Item>;
