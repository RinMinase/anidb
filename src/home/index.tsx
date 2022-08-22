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
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

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
              <TableCell>E / O / S</TableCell>
              <TableCell>Filesize</TableCell>
              <TableCell>Date Finished</TableCell>
              <TableCell>Release</TableCell>
              <TableCell>Encoder</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!isLoading ? (
              data.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>
                    <Quality quality={item.quality} />
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
