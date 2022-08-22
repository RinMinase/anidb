import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";
import DebouncePromise from "awesome-debounce-promise";

import {
  Box,
  Button,
  Grid,
  InputAdornment,
  OutlinedInput,
  Paper,
  Rating,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";

import { faHeart, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";

import { Data } from "./types";
import {
  GlobalLoaderContext,
  Quality,
  RewatchIndicator,
  TableLoader,
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

const CustomTable = styled(Table)({
  minWidth: 650,
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

  const handleChange = (e: any) => {
    const element = e.target as HTMLInputElement;
    const val = element.value;

    toggleLoader(true);

    searchAPIDebounced(val).then(({ data: { data } }) => {
      toggleLoader(false);
      setData(data);
    });
  };

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/entries")
      .then(({ data: { data } }) => {
        setData(() => data);
        toggleLoader(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <ModuleContainer>
      <SearchContainer>
        <Grid container spacing={2}>
          <Grid item xs={12} md={2}>
            <Button variant="contained" fullWidth>
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
            />
          </Grid>
        </Grid>
      </SearchContainer>

      <TableContainer component={Paper}>
        <CustomTable>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell sx={{ minWidth: 110 }}>E / O / S</TableCell>
              <TableCell sx={{ minWidth: 115 }}>Filesize</TableCell>
              <TableCell sx={{ minWidth: 180 }}>Date Finished</TableCell>
              <TableCell sx={{ minWidth: 130 }}>Release</TableCell>
              <TableCell>Encoder</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!isLoading ? (
              data.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>
                    <Tooltip title={item.quality ?? ""} placement="top">
                      <Box display="inline-block">
                        <Quality quality={item.quality} />
                      </Box>
                    </Tooltip>
                    {item.title}
                  </TableCell>
                  <TableCell>
                    {item.episodes} / {item.ovas} / {item.specials}
                  </TableCell>
                  <TableCell>{item.filesize}</TableCell>
                  <TableCell>
                    {item.dateFinished}
                    <RewatchIndicator show={item.rewatched} />
                  </TableCell>
                  <TableCell>{item.release}</TableCell>
                  <TableCell>{item.encoder}</TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableLoader />
            )}
          </TableBody>
        </CustomTable>
      </TableContainer>
    </ModuleContainer>
  );
};

export default Home;
