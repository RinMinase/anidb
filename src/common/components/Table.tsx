// commit to change to lf
import { TableLoader, TablePageLoader } from "./TableLoader";
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
  PageLoader: TablePageLoader,
  Pagination: TablePagination,
  PaginationActions: TablePaginationActions,
};

export default Table;
