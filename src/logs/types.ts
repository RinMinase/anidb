export type Data = Array<{
  id: string;
  tableChanged: string;
  idChanged: string;
  description: string;
  action: string;
  createdAt: string;
}>;

export type Pagination = {
  page: number;
  limit: number;
  totalResults: number;
  totalPages: number;
  hasNext: boolean;
};

const paginationDefaults: Pagination = {
  page: 0,
  limit: 30,
  totalResults: 1,
  totalPages: 1,
  hasNext: false,
};

export { paginationDefaults };
