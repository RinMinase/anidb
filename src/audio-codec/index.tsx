import { useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import axios from "axios";

import {
  Backdrop,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  LinearProgress,
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

import {
  Button,
  ControlledField,
  IconButton,
  ModuleContainer,
  Swal,
  Table,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";
import { Data, Item } from "./types";

const CustomTable = styled(Table.Element)({
  minWidth: 650,
});

const ActionTableCell = styled(Table.Cell)({
  textAlign: "right",
});

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
  const [isTableLoading, setTableLoading] = useState(true);
  const [data, setData] = useState<Data>([]);
  const [selectedData, setSelectedData] = useState<Item>({
    id: "",
    codec: "",
  });

  const [dialog, setDialog] = useState({
    loading: false,
    show: false,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const {
    control: editControl,
    setValue: editSetValue,
    trigger: editTrigger,
    handleSubmit: editHandleSubmit,
    formState: { errors: editErrors },
  } = useForm<Form>({ resolver, mode: "onChange" });

  const fetchData = async () => {
    setTableLoading(true);

    try {
      const {
        data: { data },
      } = await axios.get("/codecs/audio");

      setData(() => data);
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

    setDialog((prev) => ({
      ...prev,
      show: true,
    }));
  };

  const handleEditSubmit = async (formdata: Form) => {
    setDialog((prev) => ({
      ...prev,
      loading: true,
    }));

    const id = selectedData.id;

    try {
      await axios.put(`/codecs/audio/${id}`, formdata);

      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      setDialog({
        show: false,
        loading: false,
      });

      setTableLoading(true);

      await fetchData();
    } catch (err) {
      console.error(err);

      await Swal.fire({
        title: "Failed",
        icon: "error",
      });

      setDialog((prev) => ({
        ...prev,
        loading: false,
      }));

      setTableLoading(false);
    }
  };

  const handleDeleteClick = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted",
      icon: "error",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      setTableLoading(true);

      await axios.delete(`/codecs/audio/${id}`);
      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      await fetchData();
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    setTableLoading(true);

    try {
      await axios.post("/codecs/audio", formdata);

      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      await fetchData();
    } catch {
      await Swal.fire({
        title: "Failed",
        icon: "error",
      });
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="Audio Codecs">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <Stack spacing={2}>
            <ControlledField
              name="codec"
              label="Codec Name"
              size="small"
              control={control}
              error={!!errors.codec}
              helperText={errors.codec?.message}
              disabled={isTableLoading}
            />
            <ControlledField
              name="order"
              label="Order"
              size="small"
              control={control}
              error={!!errors.order}
              helperText={errors.order?.message}
              disabled={isTableLoading}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon size={20} />}
              onClick={handleSubmit(handleSubmitForm)}
            >
              Add Audio Codec
            </Button>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
          <Table.Container component={Paper}>
            <CustomTable size="small">
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
                      <ActionTableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(item)}
                          children={<EditIcon size={20} />}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(item.id)}
                          sx={{ ml: 1 }}
                          children={<DeleteIcon size={20} />}
                        />
                      </ActionTableCell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Loader />
                )}
              </Table.Body>
            </CustomTable>
          </Table.Container>
        </Grid>
      </Grid>

      <Backdrop open={dialog.show}>
        <CustomDialog>
          {dialog.loading && <LinearProgress />}
          <DialogTitle display="flex" justifyContent="space-between">
            Edit Codec Name
            <IconButton
              disabled={dialog.loading}
              onClick={() => setDialog({ show: false, loading: false })}
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
                disabled={isTableLoading}
              />
              <ControlledField
                name="order"
                label="Order"
                size="small"
                control={editControl}
                error={!!editErrors.order}
                helperText={editErrors.order?.message}
                disabled={isTableLoading}
              />

              <Button
                variant="contained"
                onClick={editHandleSubmit(handleEditSubmit)}
                disabled={dialog.loading}
                fullWidth
              >
                Save
              </Button>
            </Stack>
          </DialogContent>
        </CustomDialog>
      </Backdrop>
    </ModuleContainer>
  );
};

export default AudioCodec;
