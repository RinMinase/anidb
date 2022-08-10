import {
  Box,
  Divider,
  Grid,
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

import NumbersIcon from "@mui/icons-material/Numbers";
import MovieIcon from "@mui/icons-material/MovieOutlined";
import ScheduleIcon from "@mui/icons-material/Schedule";
import SubscriptionsIcon from "@mui/icons-material/SubscriptionsOutlined";
import { useContext, useEffect, useState } from "preact/hooks";
import { GlobalLoaderContext, TableLoader } from "@components";
import axios from "axios";
import { Data, Stats } from "./types";

type DashboardIconProps = {
  iconColor?: string;
};

const HomeContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Dashboard = styled(Box)({
  marginBottom: 32,
});

const DashboardItem = styled(Paper)({
  marginTop: 24,
  textAlign: "right",
  position: "relative",
  minHeight: 145,
});

const DashboardContainer = styled(Box)({
  padding: 16,
});

const DashboardIcon = styled(Box)<DashboardIconProps>(({ iconColor }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: iconColor || "#cecece",
  color: "#fff",

  position: "absolute",
  top: -15,
  left: 20,

  width: 56,
  height: 56,
}));

const DashboardFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

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
    <HomeContainer>
      <Dashboard>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardItem>
              <DashboardContainer>
                <DashboardIcon
                  iconColor="#ff9800"
                  children={<NumbersIcon fontSize="large" />}
                />
                <Typography variant="body2">Total Episodes</Typography>
                <Typography variant="h4">{stats.totalEps}</Typography>
              </DashboardContainer>
              <Divider />
              <DashboardFooter>
                <Typography variant="caption">
                  Total Titles: {stats.totalTitles}
                </Typography>
              </DashboardFooter>
            </DashboardItem>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardItem>
              <DashboardContainer>
                <DashboardIcon
                  iconColor="#2196f3"
                  children={<ScheduleIcon fontSize="large" />}
                />
                <Typography variant="body2">Days since last entry</Typography>
                <Typography variant="h4">{stats.daysLastEntry} days</Typography>
              </DashboardContainer>
              <Divider />
              <DashboardFooter>
                <Typography variant="caption">
                  Days since oldest entry: {stats.daysOldestEntry}
                </Typography>
              </DashboardFooter>
            </DashboardItem>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardItem>
              <DashboardContainer>
                <DashboardIcon
                  iconColor="#009688"
                  children={<SubscriptionsIcon fontSize="large" />}
                />
                <Typography variant="body2">Titles per week</Typography>
                <Typography variant="h4">{stats.titlesPerWeek}</Typography>
              </DashboardContainer>
              <Divider />
              <DashboardFooter>
                <Typography variant="caption">
                  One-Cour (12 Eps) per week: {stats.coursPerWeek}
                </Typography>
              </DashboardFooter>
            </DashboardItem>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardItem>
              <DashboardContainer>
                <DashboardIcon
                  iconColor="#00bcd4"
                  children={<MovieIcon fontSize="large" />}
                />
                <Typography variant="body2">Episodes per day</Typography>
                <Typography variant="h4">{stats.epsPerDay}</Typography>
              </DashboardContainer>
              <Divider />
              <DashboardFooter>
                <Typography variant="caption">
                  Episodes per week: {stats.epsPerWeek}
                </Typography>
              </DashboardFooter>
            </DashboardItem>
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
    </HomeContainer>
  );
};

export default LastWatch;
