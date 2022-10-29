import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";

import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import DebouncePromise from "awesome-debounce-promise";
import { Waypoint } from "react-waypoint";

import {
  Box,
  CircularProgress,
  Grid,
  InputAdornment,
  OutlinedInput,
  Paper,
  Rating,
  styled,
  Tooltip,
} from "@mui/material";

import { faHeart, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";

import { Data } from "./types";

import {
  Button,
  GlobalLoaderContext,
  Quality,
  RewatchIndicator,
  Table,
} from "@components";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const SearchContainer = styled(Paper)({
  padding: 8,
  marginBottom: 24,
});

const SearchBox = styled(OutlinedInput)({
  paddingRight: 8,
});

const SearchIconContainer = styled(FontAwesomeSvgIcon)({
  marginRight: 4,
});

const CustomTable = styled(Table.Element)({
  minWidth: 650,
});

const CustomTableRow = styled(Table.Row)({
  cursor: "pointer",
});

const StyledRating = styled(Rating)(({ value }) => ({
  "& .MuiRating-iconFilled": {
    color: value
      ? value > 3.75
        ? "#28a745"
        : value > 3
        ? "#1e90ff"
        : "#e57373"
      : "",
  },
}));

const RatingIcon = styled(FontAwesomeSvgIcon)({
  marginRight: 2,
  fontSize: 14,
});

const SpinnerContainer = styled(Box)({
  width: "100%",
  textAlign: "center",
  marginTop: 16,
});

const searchAPI = (needle: string) =>
  axios.get("/entries", {
    params: {
      haystack: "title",
      needle,
    },
  });

const searchAPIDebounced = DebouncePromise(searchAPI, 250);

const Home = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(true);

  const handleChange = (e: any) => {
    const element = e.target as HTMLInputElement;
    const val = element.value;

    setSearchQuery(val);
    toggleLoader(true);

    searchAPIDebounced(val).then(({ data: { data } }) => {
      toggleLoader(false);
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
            setHasNext(meta.has_next);
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
          setHasNext(meta.has_next);
        }

        toggleLoader(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <ModuleContainer>
      <SearchContainer>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Button variant="contained" href="/home/add" fullWidth>
              Add
            </Button>
          </Grid>
          <Grid item xs={12} md={10}>
            <SearchBox
              size="small"
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <SearchIconContainer icon={faMagnifyingGlass} />
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
              <Table.Cell>Rating</Table.Cell>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {!isLoading ? (
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
                  <Table.Cell>{item.encoder}</Table.Cell>
                  <Table.Cell>
                    <Tooltip title={item.rating ?? "0"} placement="top">
                      <Box>
                        <StyledRating
                          value={item.rating ? item.rating / 2 : 0}
                          precision={0.25}
                          icon={<RatingIcon icon={faHeart} />}
                          emptyIcon={<RatingIcon icon={faHeartEmpty} />}
                          readOnly
                        />
                      </Box>
                    </Tooltip>
                  </Table.Cell>
                </CustomTableRow>
              ))
            ) : (
              <Table.Loader />
            )}
          </Table.Body>
        </CustomTable>
      </Table.Container>

      <Waypoint onEnter={fetchNextPage}>
        {!isLoading && hasNext ? (
          <SpinnerContainer children={<CircularProgress />} />
        ) : null}
      </Waypoint>
    </ModuleContainer>
  );
};

export default Home;
