export type Data = Array<{
  uuid: string;
  title: string;
  priority?: "Low" | "Normal" | "High";
}>;

export type PartialsListItem = {
  catalog: string;
  uuid: string;
  title: string;
  priority?: "Low" | "Normal" | "High";
};

export type PartialsListData = Array<PartialsListItem>;

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

export type TableHeadings = Array<{
  id: string;
  label: string;
  width?: number | string;
  minWidth?: number | string;
  hideOnMobile?: boolean;
  sortable?: boolean;
}>;
