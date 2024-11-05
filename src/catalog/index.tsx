import axios from "axios";
import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { Edit as EditIcon, Trash as DeleteIcon } from "react-feather";
import { toast } from "sonner";

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
  Dialog,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
  Table,
} from "@components";

import { Catalogs, Data } from "./types";

const CustomMenuList = styled(MenuList)<{ component: any }>({
  padding: 0,
  overflow: "hidden",
  width: "100%",
});

const Catalog = () => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [isTableLoading, setTableLoading] = useState(false);
  const [selectedDeleteItem, setSelectedDeleteItem] = useState<string>();
  const [selectedDeleteCatalog, setSelectedDeleteCatalog] = useState<string>();
  const [isDeleteItemOpen, setDeleteItemOpen] = useState(false);
  const [isDeleteCatalogOpen, setDeleteCatalogOpen] = useState(false);

  const [data, setData] = useState<Data>([]);
  const [catalogs, setCatalogs] = useState<Catalogs>([]);
  const [selected, setSelected] = useState("");

  const handleClickCatalog = async (uuid: string) => {
    if (uuid !== selected) {
      try {
        setTableLoading(true);

        const {
          data: { data },
        } = await axios.get(`/catalogs/${uuid}/partials`);

        setData(() => data);
        setSelected(uuid);
      } catch (err) {
        console.error(err);
        toast.error("Failed");
      } finally {
        setTableLoading(false);
      }
    }
  };

  const handleEditItemClick = (uuid: string) => {
    route(`/catalogs/edit/${uuid}`);
  };

  const handleEditCatalogClick = (e: any, uuid: string) => {
    e.stopPropagation();

    route(`/catalogs/edit-multi/${uuid}`);
  };

  const handleDeleteItemClick = (uuid: string) => {
    setSelectedDeleteItem(uuid);
    setDeleteItemOpen(true);
  };

  const handleDeleteItemSubmit = async () => {
    try {
      setDeleteItemOpen(false);
      setTableLoading(true);

      await axios.delete(`/partials/${selectedDeleteItem}`);
      toast.success("Success");

      const {
        data: { data },
      } = await axios.get(`/catalogs/${selected}/partials`);

      setData(() => data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const handleDeleteCatalogClick = (e: any, uuid: string) => {
    e.stopPropagation();
    setSelectedDeleteCatalog(uuid);
    setDeleteCatalogOpen(true);
  };

  const handleDeleteCatalogSubmit = async () => {
    try {
      setDeleteCatalogOpen(false);
      setTableLoading(true);

      await axios.delete(`/catalogs/${selectedDeleteCatalog}`);
      toast.success("Success");

      const {
        data: { data },
      } = await axios.get("/catalogs");

      setCatalogs(() => data);

      if (data.length) handleClickCatalog(data[0].uuid);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchData = async () => {
    toggleLoader(true);
    try {
      const {
        data: { data },
      } = await axios.get("/catalogs");

      setCatalogs(() => data);
      toggleLoader(false);

      if (data.length) handleClickCatalog(data[0].uuid);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="Catalogs">
      <Grid container spacing={2}>
        <Grid container size={{ xs: 12, sm: 5, md: 4, lg: 3 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => route("/catalogs/add")}
            >
              Add Single
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => route("/catalogs/add-multi")}
            >
              Add Catalog
            </Button>
          </Grid>
          <Button
            variant="contained"
            fullWidth
            onClick={() => route("/catalogs/manage")}
          >
            Manage Catalog Data
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
                  onClick={(e) => handleEditCatalogClick(e, item.uuid)}
                  children={<EditIcon size={16} />}
                  sx={{ marginRight: 0.5 }}
                />
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteCatalogClick(e, item.uuid)}
                  children={<DeleteIcon size={16} />}
                />
              </MenuItem>
            ))}
          </CustomMenuList>
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 8, lg: 9 }}>
          <Table.Container component={Paper}>
            <Table.Element>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>Title</Table.Cell>
                  <Table.Cell>Priority</Table.Cell>
                  <Table.Cell sx={{ minWidth: 100, width: 100 }} />
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {!isTableLoading ? (
                  data.map((item) => (
                    <Table.Row hover key={item.uuid}>
                      <Table.Cell>{item.title}</Table.Cell>
                      <Table.Cell>{item.priority}</Table.Cell>
                      <Table.Cell sx={{ textAlign: "right" }}>
                        <IconButton
                          size="small"
                          onClick={() => handleEditItemClick(item.uuid)}
                          children={<EditIcon size={18} />}
                        />
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteItemClick(item.uuid)}
                          sx={{ ml: 1 }}
                          children={<DeleteIcon size={18} />}
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

      <Dialog
        title="Are you sure?"
        text="This content would be deleted."
        onSubmit={handleDeleteItemSubmit}
        open={isDeleteItemOpen}
        setOpen={setDeleteItemOpen}
      />

      <Dialog
        title="Are you sure?"
        text="This content would be deleted."
        onSubmit={handleDeleteCatalogSubmit}
        open={isDeleteCatalogOpen}
        setOpen={setDeleteCatalogOpen}
      />
    </ModuleContainer>
  );
};

export default Catalog;
