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
  ControlledField,
  ControlledSelect,
  IconButton,
  removeBlankAttributes,
} from "@components";

import { ErrorResponse } from "@components/types";

import { PCComponentType } from "../types";

import {
  ComponentTypeForm,
  componentTypeFormDefaultValues,
  componentTypeFormResolver,
} from "../validation";

type Props = {
  isEditDialogOpen: boolean;
  setEditDialogOpen: Dispatch<StateUpdater<boolean>>;
  data?: PCComponentType;
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

const ComponentTypesEditDialog = (props: Props) => {
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

      await axios.put(
        `/pc/types/${props.data?.id}`,
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
        type: props.data.type,
        name: props.data.name,
        is_peripheral: props.data.isPeripheral,
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
              onClick={handleSubmit(handleSubmitForm)}
              loading={isFormLoading}
            >
              Save Component Type
            </ButtonLoading>
          </Stack>
        </DialogContent>
      </CustomDialog>
    </Backdrop>
  );
};

export default ComponentTypesEditDialog;
