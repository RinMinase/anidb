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
  ControlledMultiSelect,
  IconButton,
  OptionsKeyedProps,
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
import { defaultValues, Form, resolver } from "../validation";
import { PartsList } from "../types";

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
  const [partsList, setPartsList] = useState<OptionsKeyedProps>([]);

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
      } = await axios.get(`/gas/maintenance/${id}`);

      reset({
        date: new Date(data.date),
        description: data.description,
        odometer: data.odometer,
        parts: data.partSummaryKeys,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const fetchPartsList = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get("/gas/maintenance/parts");
      const list = data.data as PartsList;

      const options: OptionsKeyedProps = list.map((item) => ({
        label: item.label,
        key: item.type,
        value: item.type,
      }));

      setPartsList(options);
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

      await axios.put(`/gas/maintenance/${id}`, {
        ...formdata,
        date: format(formdata.date, "yyyy-MM-dd"),
        odometer: formdata.odometer || null,
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
      fetchPartsList();
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

            <ControlledField
              name="description"
              label="Description"
              size="small"
              control={control}
              error={!!errors.description}
              helperText={errors.description?.message}
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

            <ControlledMultiSelect
              size="small"
              name="parts"
              label="Parts"
              popupMaxHeight={300}
              options={partsList}
              control={control}
              error={!!errors.parts}
              helperText={errors.parts?.message}
              disabled={loading}
            />

            <ButtonLoading
              variant="contained"
              onClick={handleSubmit(handleSubmitForm)}
              loading={loading}
            >
              Edit Maintenance Entry
            </ButtonLoading>
          </Stack>
        </DialogContent>
      </CustomDialog>
    </Modal>
  );
};

export default EditDialog;
