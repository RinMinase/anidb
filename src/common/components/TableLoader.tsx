import { LinearProgress, TableCell, TableRow } from "@mui/material";

type Props = {
  colspan?: number;
};

export const TableLoader = (props: Props) => {
  return (
    <TableRow>
      <TableCell colSpan={props.colspan || 42} sx={{ padding: 0, border: 0 }}>
        <LinearProgress />
      </TableCell>
    </TableRow>
  );
};
