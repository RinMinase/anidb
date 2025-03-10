import { route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Stack } from "@mui/material";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import {
  ControlledField,
  ControlledDatepicker,
  Dialog,
  ErrorResponseType,
  GlobalLoaderContext,
  ModuleContainer,
  ButtonLoading,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";

type Props = {
  matches?: {
    id: string;
  };
};

const MarathonAdd = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [isButtonLoading, setButtonLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const fetchData = async () => {
    try {
      if (props.matches?.id) {
        toggleLoader(true);

        const {
          data: { data },
        } = await axios.get(`/sequences/${props.matches.id}`);

        setValue("title", data.title);
        setValue("dateFrom", new Date(data.dateFrom));
        setValue("dateTo", new Date(data.dateTo));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    try {
      setButtonLoading(true);

      const body = {
        title: formdata.title,
        date_from: format(formdata.dateFrom, "yyyy-MM-dd"),
        date_to: format(formdata.dateTo, "yyyy-MM-dd"),
      };

      if (props.matches?.id) {
        await axios.put(`/sequences/${props.matches.id}`, body);
      } else {
        await axios.post("/sequences", body);
      }

      toast.success("Success");
      route("/marathons");
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponseType;

        for (const key in data) {
          setError(key as any, {
            type: "manual",
            message: data[key].length ? data[key][0] : "Unknown error.",
          });
        }

        toast.error("Form validation failed");
      } else {
        console.error(err);
        toast.error("Failed");
      }
    } finally {
      setButtonLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer
      headerText={props.matches?.id ? "Edit marathon" : "Add Marathon"}
      handleBack={() => setDialogOpen(true)}
      largeGutter
    >
      <Stack spacing={3} maxWidth={450}>
        <ControlledField
          name="title"
          label="Title / Description"
          control={control}
          error={!!errors.title}
          helperText={errors.title?.message}
          disabled={isButtonLoading || isLoading}
        />

        <ControlledDatepicker
          name="dateFrom"
          label="Date From"
          control={control}
          error={!!errors.dateFrom}
          helperText={errors.dateFrom?.message}
          disabled={isButtonLoading || isLoading}
        />

        <ControlledDatepicker
          name="dateTo"
          label="Date To"
          control={control}
          error={!!errors.dateTo}
          helperText={errors.dateTo?.message}
          disabled={isButtonLoading || isLoading}
        />

        <ButtonLoading
          variant="contained"
          loading={isButtonLoading || isLoading}
          onClick={handleSubmit(handleSubmitForm)}
        >
          Save
        </ButtonLoading>
      </Stack>

      <Dialog
        type="warning"
        title="Are you sure?"
        text="Any changes will not be saved."
        onSubmit={() => route("/marathons")}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />
    </ModuleContainer>
  );
};

export default MarathonAdd;
