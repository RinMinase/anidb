import { useEffect, useState } from "preact/hooks";
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
  ControlledMultiSelect,
  OptionsKeyedProps,
} from "@components";

import { ErrorResponse } from "@components/types";
import { defaultValues, Form, resolver } from "../validation";
import { PartsList } from "../types";

type Props = {
  refreshData: () => Promise<void>;
  isRefreshLoading: boolean;
};

const AddForm = (props: Props) => {
  const { isRefreshLoading, refreshData } = props;

  const [loading, setLoading] = useState(false);
  const [partsList, setPartsList] = useState<OptionsKeyedProps>([]);

  const {
    control,
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

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

      await axios.post("/gas/maintenance", {
        ...formdata,
        date: format(formdata.date, "yyyy-MM-dd"),
        odometer: formdata.odometer || null,
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

  useEffect(() => {
    fetchPartsList();
  }, []);

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

      <ControlledField
        name="description"
        label="Description"
        size="small"
        control={control}
        error={!!errors.description}
        helperText={errors.description?.message}
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

      <ControlledMultiSelect
        size="small"
        name="parts"
        label="Parts"
        popupMaxHeight={300}
        options={partsList}
        control={control}
        error={!!errors.parts}
        helperText={errors.parts?.message}
        disabled={loading || isRefreshLoading}
      />

      <ButtonLoading
        variant="contained"
        startIcon={<AddIcon size={20} />}
        onClick={handleSubmit(handleSubmitForm)}
        loading={loading || isRefreshLoading}
      >
        Add Maintenance Entry
      </ButtonLoading>
    </Stack>
  );
};

export default AddForm;
