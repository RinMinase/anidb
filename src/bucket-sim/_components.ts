import { Box, OutlinedInput, styled, TextField } from "@mui/material";

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

export const CustomTextField = styled(TextField)(({ theme }) => ({
  minWidth: 40,
  width: 220,

  [theme.breakpoints.down("md")]: {
    maxWidth: 200,
  },

  [theme.breakpoints.down("sm")]: {
    maxWidth: 70,
  },
}));

export const CustomNumericField = styled(OutlinedInput)(({ theme }) => ({
  width: 180,
  textAlign: "right",

  [theme.breakpoints.down("md")]: {
    maxWidth: 130,
  },

  [theme.breakpoints.down("sm")]: {
    maxWidth: 75,
  },

  "& input::-webkit-outer-spin-button": {
    display: "none",
  },

  "& input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

export {
  ControlButtons,
  ControlButtonsLoader,
  Dashboard,
  DescriptionContainer,
};
