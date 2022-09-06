import {
  Box,
  Button,
  IconButton,
  OutlinedInput,
  Paper,
  styled,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Header = styled(Box)({
  display: "flex",
  marginBottom: 32,
});

const ControlButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
    alignItems: "unset",
  },
}));

const ControlButtions = styled(Button)(({ theme }) => ({
  minWidth: 120,
  marginLeft: 16,

  [theme.breakpoints.down("sm")]: {
    marginTop: 8,
  },
}));

const DescriptionContainer = styled(Paper)({
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
  ModuleContainer,
  Header,
  ControlButtonsContainer,
  ControlButtions,
  DescriptionContainer,
  CustomIconButton,
  CustomCell,
  CustomCellButton,
  CellContainer,
  CellLabel,
  CellField,
  CellField2,
};