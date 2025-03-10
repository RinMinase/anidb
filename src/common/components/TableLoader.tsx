// commit to change to lf
import {
  Box,
  CircularProgress,
  LinearProgress,
  TableCell,
  TableRow,
} from "@mui/material";

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

export const TablePageLoader = (props: Props) => {
  return (
    <TableRow>
      <TableCell
        colSpan={props.colspan || 42}
        sx={{ width: "100%", textAlign: "center", marginTop: 2 }}
      >
        <Box
          sx={(theme) => ({
            backgroundColor: "#F5F5F5",
            width: "60px",
            height: "60px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            borderRadius: "50%",
            ...theme.applyStyles("dark", {
              backgroundColor: "#BDBDBD",
            }),
          })}
        >
          <CircularProgress />
        </Box>
      </TableCell>
    </TableRow>
  );
};
