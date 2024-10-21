import {
  Box,
  IconButton,
  OutlinedInput,
  styled,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";

import { Button, ButtonLoading } from "@components";

const ControlButtons = styled(Button)(({ theme }) => ({
  minWidth: 120,
  marginLeft: 16,

  [theme.breakpoints.down("sm")]: {
    marginTop: 8,
  },
}));

const ControlButtonsLoader = styled(ButtonLoading)(({ theme }) => ({
  minWidth: 120,
  marginLeft: 16,

  [theme.breakpoints.down("sm")]: {
    marginTop: 8,
  },
}));

const Dashboard = styled(Box)({
  marginBottom: 32,
});

const DescriptionContainer = styled(Box)({
  marginBottom: 16,
});

const CustomIconButton = styled(IconButton)({
  width: 32,
  height: 32,
});

const CustomCell = styled(TableCell)(({ theme }) => ({
  verticalAlign: "top",

  [theme.breakpoints.down("sm")]: {
    padding: 4,
  },
}));

const CustomCellButton = styled(TableCell)(({ theme }) => ({
  verticalAlign: "center",

  [theme.breakpoints.down("sm")]: {
    padding: 4,
  },
}));

const CellContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const CellLabel = styled(Typography)(({ theme }) => ({
  paddingTop: 8,
  display: "inline-block",
  marginRight: 8,

  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
    marginRight: 0,
  },
}));

const CellField = styled(TextField)(({ theme }) => ({
  minWidth: 40,

  [theme.breakpoints.down("sm")]: {
    maxWidth: 70,
  },
}));

const CellField2 = styled(OutlinedInput)({
  minWidth: 40,

  "& input::-webkit-outer-spin-button": {
    display: "none",
  },

  "& input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input[type=number]": {
    MozAppearance: "textfield",
  },
});

export {
  ControlButtons,
  ControlButtonsLoader,
  Dashboard,
  DescriptionContainer,
  CustomIconButton,
  CustomCell,
  CustomCellButton,
  CellContainer,
  CellLabel,
  CellField,
  CellField2,
};
