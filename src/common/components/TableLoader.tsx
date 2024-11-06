import { LinearProgress, TableCell, TableRow } from "@mui/material";

type Props = {
  colspan?: number;
};

const TableLoader = (props: Props) => {
  return (
    <TableRow>
      <TableCell colSpan={props.colspan || 42} sx={{ padding: 0, border: 0 }}>
        <LinearProgress />
      </TableCell>
    </TableRow>
  );
};

export default TableLoader;
