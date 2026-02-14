import { X as CloseIcon } from "react-feather";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { format } from "date-fns";
import axios, { AxiosError } from "axios";

import {
  ButtonLoading,
  ControlledDatepicker,
  ControlledField,
  ControlledSlider,
  IconButton,
} from "@components";

import {
  DialogContent,
  DialogTitle,
  Modal,
  Paper,
  Stack,
  styled,
} from "@mui/material";

import { ErrorResponse } from "@components/types";
import { defaultValues, Form, resolver } from "../../validation";
import { SliderMarks } from "../../constants";

type Props = {
  id: number;
  open: boolean;
  handleClose: any;
  refreshData: () => Promise<void>;
};

const CustomDialog = styled(Paper)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
  maxHeight: "80vh",
});

const EditDialog = (props: Props) => {
  const { id, open, handleClose, refreshData } = props;

  const [loading, setLoading] = useState(false);

  const {
    control,
    reset,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ resolver, defaultValues, mode: "onChange" });

  const fetchData = async () => {
    try {
      setLoading(true);

      const {
        data: { data },
      } = await axios.get(`/gas/fuel/${id}`);

      reset({
        date: new Date(data.date),
        from_bars: data.fromBars,
        to_bars: data.toBars,
        odometer: data.odometer,
        price_per_liter: data.pricePerLiter,
        liters_filled: data.litersFilled,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    try {
      setLoading(true);

      await axios.put(`/gas/fuel/${id}`, {
        ...formdata,
        date: format(formdata.date, "yyyy-MM-dd"),
        price_per_liter: formdata.price_per_liter || null,
        liters_filled: formdata.liters_filled || null,
      });

      toast.success("Success");
      setLoading(false);
      handleClose();
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

  useEffect(() => {
    if (id && open) {
      fetchData();
    }
  }, [id, open]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      disableRestoreFocus
      disableEnforceFocus
    >
      <CustomDialog>
        <DialogTitle display="flex" justifyContent="space-between">
          Edit Codec Name
          <IconButton
            disabled={loading}
            onClick={handleClose}
            children={<CloseIcon size={20} />}
          />
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <ControlledDatepicker
              fullWidth
              name="date"
              label="Date"
              size="small"
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
              size="small"
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
              size="small"
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
              size="small"
              decimalPlaces={3}
              control={control}
              error={!!errors.liters_filled}
              helperText={errors.liters_filled?.message}
              disabled={loading}
            />

            <ButtonLoading
              variant="contained"
              onClick={handleSubmit(handleSubmitForm)}
              loading={loading}
            >
              Edit Fuel Entry
            </ButtonLoading>
          </Stack>
        </DialogContent>
      </CustomDialog>
    </Modal>
  );
};

export default EditDialog;
