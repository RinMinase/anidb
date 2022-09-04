import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";
import Swal from "sweetalert2";

import {
  Box,
  Button,
  Grid,
  IconButton,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import {
  faPenToSquare as EditIcon,
  faTrash as DeleteIcon,
} from "@fortawesome/free-solid-svg-icons";

import { GlobalLoaderContext, TableLoader } from "@components";

import { Catalogs, Data } from "./types";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const CustomMenuList = styled(MenuList)<{ component: any }>({
  marginTop: 12,
  padding: 0,
  overflow: "hidden",
});

const CustomTable = styled(Table)({
  minWidth: 650,
});

const ActionTableCell = styled(TableCell)({
  textAlign: "right",
});

const Catalog = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);
  const [catalogs, setCatalogs] = useState<Catalogs>([]);
  const [selected, setSelected] = useState("");

  const handleClickCatalog = (id: string) => {
    if (id !== selected) {
      toggleLoader(true);

      axios
        .get(`/catalogs/${id}`)
        .then(({ data: { data } }) => {
          setData(() => data);
          setSelected(id);
        })
        .catch((err) => console.error(err))
        .finally(() => toggleLoader(false));
    }
  };

  const handleEditClick = (id: string) => {
    route(`/catalogs/edit/${id}`);
  };

  const handleEditMultiClick = (e: any, id: string) => {
    e.stopPropagation();
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

      await axios.delete(`/partials/${id}`);
      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      handleClickCatalog(selected);
      toggleLoader(false);
    }
  };

  const handleDeleteMultiClick = async (e: any, id: string) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted",
      icon: "error",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      toggleLoader(true);

      await axios.delete(`/catalogs/${id}`);
      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      const {
        data: { data },
      } = await axios.get("/catalogs");

      setCatalogs(() => data);

      if (data.length) handleClickCatalog(data[0].id);

      toggleLoader(false);
    }
  };

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/catalogs")
      .then(({ data: { data } }) => {
        setCatalogs(() => data);

        if (data.length) handleClickCatalog(data[0].id);
      })
      .catch((err) => {
        console.error(err);
        toggleLoader(false);
      });
  }, []);

  return (
    <ModuleContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
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
                selected={selected === item.id}
                onClick={() => handleClickCatalog(item.id)}
              >
                <ListItemText>
                  {item.season} {item.year}
                </ListItemText>
                <IconButton
                  size="small"
                  onClick={(e) => handleEditMultiClick(e, item.id)}
                >
                  <FontAwesomeSvgIcon icon={EditIcon} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteMultiClick(e, item.id)}
                >
                  <FontAwesomeSvgIcon icon={DeleteIcon} />
                </IconButton>
                {}
              </MenuItem>
            ))}
          </CustomMenuList>
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
          <TableContainer component={Paper}>
            <CustomTable>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {!isLoading ? (
                  data.map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.priority}</TableCell>
                      <ActionTableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(item.id)}
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
                    </TableRow>
                  ))
                ) : (
                  <TableLoader />
                )}
              </TableBody>
            </CustomTable>
          </TableContainer>
        </Grid>
      </Grid>
    </ModuleContainer>
  );
};

export default Catalog;
