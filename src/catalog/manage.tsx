// commit to change to lf

import { useContext, useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { Waypoint } from "react-waypoint";
import { route } from "preact-router";
import axios from "axios";
import DebouncePromise from "awesome-debounce-promise";

import {
  Search as SearchIcon,
  Edit as EditIcon,
  Trash as DeleteIcon,
} from "react-feather";

import {
  Box,
  CircularProgress,
  InputAdornment,
  OutlinedInput,
  Paper,
} from "@mui/material";

import {
  Dialog,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
  Table,
} from "@components";

import { PartialsListData, PartialsListItem, TableHeadings } from "./types";

const headings: TableHeadings = [
  { id: "id_catalog", label: "Catalog", sortable: true },
  { id: "title", label: "Title", sortable: true },
  { id: "id_priority", label: "Priority", sortable: true },
  { id: "action", label: "", width: "110px" },
];

const searchAPI = (query: string, column: string, order: "asc" | "desc") => {
  return axios.get("/partials", {
    params: { query: query ?? null, column, order },
  });
};

const searchAPIDebounced = DebouncePromise(searchAPI, 500);

const CatalogManage = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [isTableLoading, setTableLoading] = useState(false);
  const [data, setData] = useState<PartialsListData>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<PartialsListItem>({
    uuid: "",
    title: "",
    catalog: "",
    priority: "Low",
  });

  // Pagination States
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  // Sort States
  const [column, setColumn] = useState("id_catalog");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetchData = async () => {
    try {
      setTableLoading(true);

      const {
        data: { data, meta },
      } = await axios.get("/partials", {
        params: {
          page,
          query: searchQuery ?? null,
          column,
          order,
        },
      });

      setData(() => data);

      if (meta) {
        setHasNext(meta.hasNext);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchNextPage = async () => {
    try {
      if (hasNext) {
        const {
          data: { data, meta },
        } = await axios.get("/partials", {
          params: {
            page: page + 1,
            query: searchQuery ?? null,
            column,
            order,
          },
        });

        setData((prev) => [...prev, ...data]);
        setPage(page + 1);

        if (meta) {
          setHasNext(meta.hasNext);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleChange = async (evt: any) => {
    try {
      const element = evt.target as HTMLInputElement;
      const val = element.value;

      setSearchQuery(val);
      setTableLoading(true);
      setPage(1);

      const {
        data: { data, meta },
      } = await searchAPIDebounced(val, column, order);

      setData(data);

      if (meta) {
        setHasNext(meta.hasNext);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const handleChangeSort = async (sortColumn: string) => {
    try {
      setTableLoading(true);

      const isAsc = column === sortColumn && order === "asc";
      const shouldReset = column === sortColumn && order === "desc";

      const newOrder = isAsc ? "desc" : "asc";
      const newColumn = shouldReset ? "id_catalog" : sortColumn;
      const newPage = 1;

      setOrder(newOrder);
      setColumn(newColumn);
      setPage(newPage);

      const {
        data: { data, meta },
      } = await axios.get("/partials", {
        params: {
          page: newPage,
          query: searchQuery ?? null,
          column: newColumn,
          order: newOrder,
        },
      });

      setData(data);

      if (meta) {
        setHasNext(meta.hasNext);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const handleDeleteClick = (item: PartialsListItem) => {
    setSelectedData(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      setDeleteDialogOpen(false);
      setTableLoading(true);

      await axios.delete(`/partials/${selectedData.uuid}`);
      toast.success("Success");

      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer
      headerText="Manage Catalogs and Partials"
      handleBack={() => route("/catalogs")}
    >
      <Paper
        sx={{
          position: "sticky",
          top: 0,
          padding: 1,
          marginBottom: 3,
          zIndex: 500,
        }}
      >
        <OutlinedInput
          sx={{ paddingRight: 1 }}
          size="small"
          fullWidth
          onChange={handleChange}
          value={searchQuery}
          placeholder="Search for Titles"
          endAdornment={
            <InputAdornment
              position="end"
              children={<SearchIcon />}
              sx={{ marginRight: 0.5 }}
            />
          }
        />
      </Paper>

      <Table.Container component={Paper}>
        <Table.Element sx={{ minWidth: 650 }}>
          <Table.Head>
            <Table.Row>
              {headings.map((heading) => {
                return (
                  <Table.Cell
                    key={heading.id}
                    sx={{
                      minWidth: heading.minWidth ?? undefined,
                      width: heading.width ?? undefined,
                    }}
                  >
                    {heading.sortable ? (
                      <Table.SortHeader
                        active={column === heading.id}
                        direction={column === heading.id ? order : "asc"}
                        onClick={() => handleChangeSort(heading.id)}
                      >
                        {heading.label}
                      </Table.SortHeader>
                    ) : (
                      heading.label
                    )}
                  </Table.Cell>
                );
              })}
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {!isTableLoading ? (
              data.map((item) => (
                <Table.Row hover key={item.uuid}>
                  <Table.Cell>{item.catalog}</Table.Cell>
                  <Table.Cell>{item.title}</Table.Cell>
                  <Table.Cell>{item.priority ?? "-"}</Table.Cell>
                  <Table.Cell sx={{ textAlign: "right" }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        route(`/catalogs/manage-edit/${item.uuid}`)
                      }
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

      {data.length && !isLoading ? (
        <Waypoint onEnter={fetchNextPage}>
          {!isLoading && hasNext ? (
            <Box
              children={<CircularProgress />}
              sx={{ width: "100%", textAlign: "center", marginTop: 2 }}
            />
          ) : null}
        </Waypoint>
      ) : null}

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

export default CatalogManage;
