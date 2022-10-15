import TableLoader from "./TableLoader";

import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
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
};

export default Table;
