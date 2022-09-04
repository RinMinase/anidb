export type Data = Array<{
  id: string;
  title: string;
  priority?: "Low" | "Normal" | "High";
}>;

export type Catalogs = Array<{
  id: string;
  year: number;
  season: "Winter" | "Spring" | "Summer" | "Fall";
}>;
