import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";

import {
  Box,
  Grid,
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
  Typography,
} from "@mui/material";

import {
  faBan as UncategorizedIcon,
  faLeaf as FallIcon,
  faSnowflake as WinterIcon,
  faSun as SummerIcon,
  faTree as SpringIcon,
} from "@fortawesome/free-solid-svg-icons";

import { GlobalLoaderContext } from "@components";
import { Data, YearData } from "./types";
import { Stack } from "@mui/system";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const CustomTable = styled(Table)({
  minWidth: 650,
});

const Icon = styled(FontAwesomeSvgIcon)({
  marginRight: 8,
});

const ByYear = () => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>({});
  const [yearData, setYearData] = useState<YearData>([]);
  const [selectedYear, setSelectedYear] = useState<number|null>(null);

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/entries/by-year")
      .then(({ data: { data } }) => {
        setYearData(() => data);
        const firstYear = data[0].year;

        axios
          .get(`entries/by-year/${firstYear}`)
          .then(({ data: { data } }) => {
            setData(() => data);
          })
          .catch((err) => console.error(err))
          .finally(() => toggleLoader(false));
      })
      .catch((err) => {
        console.error(err);
        toggleLoader(false);
      });
  }, []);

  const handleClickYear = (id: number | null) => {
    toggleLoader(true);
    setSelectedYear(id);

    const yearId = id ?? "null";

    axios
      .get(`/entries/by-year/${yearId}`)
      .then(({ data: { data } }) => {
        setData(() => data);
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  };

  return (
    <ModuleContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
          <MenuList component={Paper}>
            {yearData.map((item, index) => (
              <MenuItem
                key={`mara-${index}`}
                onClick={() => handleClickYear(item.year)}
                selected={selectedYear === item.year}
              >
                {item.year ?? "Uncategorized"}
              </MenuItem>
            ))}
          </MenuList>
        </Grid>

        <Grid item xs={12} sm={7} md={9}>
          <Stack spacing={3}>
            {data.Uncategorized?.length ? (
              <Box>
                <Typography variant="h5" gutterBottom>
                  <Icon icon={UncategorizedIcon} color="#d32f2f" />
                  Uncategorized
                </Typography>
                <TableContainer component={Paper}>
                  <CustomTable>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.Uncategorized.map((item) => (
                        <TableRow hover key={item.uuid}>
                          <TableCell>{item.title}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </CustomTable>
                </TableContainer>
              </Box>
            ) : null}

            {data.Winter?.length ? (
              <Box>
                <Typography variant="h5" gutterBottom>
                  <Icon icon={WinterIcon} color="#87ceeb" />
                  Winter
                </Typography>
                <TableContainer component={Paper}>
                  <CustomTable>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.Winter.map((item) => (
                        <TableRow hover key={item.uuid}>
                          <TableCell>{item.title}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </CustomTable>
                </TableContainer>
              </Box>
            ) : null}

            {data.Spring?.length ? (
              <Box>
                <Typography variant="h5" gutterBottom>
                  <Icon icon={SpringIcon} color="#008000" />
                  Spring
                </Typography>
                <TableContainer component={Paper}>
                  <CustomTable>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.Spring.map((item) => (
                        <TableRow hover key={item.uuid}>
                          <TableCell>{item.title}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </CustomTable>
                </TableContainer>
              </Box>
            ) : null}

            {data.Summer?.length ? (
              <Box>
                <Typography variant="h5" gutterBottom>
                  <Icon icon={SummerIcon} color="#ffa726" />
                  Summer
                </Typography>
                <TableContainer component={Paper}>
                  <CustomTable>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.Summer.map((item) => (
                        <TableRow hover key={item.uuid}>
                          <TableCell>{item.title}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </CustomTable>
                </TableContainer>
              </Box>
            ) : null}

            {data.Fall?.length ? (
              <Box>
                <Typography variant="h5" gutterBottom>
                  <Icon icon={FallIcon} color="#ff5722" />
                  Fall
                </Typography>
                <TableContainer component={Paper}>
                  <CustomTable>
                    <TableHead>
                      <TableRow>
                        <TableCell>Title</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {data.Fall.map((item) => (
                        <TableRow hover key={item.uuid}>
                          <TableCell>{item.title}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </CustomTable>
                </TableContainer>
              </Box>
            ) : null}
          </Stack>
        </Grid>
      </Grid>
    </ModuleContainer>
  );
};

export default ByYear;
