import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import axios from "axios";
import DebouncePromise from "awesome-debounce-promise";
import { Waypoint } from "react-waypoint";
import { Search as SearchIcon } from "react-feather";

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

import { Data } from "./types";

import {
  Button,
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  RewatchIndicator,
  Table,
} from "@components";

const SearchContainer = styled(Paper)({
  padding: 8,
  marginBottom: 24,
});

const SearchBox = styled(OutlinedInput)({
  paddingRight: 8,
});

const SearchIconContainer = styled(SearchIcon)({
  marginRight: 4,
});

const CustomTable = styled(Table.Element)({
  minWidth: 650,
});

const CustomTableRow = styled(Table.Row)({
  cursor: "pointer",
});

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

const SpinnerContainer = styled(Box)({
  width: "100%",
  textAlign: "center",
  marginTop: 16,
});

const searchAPI = (query: string) => {
  let params = {};

  if (query) {
    params = {
      query,
    };
  }

  return axios.get("/entries", { params });
};

const searchAPIDebounced = DebouncePromise(searchAPI, 250);

const Home = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isTableLoading, setTableLoading] = useState(false);
  const [data, setData] = useState<Data>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  const handleChange = (e: any) => {
    const element = e.target as HTMLInputElement;
    const val = element.value;

    setSearchQuery(val);
    setTableLoading(true);

    searchAPIDebounced(val).then(({ data: { data } }) => {
      setTableLoading(false);
      setData(data);
    });
  };

  const fetchNextPage = () => {
    if (!searchQuery && hasNext) {
      axios
        .get("/entries", {
          params: {
            page: page + 1,
          },
        })
        .then(({ data: { data, meta } }) => {
          setData((prev) => [...prev, ...data]);
          setPage(page + 1);

          if (meta) {
            setHasNext(meta.hasNext);
          }

          toggleLoader(false);
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/entries")
      .then(({ data: { data, meta } }) => {
        setData(() => data);

        if (meta) {
          setHasNext(meta.hasNext);
        }

        toggleLoader(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <ModuleContainer>
      <SearchContainer>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 2 }}>
            <Button variant="contained" href="/home/add" fullWidth>
              Add
            </Button>
          </Grid>
          <Grid size={{ xs: 12, md: 10 }}>
            <SearchBox
              size="small"
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <SearchIconContainer />
                </InputAdornment>
              }
              onChange={handleChange}
              value={searchQuery}
            />
          </Grid>
        </Grid>
      </SearchContainer>

      <Table.Container component={Paper}>
        <CustomTable>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Title</Table.Cell>
              <Table.Cell sx={{ minWidth: 110 }}>E / O / S</Table.Cell>
              <Table.Cell sx={{ minWidth: 115 }}>Filesize</Table.Cell>
              <Table.Cell sx={{ minWidth: 190 }}>Date Finished</Table.Cell>
              <Table.Cell sx={{ minWidth: 130 }}>Release</Table.Cell>
              <Table.Cell>Encoder</Table.Cell>
              {!isMobile && <Table.Cell>Rating</Table.Cell>}
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {!isTableLoading ? (
              data.map((item) => (
                <CustomTableRow
                  hover
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
                    <RewatchIndicator show={item.rewatched} />
                  </Table.Cell>
                  <Table.Cell>{item.release}</Table.Cell>
                  <Table.Cell>
                    {item.encoder ? item.encoder.replaceAll(" ", "\u00a0") : ""}
                  </Table.Cell>

                  {!isMobile && (
                    <Table.Cell>
                      <Tooltip
                        title={`${item.rating ?? "0"} / 10`}
                        placement="top"
                      >
                        <Box>
                          <StyledRating
                            value={item.rating ? item.rating / 2 : 0}
                            precision={0.25}
                            icon={<RatingFilledIcon width={14} />}
                            emptyIcon={<RatingEmptyIcon width={14} />}
                            readOnly
                          />
                        </Box>
                      </Tooltip>
                    </Table.Cell>
                  )}
                </CustomTableRow>
              ))
            ) : (
              <Table.Loader />
            )}
          </Table.Body>
        </CustomTable>
      </Table.Container>

      {data.length && !isLoading ? (
        <Waypoint onEnter={fetchNextPage}>
          {!isLoading && hasNext ? (
            <SpinnerContainer children={<CircularProgress />} />
          ) : null}
        </Waypoint>
      ) : null}
    </ModuleContainer>
  );
};

export default Home;
