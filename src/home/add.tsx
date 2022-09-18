import { useContext } from "preact/hooks";
import { route } from "preact-router";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import Swal from "sweetalert2";

import { Box, styled, Typography } from "@mui/material";

import {
  faArrowLeftLong as BackIcon,
  faFloppyDisk as SaveIcon,
} from "@fortawesome/free-solid-svg-icons";

import { Button, GlobalLoaderContext } from "@components";
import { useForm } from "react-hook-form";
import { defaultValues, Form, resolver } from "./validation";

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

const ControlButtons = styled(Button)(({ theme }) => ({
  minWidth: 120,
  marginLeft: 16,

  [theme.breakpoints.down("sm")]: {
    marginTop: 8,
  },
}));

const HomeAdd = () => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  const handleBack = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Any changes will not be saved",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) route("/home");
    });
  };

  const handleSubmitForm = (formdata: Form) => {
    console.log(formdata);
  }

  return (
    <ModuleContainer>
    <Header>
      <Box display="flex" flexDirection="column" flexGrow={1}>
        <Button
          variant="contained"
          color="error"
          startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
          sx={{
            display: { xs: "inline-flex", sm: "none" },
            width: 120,
            marginBottom: 2,
          }}
          onClick={handleBack}
        >
          Back
        </Button>
        <Typography variant="h5" alignItems="center">
          Add Bucket Simulation
        </Typography>
      </Box>
      <ControlButtonsContainer>
        <ControlButtons
          variant="contained"
          color="error"
          startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
          sx={{ display: { xs: "none", sm: "inline-flex" } }}
          onClick={handleBack}
        >
          Back
        </ControlButtons>
        <ControlButtons
          variant="contained"
          startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
          onClick={handleSubmit(handleSubmitForm)}
        >
          Save
        </ControlButtons>
      </ControlButtonsContainer>
    </Header>
    </ModuleContainer>
  )
}

export default HomeAdd;
