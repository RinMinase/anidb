// commit to change to lf
import { useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import {
  Backdrop,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
  Paper,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
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
  ControlledPasswordField,
  Dialog,
  IconButton,
  ModuleContainer,
  Table,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";
import { Data, Item } from "./types";
import { format } from "date-fns";

const CustomDialog = styled(Paper)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
  maxHeight: "80vh",
});

const Users = () => {
  const theme = useTheme();
  const isLargeTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"));

  const [isAddButtonLoading, setAddButtonLoading] = useState(false);
  const [isEditButtonLoading, setEditButtonLoading] = useState(false);
  const [isTableLoading, setTableLoading] = useState(true);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [data, setData] = useState<Data>([]);
  const [selectedData, setSelectedData] = useState<Partial<Item>>({
    uuid: "",
    username: "",
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
    handleSubmit: editHandleSubmit,
    setError: editSetError,
    reset: editReset,
    formState: { errors: editErrors },
  } = useForm<Form>({ resolver, mode: "onChange" });

  const fetchData = async () => {
    setTableLoading(true);

    try {
      const {
        data: { data },
      } = await axios.get("/users");

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

    editSetValue("username", item.username);

    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (formdata: Form) => {
    try {
      setEditButtonLoading(true);

      const uuid = selectedData.uuid;
      await axios.put(`/users/${uuid}`, formdata);
      toast.success("Success");

      setEditButtonLoading(false);
      setTableLoading(true);
      setEditDialogOpen(false);
      editReset();

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

      await axios.delete(`/users/${selectedData.uuid}`);
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

      await axios.post("/users", formdata);
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
    <ModuleContainer headerText="Additional Non-admin Users">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <Stack spacing={2}>
            <ControlledField
              name="username"
              label="Username"
              size="small"
              control={control}
              error={!!errors.username}
              helperText={errors.username?.message}
              disabled={isAddButtonLoading || isTableLoading}
            />
            <ControlledPasswordField
              name="password"
              label="Password"
              size="small"
              control={control}
              error={!!errors.password}
              helperText={errors.password?.message}
              disabled={isAddButtonLoading || isTableLoading}
            />
            <ControlledPasswordField
              name="password_confirmation"
              label={`${isLargeTablet ? "PW" : "Password"} Confirmation`}
              size="small"
              control={control}
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
              disabled={isAddButtonLoading || isTableLoading}
            />
            <ButtonLoading
              variant="contained"
              startIcon={<AddIcon size={20} />}
              onClick={handleSubmit(handleSubmitForm)}
              loading={isAddButtonLoading || isTableLoading}
            >
              Add User
            </ButtonLoading>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 8, md: 9 }}>
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
                 */
                md: "calc(100vh - 48px - 48px - 49px)",
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
                  <Table.Cell>Username</Table.Cell>
                  <Table.Cell>UUID</Table.Cell>
                  <Table.Cell>Created at</Table.Cell>
                  <Table.Cell>Updated at</Table.Cell>
                  <Table.Cell />
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {!isTableLoading ? (
                  data.map((item) => (
                    <Table.Row hover key={`codec-${item.uuid}`}>
                      <Table.Cell>{item.username}</Table.Cell>
                      <Table.Cell>{item.uuid}</Table.Cell>
                      <Table.Cell sx={{ minWidth: 180 }}>
                        {format(item.createdAt, "yyyy-MM-dd HH:ii:ss")}
                      </Table.Cell>
                      <Table.Cell sx={{ minWidth: 180 }}>
                        {format(item.updatedAt, "yyyy-MM-dd HH:ii:ss")}
                      </Table.Cell>
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
                name="username"
                label="Username"
                size="small"
                control={editControl}
                error={!!editErrors.username}
                helperText={editErrors.username?.message}
                disabled={isEditButtonLoading}
              />
              <ControlledPasswordField
                name="password"
                label="Password"
                size="small"
                control={editControl}
                error={!!editErrors.password}
                helperText={editErrors.password?.message}
                disabled={isEditButtonLoading}
              />
              <ControlledPasswordField
                name="password_confirmation"
                label="Password Confirmation"
                size="small"
                control={editControl}
                error={!!editErrors.password_confirmation}
                helperText={editErrors.password_confirmation?.message}
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
    </ModuleContainer>
  );
};

export default Users;
