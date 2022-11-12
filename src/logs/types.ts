export type Data = Array<{
  id: string;
  table_changed: string;
  id_changed: string;
  description: string;
  action: string;
  created_at: string;
}>;

export type Pagination = {
  page: number;
  limit: number;
  total_data: number;
  total_pages: number;
  has_next: boolean;
};

const paginationDefaults: Pagination = {
  page: 0,
  limit: 30,
  total_data: 1,
  total_pages: 1,
  has_next: false,
};

export { paginationDefaults };
