import { useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

import {
  Backdrop,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  Paper,
  Stack,
  styled,
} from "@mui/material";

import {
  Plus as AddIcon,
  X as CloseIcon,
  Trash as DeleteIcon,
  Edit as EditIcon,
} from "react-feather";

import { ErrorResponse } from "@components/types";

import {
  ButtonLoading,
  ControlledField,
  Dialog,
  IconButton,
  removeBlankAttributes,
  Table,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";
import { Data, Item } from "./types";

const CustomDialog = styled(Paper)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
  maxHeight: "80vh",
});

const AudioCodec = () => {
  const [isAddButtonLoading, setAddButtonLoading] = useState(false);
  const [isEditButtonLoading, setEditButtonLoading] = useState(false);
  const [isTableLoading, setTableLoading] = useState(true);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [data, setData] = useState<Data>([]);
  const [selectedData, setSelectedData] = useState<Item>({
    id: "",
    codec: "",
  });

  const {
    control,
    handleSubmit,
    setError,
    reset: resetAddForm,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const {
    control: editControl,
    setValue: editSetValue,
    trigger: editTrigger,
    handleSubmit: editHandleSubmit,
    setError: editSetError,
    formState: { errors: editErrors },
  } = useForm<Form>({ resolver, mode: "onChange" });

  const fetchData = async () => {
    setTableLoading(true);

    try {
      const {
        data: { data },
      } = await axios.get("/codecs/audio");

      setData(() => data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const handleEditClick = (item: Item) => {
    setSelectedData(item);

    editSetValue("codec", item.codec);
    editTrigger("codec");

    editSetValue("order", item.order || undefined);
    editTrigger("order");

    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (formdata: Form) => {
    try {
      setEditButtonLoading(true);

      const id = selectedData.id;
      await axios.put(`/codecs/audio/${id}`, removeBlankAttributes(formdata));
      toast.success("Success");

      setEditButtonLoading(false);
      setTableLoading(true);
      setEditDialogOpen(false);

      await fetchData();
    } catch (err) {
      setEditButtonLoading(false);

      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponse;

        for (const key in data) {
          editSetError(key as any, {
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
      setTableLoading(false);
    }
  };

  const handleDeleteClick = (item: Item) => {
    setSelectedData(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      setDeleteDialogOpen(false);
      setTableLoading(true);

      await axios.delete(`/codecs/audio/${selectedData.id}`);
      toast.success("Success");

      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    try {
      setAddButtonLoading(true);

      await axios.post("/codecs/audio", removeBlankAttributes(formdata));
      toast.success("Success");

      resetAddForm();
      setAddButtonLoading(false);
      setTableLoading(true);

      await fetchData();
    } catch (err) {
      setAddButtonLoading(false);

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
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <Stack spacing={2}>
            <ControlledField
              name="codec"
              label="Audio Codec Name"
              size="small"
              control={control}
              error={!!errors.codec}
              helperText={errors.codec?.message}
              disabled={isAddButtonLoading || isTableLoading}
            />
            <ControlledField
              name="order"
              label="Order"
              size="small"
              control={control}
              error={!!errors.order}
              helperText={errors.order?.message}
              disabled={isAddButtonLoading || isTableLoading}
            />
            <ButtonLoading
              variant="contained"
              startIcon={<AddIcon size={20} />}
              onClick={handleSubmit(handleSubmitForm)}
              loading={isAddButtonLoading || isTableLoading}
            >
              Add Audio Codec
            </ButtonLoading>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
          <Table.Container
            component={Paper}
            sx={{
              maxHeight: {
                xs: undefined,
                /*
                 * Calculation Description:
                 * 48px - navbar
                 * 48px - container padding
                 * 49px - page heading
                 * 48px - tab heading
                 * 32px - tab spacing
                 */
                md: "calc(100vh - 48px - 48px - 49px - 48px - 32px)",
              },
              overflow: {
                xs: undefined,
                md: "scroll",
              },
            }}
          >
            <Table.Element size="small" sx={{ minWidth: 650 }}>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>Name</Table.Cell>
                  <Table.Cell>Order</Table.Cell>
                  <Table.Cell />
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {!isTableLoading ? (
                  data.map((item) => (
                    <Table.Row hover key={`codec-${item.id}`}>
                      <Table.Cell>{item.codec}</Table.Cell>
                      <Table.Cell>{item.order}</Table.Cell>
                      <Table.Cell sx={{ textAlign: "right" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(item)}
                          children={<EditIcon size={20} />}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(item)}
                          sx={{ ml: 1 }}
                          children={<DeleteIcon size={20} />}
                        />
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Loader />
                )}
              </Table.Body>
            </Table.Element>
          </Table.Container>
        </Grid>
      </Grid>

      <Backdrop open={isEditDialogOpen}>
        <CustomDialog>
          <DialogTitle display="flex" justifyContent="space-between">
            Edit Codec Name
            <IconButton
              disabled={isEditButtonLoading}
              onClick={() => setEditDialogOpen(false)}
              children={<CloseIcon size={20} />}
            />
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <ControlledField
                name="codec"
                label="Codec Name"
                size="small"
                control={editControl}
                error={!!editErrors.codec}
                helperText={editErrors.codec?.message}
                disabled={isEditButtonLoading}
              />
              <ControlledField
                name="order"
                label="Order"
                size="small"
                control={editControl}
                error={!!editErrors.order}
                helperText={editErrors.order?.message}
                disabled={isEditButtonLoading}
              />

              <ButtonLoading
                variant="contained"
                onClick={editHandleSubmit(handleEditSubmit)}
                loading={isEditButtonLoading}
                fullWidth
              >
                Save
              </ButtonLoading>
            </Stack>
          </DialogContent>
        </CustomDialog>
      </Backdrop>

      <Dialog
        title="Are you sure?"
        text="This content would be deleted."
        onSubmit={handleDeleteSubmit}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </>
  );
};

export default AudioCodec;
