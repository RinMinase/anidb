import { useContext, useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import axios from "axios";
import Swal from "sweetalert2";

import {
  Backdrop,
  Box,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  styled,
} from "@mui/material";

import {
  faFloppyDisk as SaveIcon,
  faPenToSquare as EditIcon,
  faTrash as DeleteIcon,
  faXmark as CloseIcon,
} from "@fortawesome/free-solid-svg-icons";

import {
  Button,
  ControlledField,
  GlobalLoaderContext,
  IconButton,
  Table,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";
import { Data, Item } from "./types";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

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

const VideoCodec = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

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
    try {
      const {
        data: { data },
      } = await axios.get("/codecs/video");

      setData(() => data);
    } catch (err) {
      console.error(err);
    } finally {
      toggleLoader(false);
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
      await axios.put(`/codecs/video/${id}`, formdata);

      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      setDialog({
        show: false,
        loading: false,
      });

      toggleLoader(true);

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

      toggleLoader(false);
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
      toggleLoader(true);

      await axios.delete(`/codecs/video/${id}`);
      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      await fetchData();
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    toggleLoader(true);

    try {
      await axios.post("/codecs/video", formdata);

      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      await fetchData();
    } catch (err) {
      await Swal.fire({
        title: "Failed",
        icon: "error",
      });

      console.error(err);
      toggleLoader(false);
    }
  };

  useEffect(() => {
    toggleLoader(true);
    fetchData();
  }, []);

  return (
    <ModuleContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
          <Stack spacing={2}>
            <ControlledField
              name="codec"
              label="Codec Name"
              size="small"
              control={control}
              error={!!errors.codec}
              helperText={errors.codec?.message}
              disabled={isLoading}
            />
            <ControlledField
              name="order"
              label="Order"
              size="small"
              control={control}
              error={!!errors.order}
              helperText={errors.order?.message}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
              onClick={handleSubmit(handleSubmitForm)}
            >
              Add Video Codec
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
          <Table.Container component={Paper}>
            <CustomTable>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>Name</Table.Cell>
                  <Table.Cell>Order</Table.Cell>
                  <Table.Cell />
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {!isLoading ? (
                  data.map((item) => (
                    <Table.Row hover key={`codec-${item.id}`}>
                      <Table.Cell>{item.codec}</Table.Cell>
                      <Table.Cell>{item.order}</Table.Cell>
                      <ActionTableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(item)}
                        >
                          <FontAwesomeSvgIcon icon={EditIcon} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(item.id)}
                          sx={{ ml: 1 }}
                        >
                          <FontAwesomeSvgIcon icon={DeleteIcon} />
                        </IconButton>
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
            >
              <FontAwesomeSvgIcon width={22} icon={CloseIcon} />
            </IconButton>
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
                disabled={isLoading}
              />
              <ControlledField
                name="order"
                label="Order"
                size="small"
                control={editControl}
                error={!!editErrors.order}
                helperText={editErrors.order?.message}
                disabled={isLoading}
              />

              <Button
                variant="contained"
                startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
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

export default VideoCodec;
