import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";

import {
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import NumbersIcon from "@mui/icons-material/Numbers";
import MovieIcon from "@mui/icons-material/MovieOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SubscriptionsIcon from "@mui/icons-material/SubscriptionsOutlined";

import { DashboardTile, GlobalLoaderContext, TableLoader } from "@components";
import { Data, Stats } from "./types";

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

const LastWatch = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);
  const [data, setData] = useState<Data>([]);
  const [stats, setStats] = useState<Stats>({
    totalEps: 0,
    totalTitles: 0,
    daysLastEntry: 0,
    dateLastEntry: "",
    daysOldestEntry: 0,
    dateOldestEntry: "",
    titlesPerWeek: 0,
    coursPerWeek: 0,
    epsPerWeek: 0,
    epsPerDay: 0,
  });

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/entries/last")
      .then(({ data: { data } }) => {
        setData(() => data.data);
        setStats(() => data.stats);
        toggleLoader(false);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <ModuleContainer>
      <Dashboard>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardTile
              icon={<NumbersIcon fontSize="large" />}
              iconColor="#ff9800"
              heading="Total Episodes"
              value={stats.totalEps}
              footer={`Total Titles: ${stats.totalTitles}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardTile
              icon={<ScheduleIcon fontSize="large" />}
              iconColor="#2196f3"
              heading="Days since last entry"
              value={stats.daysLastEntry}
              footer={`Days since oldest entry: ${stats.daysOldestEntry}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardTile
              icon={<SubscriptionsIcon fontSize="large" />}
              iconColor="#009688"
              heading="Titles per week"
              value={stats.titlesPerWeek}
              footer={`One-Cour (12 Eps) per week: ${stats.coursPerWeek}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardTile
              icon={<MovieIcon fontSize="large" />}
              iconColor="#00bcd4"
              heading="Episodes per day"
              value={stats.epsPerDay}
              footer={`Episodes per week: ${stats.epsPerWeek}`}
            />
          </Grid>
        </Grid>
      </Dashboard>

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
                  <TableCell>{item.title}</TableCell>
                  <TableCell>
                    {item.episodes} / {item.ovas} / {item.specials}
                  </TableCell>
                  <TableCell>{item.filesize}</TableCell>
                  <TableCell>{item.dateFinished}</TableCell>
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

export default LastWatch;
