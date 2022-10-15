import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import {
  Box,
  Grid,
  Paper,
  Stack,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";

import {
  faPenToSquare as EditIcon,
  faTrash as DeleteIcon,
} from "@fortawesome/free-solid-svg-icons";

import {
  Button,
  GlobalLoaderContext,
  IconButton,
  TableLoader,
} from "@components";

import { Data } from "./types";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const CustomTable = styled(Table)({
  minWidth: 650,
});

const ActionTableCell = styled(TableCell)({
  textAlign: "right",
});

const Group = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);

  const handleEditClick = async (uuid: string) => {};

  const handleDeleteClick = async (uuid: string) => {};

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/groups")
      .then(({ data: { data } }) => {
        setData(() => data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        toggleLoader(false);
      });
  }, []);

  return (
    <ModuleContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
          <Stack spacing={2}>
            <TextField size="small" fullWidth />
            <Button
              variant="contained"
              fullWidth
              onClick={() => route("/catalogs/add")}
            >
              Add Group
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
          <TableContainer component={Paper}>
            <CustomTable>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>

              <TableBody>
                {!isLoading ? (
                  data.map((item) => (
                    <TableRow hover key={item.uuid}>
                      <TableCell>{item.name}</TableCell>
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

export default Group;
