import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { Edit as EditIcon, Trash as DeleteIcon } from "react-feather";

import {
  Grid2 as Grid,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  styled,
} from "@mui/material";

import {
  Button,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
  Swal,
  Table,
} from "@components";

import { Catalogs, Data } from "./types";

const CustomMenuList = styled(MenuList)<{ component: any }>({
  marginTop: 12,
  padding: 0,
  overflow: "hidden",
});

const CustomTable = styled(Table.Element)({
  minWidth: 650,
});

const ActionTableCell = styled(Table.Cell)({
  textAlign: "right",
});

const Catalog = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);
  const [catalogs, setCatalogs] = useState<Catalogs>([]);
  const [selected, setSelected] = useState("");

  const handleClickCatalog = (uuid: string) => {
    if (uuid !== selected) {
      toggleLoader(true);

      axios
        .get(`/catalogs/${uuid}/partials`)
        .then(({ data: { data } }) => {
          setData(() => data);
          setSelected(uuid);
        })
        .catch((err) => console.error(err))
        .finally(() => toggleLoader(false));
    }
  };

  const handleEditClick = (uuid: string) => {
    route(`/catalogs/edit/${uuid}`);
  };

  const handleEditMultiClick = (e: any, uuid: string) => {
    e.stopPropagation();

    route(`/catalogs/edit-multi/${uuid}`);
  };

  const handleDeleteClick = async (uuid: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted",
      icon: "error",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      toggleLoader(true);

      await axios.delete(`/partials/${uuid}`);
      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      const {
        data: { data },
      } = await axios.get(`/catalogs/${selected}/partials`);

      setData(() => data);
      toggleLoader(false);
    }
  };

  const handleDeleteMultiClick = async (e: any, uuid: string) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted",
      icon: "error",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      toggleLoader(true);

      await axios.delete(`/catalogs/${uuid}`);
      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      const {
        data: { data },
      } = await axios.get("/catalogs");

      setCatalogs(() => data);

      if (data.length) handleClickCatalog(data[0].uuid);

      toggleLoader(false);
    }
  };

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/catalogs")
      .then(({ data: { data } }) => {
        setCatalogs(() => data);

        if (data.length) handleClickCatalog(data[0].uuid);
      })
      .catch((err) => {
        console.error(err);
        toggleLoader(false);
      });
  }, []);

  return (
    <ModuleContainer headerText="Catalogs">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => route("/catalogs/add")}
          >
            Add Single
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={() => route("/catalogs/add-multi")}
            sx={{ mt: 1.5 }}
          >
            Add Catalog
          </Button>
          <CustomMenuList component={Paper}>
            {catalogs.map((item, index) => (
              <MenuItem
                key={`mara-${index}`}
                selected={selected === item.uuid}
                onClick={() => handleClickCatalog(item.uuid)}
              >
                <ListItemText>
                  {item.season} {item.year}
                </ListItemText>
                <IconButton
                  size="small"
                  onClick={(e) => handleEditMultiClick(e, item.uuid)}
                  children={<EditIcon size={16} />}
                  sx={{ marginRight: 0.5 }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteMultiClick(e, item.uuid)}
                  children={<DeleteIcon size={16} />}
                />
              </MenuItem>
            ))}
          </CustomMenuList>
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
          <Table.Container component={Paper}>
            <CustomTable>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>Title</Table.Cell>
                  <Table.Cell>Priority</Table.Cell>
                  <Table.Cell />
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {!isLoading ? (
                  data.map((item) => (
                    <Table.Row hover key={item.uuid}>
                      <Table.Cell>{item.title}</Table.Cell>
                      <Table.Cell>{item.priority}</Table.Cell>
                      <ActionTableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(item.uuid)}
                          children={<EditIcon size={18} />}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(item.uuid)}
                          sx={{ ml: 1 }}
                          children={<DeleteIcon size={18} />}
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
    </ModuleContainer>
  );
};

export default Catalog;
