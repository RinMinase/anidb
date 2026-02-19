import { Dispatch, StateUpdater } from "preact/hooks";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

import { Stack } from "@mui/material";

import {
  ButtonLoading,
  ControlledDatepicker,
  ControlledField,
  ControlledSlider,
} from "@components";

import { ErrorResponse } from "@components/types";
import { defaultValues, Form, resolver } from "../validation";
import { SliderMarks } from "../constants";

type Props = {
  isLargeForm?: boolean;
  loading: boolean;
  setLoading: Dispatch<StateUpdater<boolean>>;
  onClose?: () => void;
  refreshData?: () => void;
};

const AddFuelForm = (props: Props) => {
  const { isLargeForm, loading, setLoading, refreshData, onClose } = props;

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver, defaultValues, mode: "onChange" });

  const handleSubmitForm = async (formdata: Form) => {
    try {
      setLoading(true);

      await axios.post("/gas/fuel", formdata);

      if (refreshData) refreshData();
      if (onClose) onClose();

      setLoading(false);
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
    <Stack spacing={2} sx={{ mt: 1 }}>
      <ControlledDatepicker
        fullWidth
        name="date"
        label="Date"
        size={isLargeForm ? undefined : "small"}
        control={control}
        error={!!errors.date}
        helperText={errors.date?.message}
        disabled={loading}
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
        disabled={loading}
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
        disabled={loading}
      />

      <ControlledField
        numeric
        name="odometer"
        label="Odometer"
        size={isLargeForm ? undefined : "small"}
        control={control}
        error={!!errors.odometer}
        helperText={errors.odometer?.message}
        disabled={loading}
      />

      <ControlledField
        numeric
        allowPeriod
        name="price_per_liter"
        label="Price per Liter"
        size={isLargeForm ? undefined : "small"}
        decimalPlaces={2}
        control={control}
        error={!!errors.price_per_liter}
        helperText={errors.price_per_liter?.message}
        disabled={loading}
      />

      <ControlledField
        numeric
        allowPeriod
        name="liters_filled"
        label="Liters Filled"
        size={isLargeForm ? undefined : "small"}
        decimalPlaces={3}
        control={control}
        error={!!errors.liters_filled}
        helperText={errors.liters_filled?.message}
        disabled={loading}
      />

      <ButtonLoading
        variant="contained"
        size={isLargeForm ? "large" : undefined}
        onClick={handleSubmit(handleSubmitForm)}
        loading={loading}
        fullWidth
      >
        Save
      </ButtonLoading>
    </Stack>
  );
};

export default AddFuelForm;
