import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";

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
} from "@mui/material";

import CalendarMonthIcon from '@mui/icons-material/CalendarMonthOutlined';
import DateRangeIcon from '@mui/icons-material/DateRangeOutlined';
import SubscriptionsIcon from "@mui/icons-material/SubscriptionsOutlined";

import { DashboardTile, GlobalLoaderContext, TableLoader } from "@components";
import { Data, Sequences, Stats } from "./types";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Dashboard = styled(Box)({
  marginBottom: 32,
});

const CustomTable = styled(Table)({
  minWidth: 650,
});

const Marathon = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);
  const [data, setData] = useState<Data>([]);
  const [sequences, setSequences] = useState<Sequences>([]);
  const [stats, setStats] = useState<Stats>({
    titles_per_day: 0,
    eps_per_day: 0,
    quality_2160: 0,
    quality_1080: 0,
    quality_720: 0,
    quality_480: 0,
    quality_360: 0,
    total_titles: 0,
    total_eps: 0,
    total_size: "",
    total_days: 0,
    start_date: "-",
    end_date: "-",
  });

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/sequences")
      .then(({ data: { data } }) => {
        setSequences(() => data);

        axios
          .get("/entries/by-sequence/1")
          .then(({ data: { data } }) => {
            setData(() => data.data);
            setStats(() => data.stats);
          })
          .catch((err) => console.error(err))
          .finally(() => toggleLoader(false));
      })
      .catch((err) => {
        console.error(err);
        toggleLoader(false);
      });
  }, []);

  const handleClickSequence = (id: number) => {
    toggleLoader(true);

    axios
      .get(`/entries/by-sequence/${id}`)
      .then(({ data: { data } }) => {
        setData(() => data.data);
        setStats(() => data.stats);
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  };

  return (
    <ModuleContainer>
      <Dashboard>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardTile
              icon={<DateRangeIcon fontSize="large" />}
              iconColor="#ff9800"
              heading="Titles per day"
              value={stats.titles_per_day}
              footer={`Episodes per day: ${stats.eps_per_day}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardTile
              icon={<SubscriptionsIcon fontSize="large" />}
              iconColor="#2196f3"
              heading="Total titles"
              value={stats.total_titles}
              footers={[
                `Total titles: ${stats.total_eps}`,
                `Total size: ${stats.total_size}`,
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardTile
              icon={<CalendarMonthIcon fontSize="large" />}
              iconColor="#009688"
              heading="Days"
              value={stats.total_days}
              footers={[
                `Starts at: ${stats.start_date}`,
                `Ends at: ${stats.end_date}`,
              ]}
            />
          </Grid>
        </Grid>
      </Dashboard>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
          <MenuList component={Paper}>
            {sequences.map((item, index) => (
              <MenuItem
                key={`mara-${index}`}
                onClick={() => handleClickSequence(item.id)}
              >
                {item.title}
              </MenuItem>
            ))}
          </MenuList>
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
          <TableContainer component={Paper}>
            <CustomTable>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>E / O / S</TableCell>
                  <TableCell>Filesize</TableCell>
                  <TableCell>Date Finished</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!isLoading ? (
                  data.map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>
                        {item.episodes} / {item.ovas} / {item.specials}
                      </TableCell>
                      <TableCell>{item.filesize}</TableCell>
                      <TableCell>{item.dateFinished}</TableCell>
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

export default Marathon;
