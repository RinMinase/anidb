import { useEffect, useState } from "preact/hooks";
import axios from "axios";

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

import Search from "@mui/icons-material/Search";

import { Data } from "./types";

const HomeContainer = styled(Box)({
  paddingBottom: 24,
})

const SearchContainer = styled(Paper)({
  marginTop: 8,
  marginBottom: 24,
  padding: 8,
});

const SearchBox = styled(OutlinedInput)({
  paddingRight: 8,
});

const CustomTable = styled(Table)({
  minWidth: 650,
});

const Home = () => {
  const [data, setData] = useState<Data>([]);

  const retrieveData = () => {
    axios
      .get("/entries")
      .then(({ data }) => { setData(() => data.data) })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    retrieveData();
  }, []);

  return (
    <HomeContainer>
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
                  <Search />
                </InputAdornment>
              }
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
            {data.map((item) => (
              <TableRow hover key={item.id}>
                <TableCell>{item.title}</TableCell>
                <TableCell>
                  {item.episodes} / {item.ovas} / {item.specials}
                </TableCell>
                <TableCell>{item.filesize}</TableCell>
                <TableCell>{item.dateFinished}</TableCell>
                <TableCell>{item.release}</TableCell>
                <TableCell>{item.encoder}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </CustomTable>
      </TableContainer>
    </HomeContainer>
  );
};

export default Home;
