import { TableLoader } from "./TableLoader";
import TablePaginationActions from "./TablePaginationActions";

import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from "@mui/material";

const Table = {
  Element: MuiTable,
  Body: TableBody,
  Cell: TableCell,
  Container: TableContainer,
  Head: TableHead,
  Row: TableRow,
  SortHeader: TableSortLabel,
  Loader: TableLoader,
  Pagination: TablePagination,
  PaginationActions: TablePaginationActions,
};

export default Table;
