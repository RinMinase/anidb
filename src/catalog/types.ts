export type Data = Array<{
  uuid: string;
  title: string;
  priority?: "Low" | "Normal" | "High";
}>;

export type Stats = {
  year?: number;
  season?: "Winter" | "Spring" | "Summer" | "Fall";
};

export type Catalogs = Array<{
  uuid: string;
  year: number;
  season: "Winter" | "Spring" | "Summer" | "Fall";
}>;

export type Priorities = Array<{
  id: string;
  priority: "Low" | "Normal" | "High";
}>;
