import { useContext, useState } from "preact/hooks";
import { route } from "preact-router";
import { Waypoint } from "react-waypoint";
import { Search as SearchIcon } from "react-feather";
import { toast } from "sonner";
import axios from "axios";
import DebouncePromise from "awesome-debounce-promise";

import {
  Box,
  CircularProgress,
  Grid2 as Grid,
  InputAdornment,
  OutlinedInput,
  Paper,
  Rating,
  styled,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import RatingFilledIcon from "@components/icons/heart-filled.svg?react";
import RatingEmptyIcon from "@components/icons/heart.svg?react";

import {
  Button,
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  RewatchIndicator,
  Table,
} from "@components";

import { Data, TableHeadings } from "./types";

const StyledRating = styled(Rating)(({ value }) => ({
  "& .MuiRating-decimal": {
    marginRight: 2,
  },
  "& .MuiRating-iconFilled": {
    width: 14,
    fill: value
      ? value > 3.75
        ? "#28a745"
        : value > 3
        ? "#1e90ff"
        : "#e57373"
      : "",
  },
}));

const headings: TableHeadings = [
  { id: "title", label: "Title", sortable: true },
  { id: "episodes", label: "E / O / S", minWidth: 110 },
  { id: "filesize", label: "Filesize", minWidth: 115, sortable: true },
  {
    id: "date_finished",
    label: "Date Finished",
    minWidth: 205,
    sortable: true,
  },
  { id: "release", label: "Release", minWidth: 130 },
  { id: "encoder", label: "Encoder" },
  { id: "rating", label: "Rating", hideOnMobile: true },
];

const searchAPI = (query: string, column: string, order: "asc" | "desc") => {
  return axios.get("/entries", {
    params: { query: query ?? null, column, order },
  });
};

const searchAPIDebounced = DebouncePromise(searchAPI, 500);

const Home = () => {
  const { isLoading } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isTableLoading, setTableLoading] = useState(false);
  const [isPageLoading, setPageLoading] = useState(false);
  const [showStartSearchingBanner, setStartSearchingBanner] = useState(true);
  const [data, setData] = useState<Data>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination States
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  // Sort States
  const [column, setColumn] = useState("id_quality");
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const fetchNextPage = async () => {
    try {
      if (hasNext) {
        setPageLoading(true);

        const {
          data: { data, meta },
        } = await axios.get("/entries", {
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
      setPageLoading(false);
    }
  };

  const handleChange = async (evt: any) => {
    try {
      const element = evt.target as HTMLInputElement;
      const val = element.value;

      setSearchQuery(val);

      if (!val || val.length < 3) {
        setStartSearchingBanner(true);
        setData([]);
        return;
      }

      setTableLoading(true);
      setPage(1);
      setStartSearchingBanner(false);

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
      const newColumn = shouldReset ? "id_quality" : sortColumn;
      const newPage = 1;

      setOrder(newOrder);
      setColumn(newColumn);
      setPage(newPage);

      const {
        data: { data, meta },
      } = await axios.get("/entries", {
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

  return (
    <ModuleContainer>
      <Paper
        sx={{
          position: "sticky",
          top: 0,
          padding: 1,
          marginBottom: 3,
          zIndex: 500,
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button variant="contained" href="/home/add" fullWidth>
              Add
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 10 }}>
            <OutlinedInput
              sx={{ paddingRight: 1 }}
              size="small"
              fullWidth
              onChange={handleChange}
              value={searchQuery}
              placeholder="Search for Titles, Release Season or Encoders"
              endAdornment={
                <InputAdornment
                  position="end"
                  children={<SearchIcon />}
                  sx={{ marginRight: 0.5 }}
                />
              }
            />
          </Grid>
        </Grid>
      </Paper>

      <Table.Container component={Paper}>
        <Table.Element sx={{ minWidth: 650 }}>
          <Table.Head>
            <Table.Row>
              {headings.map((heading) => {
                if (heading.hideOnMobile && isMobile) {
                  return null;
                }

                return (
                  <Table.Cell
                    key={heading.id}
                    sx={{ minWidth: heading.minWidth ?? undefined }}
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
            {showStartSearchingBanner ? (
              <Table.Row>
                <Table.Cell
                  colSpan={42}
                  sx={{
                    fontSize: 14,
                    color: "#999",
                    letterSpacing: "1px",
                    textAlign: { md: "center" },
                  }}
                >
                  <span>Start searching with at least</span>
                  {isMobile ? <br /> : " "}
                  <span>three characters to show results</span>
                </Table.Cell>
              </Table.Row>
            ) : null}

            {isTableLoading ? (
              <Table.Loader />
            ) : (
              data.map((item) => (
                <Table.Row
                  hover
                  sx={{ cursor: "pointer" }}
                  key={item.id}
                  onClick={() => route(`/home/view/${item.id}`)}
                >
                  <Table.Cell>
                    <Quality quality={item.quality} />
                    {item.title}
                  </Table.Cell>
                  <Table.Cell>
                    {item.episodes} / {item.ovas} / {item.specials}
                  </Table.Cell>
                  <Table.Cell>{item.filesize}</Table.Cell>
                  <Table.Cell>
                    {item.dateFinished}
                    <RewatchIndicator
                      show={item.rewatched}
                      times={item.rewatchCount}
                    />
                  </Table.Cell>
                  <Table.Cell>{item.release}</Table.Cell>
                  <Table.Cell>{item.encoder}</Table.Cell>

                  {!isMobile && (
                    <Table.Cell>
                      <Tooltip title={`${item.rating} / 10`} placement="top">
                        <Box>
                          <StyledRating
                            value={item.ratingOver5}
                            precision={0.25}
                            icon={<RatingFilledIcon width={14} />}
                            emptyIcon={<RatingEmptyIcon width={14} />}
                            readOnly
                          />
                        </Box>
                      </Tooltip>
                    </Table.Cell>
                  )}
                </Table.Row>
              ))
            )}
          </Table.Body>
        </Table.Element>
      </Table.Container>

      {data.length && !isLoading ? (
        <Waypoint onEnter={fetchNextPage}>
          {!isPageLoading && hasNext ? (
            <Box
              children={<CircularProgress />}
              sx={{ width: "100%", textAlign: "center", marginTop: 2 }}
            />
          ) : null}
        </Waypoint>
      ) : null}
    </ModuleContainer>
  );
};

export default Home;
