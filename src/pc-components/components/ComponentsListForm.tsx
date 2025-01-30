import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { Plus as AddIcon } from "react-feather";
import { Stack } from "@mui/material";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import { ErrorResponse } from "@components/types";

import {
  ButtonLoading,
  ControlledDatepicker,
  ControlledField,
  ControlledSelect,
  OptionsKeyedProps,
  removeBlankAttributes,
} from "@components";

import {
  ComponentForm,
  componentFormDefaultValues,
  componentFormResolver,
} from "../validation";

type Props = {
  isTableLoading: boolean;
  fetchData: () => Promise<void>;
  types: OptionsKeyedProps;
};

const ComponentsListForm = (props: Props) => {
  const [isFormLoading, setFormLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<ComponentForm>({
    defaultValues: componentFormDefaultValues,
    resolver: componentFormResolver,
    mode: "onChange",
  });

  const handleSubmitForm = async (formdata: ComponentForm) => {
    try {
      setFormLoading(true);

      await axios.post("/pc/components", removeBlankAttributes(formdata));
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
      <ControlledSelect
        name="id_type"
        label="Type"
        size="small"
        options={props.types}
        control={control}
        error={!!errors.id_type}
        helperText={errors.id_type?.message}
        disabled={isFormLoading || props.isTableLoading}
        menuMaxHeight={300}
        displayActualEmpty
      />
      <ControlledField
        name="name"
        label="Name"
        size="small"
        control={control}
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isFormLoading || props.isTableLoading}
      />
      <ControlledField
        name="description"
        label="Description"
        size="small"
        control={control}
        error={!!errors.description}
        helperText={errors.description?.message}
        disabled={isFormLoading || props.isTableLoading}
      />
      <ControlledField
        name="price"
        label="Price"
        size="small"
        control={control}
        error={!!errors.price}
        helperText={errors.price?.message}
        disabled={isFormLoading || props.isTableLoading}
        numeric
      />
      <ControlledDatepicker
        name="purchase_date"
        label="Purchase Date"
        size="small"
        control={control}
        error={!!errors.purchase_date}
        helperText={errors.purchase_date?.message}
        disabled={isFormLoading || props.isTableLoading}
      />
      <ControlledField
        name="purchase_location"
        label="Purchase Location"
        size="small"
        control={control}
        error={!!errors.purchase_location}
        helperText={errors.purchase_location?.message}
        disabled={isFormLoading || props.isTableLoading}
      />
      <ControlledField
        name="purchase_notes"
        label="Purchase Notes"
        size="small"
        control={control}
        error={!!errors.purchase_notes}
        helperText={errors.purchase_notes?.message}
        disabled={isFormLoading || props.isTableLoading}
      />
      <ButtonLoading
        variant="contained"
        startIcon={<AddIcon size={20} />}
        onClick={handleSubmit(handleSubmitForm)}
        loading={isFormLoading || props.isTableLoading}
      >
        Add Component
      </ButtonLoading>
    </Stack>
  );
};

export default ComponentsListForm;
