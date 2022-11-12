import TableLoader from "./TableLoader";

import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";

const Table = {
  Element: MuiTable,
  Body: TableBody,
  Cell: TableCell,
  Container: TableContainer,
  Head: TableHead,
  Row: TableRow,
  Loader: TableLoader,
  Pagination: TablePagination,
};

export default Table;
