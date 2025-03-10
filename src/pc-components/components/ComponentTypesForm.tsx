import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { Plus as AddIcon } from "react-feather";
import { Stack } from "@mui/material";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import { ErrorResponse } from "@components/types";

import {
  ButtonLoading,
  ControlledField,
  ControlledSelect,
  removeBlankAttributes,
} from "@components";

import {
  ComponentTypeForm,
  componentTypeFormDefaultValues,
  componentTypeFormResolver,
} from "../validation";

type Props = {
  isTableLoading: boolean;
  fetchData: () => Promise<void>;
};

const ComponentTypesForm = (props: Props) => {
  const [isFormLoading, setFormLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ComponentTypeForm>({
    defaultValues: componentTypeFormDefaultValues,
    resolver: componentTypeFormResolver,
    mode: "onChange",
  });

  const handleSubmitForm = async (formdata: ComponentTypeForm) => {
    try {
      setFormLoading(true);

      await axios.post("/pc/types", removeBlankAttributes(formdata));

      toast.success("Success");
      reset();

      setFormLoading(false);
      await props.fetchData();
    } catch (err) {
      setFormLoading(false);

      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponse;

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
      setFormLoading(false);
    }
  };

  return (
    <Stack spacing={2}>
      <ControlledField
        name="type"
        label="Type Identifier"
        size="small"
        control={control}
        error={!!errors.type}
        helperText={errors.type?.message}
        disabled={isFormLoading}
      />
      <ControlledField
        name="name"
        label="Common Name / Descriptive Name"
        size="small"
        control={control}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isFormLoading}
      />
      <ControlledSelect
        name="is_peripheral"
        label="Is it a peripheral component?"
        size="small"
        options={[
          {
            label: "FALSE",
            value: false,
          },
          {
            label: "TRUE",
            value: true,
          },
        ]}
        control={control}
        error={!!errors.is_peripheral}
        helperText={errors.is_peripheral?.message}
        disabled={isFormLoading}
      />
      <ButtonLoading
        variant="contained"
        startIcon={<AddIcon size={20} />}
        onClick={handleSubmit(handleSubmitForm)}
        loading={isFormLoading}
      >
        Add Component Type
      </ButtonLoading>
    </Stack>
  );
};

export default ComponentTypesForm;
