import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { X as CloseIcon } from "react-feather";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";

import {
  Backdrop,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  styled,
} from "@mui/material";

import {
  ButtonLoading,
  ControlledDatepicker,
  ControlledField,
  ControlledSelect,
  IconButton,
  OptionsKeyedProps,
  removeBlankAttributes,
} from "@components";

import { ErrorResponse } from "@components/types";

import { PCComponent } from "../types";

import {
  ComponentForm,
  componentFormDefaultValues,
  componentFormResolver,
} from "../validation";

type Props = {
  isEditDialogOpen: boolean;
  setEditDialogOpen: Dispatch<StateUpdater<boolean>>;
  types: OptionsKeyedProps;
  data?: PCComponent;
  fetchData: () => Promise<void>;
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

const ComponentsListEditDialog = (props: Props) => {
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

      await axios.put(
        `/pc/components/${props.data?.id}`,
        removeBlankAttributes(formdata),
      );

      toast.success("Success");
      reset();

      props.setEditDialogOpen(false);
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

  useEffect(() => {
    if (props.data) {
      reset({
        id_type: `${props.data.idType}`,
        name: props.data.name,
        description: props.data.description ?? undefined,
        price: props.data.price ?? undefined,
        purchase_location: props.data.purchaseLocation ?? undefined,
        purchase_notes: props.data.purchaseNotes ?? undefined,

        // Throws an console error currently
        purchase_date: props.data.purchaseDate
          ? new Date(props.data.purchaseDate)
          : undefined,
      });
    }
  }, [props.data]);

  return (
    <Backdrop open={props.isEditDialogOpen}>
      <CustomDialog>
        <DialogTitle display="flex" justifyContent="space-between">
          Edit Component
          <IconButton
            disabled={isFormLoading}
            onClick={() => props.setEditDialogOpen(false)}
            children={<CloseIcon size={20} />}
          />
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <ControlledSelect
              name="id_type"
              label="Type"
              size="small"
              options={props.types}
              control={control}
              error={!!errors.id_type}
              helperText={errors.id_type?.message}
              disabled={isFormLoading}
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
              disabled={isFormLoading}
            />
            <ControlledField
              name="description"
              label="Description"
              size="small"
              control={control}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={isFormLoading}
            />
            <ControlledField
              name="price"
              label="Price"
              size="small"
              control={control}
              error={!!errors.price}
              helperText={errors.price?.message}
              disabled={isFormLoading}
              numeric
            />
            <ControlledDatepicker
              name="purchase_date"
              label="Purchase Date"
              size="small"
              control={control}
              error={!!errors.purchase_date}
              helperText={errors.purchase_date?.message}
              disabled={isFormLoading}
            />
            <ControlledField
              name="purchase_location"
              label="Purchase Location"
              size="small"
              control={control}
              error={!!errors.purchase_location}
              helperText={errors.purchase_location?.message}
              disabled={isFormLoading}
            />
            <ControlledField
              name="purchase_notes"
              label="Purchase Notes"
              size="small"
              control={control}
              error={!!errors.purchase_notes}
              helperText={errors.purchase_notes?.message}
              disabled={isFormLoading}
            />
            <ButtonLoading
              variant="contained"
              onClick={handleSubmit(handleSubmitForm)}
              loading={isFormLoading}
            >
              Save Component
            </ButtonLoading>
          </Stack>
        </DialogContent>
      </CustomDialog>
    </Backdrop>
  );
};

export default ComponentsListEditDialog;
