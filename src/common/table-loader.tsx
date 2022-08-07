import { LinearProgress, styled, TableCell, TableRow } from "@mui/material";

type Props = {
  colspan?: number;
};

const CustomCell = styled(TableCell)({
  padding: 0,
  border: 0,
})

const TableLoader = (props: Props) => {
  return (
    <TableRow>
      <CustomCell colSpan={props.colspan || 42}>
        <LinearProgress />
      </CustomCell>
    </TableRow>
  );
};

export default TableLoader;
