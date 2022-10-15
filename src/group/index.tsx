import { useContext, useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import axios from "axios";
import Swal from "sweetalert2";

import {
  Box,
  Grid,
  Paper,
  Stack,
  styled,
} from "@mui/material";

import {
  faFloppyDisk as SaveIcon,
  faPenToSquare as EditIcon,
  faTrash as DeleteIcon,
} from "@fortawesome/free-solid-svg-icons";

import {
  Button,
  ControlledField,
  GlobalLoaderContext,
  IconButton,
  Table,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";
import { Data } from "./types";

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

const Group = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const fetchData = async () => {
    try {
      const { data: { data } } = await axios.get("/groups");

      setData(() => data);
    } catch (err) {
      console.error(err);
    } finally {
      toggleLoader(false);
    }
  };

  const handleEditClick = async (uuid: string) => {};

  const handleDeleteClick = async (uuid: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted",
      icon: "error",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      toggleLoader(true);

      await axios.delete(`/groups/${uuid}`);
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
      await axios.post("/groups", formdata);

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
              name="name"
              label="Group Name"
              size="small"
              control={control}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={isLoading}
            />
            <Button
              variant="contained"
              startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
              onClick={handleSubmit(handleSubmitForm)}
            >
              Add Group
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
          <Table.Container component={Paper}>
            <CustomTable>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>Name</Table.Cell>
                  <Table.Cell />
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {!isLoading ? (
                  data.map((item) => (
                    <Table.Row hover key={item.uuid}>
                      <Table.Cell>{item.name}</Table.Cell>
                      <ActionTableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(item.uuid)}
                        >
                          <FontAwesomeSvgIcon icon={EditIcon} />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(item.uuid)}
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
    </ModuleContainer>
  );
};

export default Group;
