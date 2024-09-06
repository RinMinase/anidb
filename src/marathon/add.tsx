import { route } from "preact-router";
import { useContext, useEffect } from "preact/hooks";
import { useForm } from "react-hook-form";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import { format } from "date-fns";
import axios from "axios";

import { Button, Stack, styled } from "@mui/material";

import { faFloppyDisk as SaveIcon } from "@fortawesome/free-solid-svg-icons";

import {
  ControlledField,
  ControlledDatepicker,
  GlobalLoaderContext,
  ModuleContainer,
  Swal,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";

type Props = {
  matches?: {
    id: string;
  };
};

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
          setValue("dateFrom", new Date(data.dateFrom));
          setValue("dateTo", new Date(data.dateTo));
        })
        .catch((err) => console.error(err))
        .finally(() => toggleLoader(false));
    }
  }, []);

  return (
    <ModuleContainer
      headerText={props.matches?.id ? "Edit marathon" : "Add Marathon"}
      handleBack={handleBack}
      largeGutter
    >
      <Stack spacing={3} maxWidth={450}>
        <ControlledField
          name="title"
          label="Title / Description"
          control={control}
          error={!!errors.title}
          helperText={errors.title?.message}
          disabled={isLoading}
        />

        <ControlledDatepicker
          name="dateFrom"
          label="Date From"
          control={control}
          error={!!errors.dateFrom}
          helperText={errors.dateFrom?.message}
          disabled={isLoading}
        />

        <ControlledDatepicker
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
    </ModuleContainer>
  );
};

export default MarathonAdd;
