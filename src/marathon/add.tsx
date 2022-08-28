import { route } from "preact-router";
import { useContext, useEffect } from "preact/hooks";
import { Controller, useForm } from "react-hook-form";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";
import Swal from "sweetalert2";
import { format } from "date-fns";
import axios from "axios";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import {
  Box,
  Button,
  Stack,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import {
  faArrowLeftLong as BackIcon,
  faFloppyDisk as SaveIcon,
} from "@fortawesome/free-solid-svg-icons";

import { GlobalLoaderContext } from "@components";
import { defaultValues, Form, resolver } from "./validation";

type Props = {
  matches?: {
    id: string;
  };
};

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

const ControlButtions = styled(Button)({
  minWidth: 120,
});

const SaveButton = styled(Button)(({ theme }) => ({
  maxWidth: 150,

  [theme.breakpoints.down("sm")]: {
    maxWidth: "unset",
  },
}));

const MarathonAdd = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const CustomTextField = (props: any) => {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { onChange, value } }) => (
          <TextField
            variant="outlined"
            onChange={onChange}
            label={props.label}
            helperText={props.helperText}
            error={props.error}
            disabled={props.disabled}
            value={value}
          />
        )}
      />
    );
  };

  const DatePicker = (props: any) => {
    return (
      <Controller
        name={props.name}
        control={props.control}
        render={({ field: { onChange, value } }) => (
          <DesktopDatePicker
            inputFormat="MM/dd/yyyy"
            label={props.label}
            onChange={onChange}
            value={value}
            renderInput={(params) => (
              <TextField
                {...params}
                helperText={props.helperText}
                error={props.error}
              />
            )}
          />
        )}
      />
    );
  };

  const handleBack = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Any changes will not be saved",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) route("/marathons");
    });
  };

  const handleSubmitForm = async (formdata: Form) => {
    toggleLoader(true);

    const body = {
      title: formdata.title,
      date_from: format(formdata.dateFrom, "yyyy-MM-dd"),
      date_to: format(formdata.dateTo, "yyyy-MM-dd"),
    };

    try {
      if (props.matches?.id) {
        await axios.put(`/sequences/${props.matches.id}`, body);
      } else {
        await axios.post("/sequences", body);
      }

      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      toggleLoader(false);
      route("/marathons");
    } catch (err) {
      toggleLoader(false);
      console.error(err);
    }
  };

  useEffect(() => {
    if (props.matches?.id) {
      toggleLoader(true);

      const { id } = props.matches;

      axios
        .get(`/sequences/${id}`)
        .then(({ data: { data } }) => {
          setValue("title", data.title);
          setValue("dateFrom", new Date(data.date_from));
          setValue("dateTo", new Date(data.date_to));
        })
        .catch((err) => console.error(err))
        .finally(() => toggleLoader(false));
    }
  }, []);

  return (
    <ModuleContainer>
      <Header>
        <Typography
          variant="h5"
          alignItems="center"
          display="flex"
          flexGrow={1}
        >
          {props.matches?.id ? "Edit marathon" : "Add Marathon"}
        </Typography>
        <ControlButtonsContainer>
          <ControlButtions
            variant="contained"
            color="error"
            startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
            onClick={handleBack}
          >
            Back
          </ControlButtions>
        </ControlButtonsContainer>
      </Header>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={3} maxWidth={450}>
          <CustomTextField
            name="title"
            variant="outlined"
            label="Title / Description"
            control={control}
            error={!!errors.title}
            helperText={errors.title?.message}
            disabled={isLoading}
          />

          <DatePicker
            name="dateFrom"
            label="Date From"
            control={control}
            error={!!errors.dateFrom}
            helperText={errors.dateFrom?.message}
            disabled={isLoading}
          />

          <DatePicker
            name="dateTo"
            label="Date To"
            control={control}
            error={!!errors.dateTo}
            helperText={errors.dateTo?.message}
            disabled={isLoading}
          />

          <SaveButton
            variant="contained"
            startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
            onClick={handleSubmit(handleSubmitForm)}
          >
            Save
          </SaveButton>
        </Stack>
      </LocalizationProvider>
    </ModuleContainer>
  );
};

export default MarathonAdd;
