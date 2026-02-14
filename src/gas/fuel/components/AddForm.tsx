import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus as AddIcon } from "react-feather";
import { Stack } from "@mui/material";
import { format } from "date-fns";
import axios, { AxiosError } from "axios";

import {
  ButtonLoading,
  ControlledDatepicker,
  ControlledField,
  ControlledSlider,
} from "@components";

import { ErrorResponse } from "@components/types";
import { defaultValues, Form, resolver } from "../../validation";
import { SliderMarks } from "../../constants";

type Props = {
  refreshData: () => Promise<void>;
  isRefreshLoading: boolean;
};

const AddForm = (props: Props) => {
  const { isRefreshLoading, refreshData } = props;

  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const handleSubmitForm = async (formdata: Form) => {
    try {
      setLoading(true);

      await axios.post("/gas/fuel", {
        ...formdata,
        date: format(formdata.date, "yyyy-MM-dd"),
        price_per_liter: formdata.price_per_liter || null,
        liters_filled: formdata.liters_filled || null,
      });

      toast.success("Success");

      resetForm();
      setLoading(false);

      await refreshData();
    } catch (err) {
      setLoading(false);

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
    }
  };

  return (
    <Stack spacing={2}>
      <ControlledDatepicker
        fullWidth
        name="date"
        label="Date"
        size="small"
        control={control}
        error={!!errors.date}
        helperText={errors.date?.message}
        disabled={loading || isRefreshLoading}
      />

      <ControlledSlider
        bordered
        name="from_bars"
        label="From"
        max={9}
        min={0}
        step={1}
        control={control}
        error={!!errors.from_bars}
        helperText={errors.from_bars?.message}
        marks={SliderMarks}
        disabled={loading || isRefreshLoading}
      />

      <ControlledSlider
        bordered
        name="to_bars"
        label="To"
        max={9}
        min={0}
        step={1}
        control={control}
        error={!!errors.to_bars}
        helperText={errors.to_bars?.message}
        marks={SliderMarks}
        disabled={loading || isRefreshLoading}
      />

      <ControlledField
        numeric
        name="odometer"
        label="Odometer"
        size="small"
        control={control}
        error={!!errors.odometer}
        helperText={errors.odometer?.message}
        disabled={loading || isRefreshLoading}
      />

      <ControlledField
        numeric
        allowPeriod
        name="price_per_liter"
        label="Price per Liter"
        size="small"
        decimalPlaces={2}
        control={control}
        error={!!errors.price_per_liter}
        helperText={errors.price_per_liter?.message}
        disabled={loading || isRefreshLoading}
      />

      <ControlledField
        numeric
        allowPeriod
        name="liters_filled"
        label="Liters Filled"
        size="small"
        decimalPlaces={3}
        control={control}
        error={!!errors.liters_filled}
        helperText={errors.liters_filled?.message}
        disabled={loading || isRefreshLoading}
      />

      <ButtonLoading
        variant="contained"
        startIcon={<AddIcon size={20} />}
        onClick={handleSubmit(handleSubmitForm)}
        loading={loading || isRefreshLoading}
      >
        Add Fuel Entry
      </ButtonLoading>
    </Stack>
  );
};

export default AddForm;
