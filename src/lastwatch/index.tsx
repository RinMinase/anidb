import { useContext, useEffect, useLayoutEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import axios from "axios";

import {
  Box,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@mui/material";

import {
  Tv as DailyCountIcon,
  Clock as LastCountIcon,
  Hash as TotalCountIcon,
  Calendar as WeeklyCountIcon,
} from "react-feather";

import {
  DashboardTile,
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  removeBlankAttributes,
  RewatchIndicator,
  Table,
} from "@components";

import { Data, Stats, statsDefaultValues } from "./types";
import { Stack } from "@mui/system";

const LastWatch = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [items, setItems] = useState(20);
  const [data, setData] = useState<Data>([]);
  const [stats, setStats] = useState<Stats>(statsDefaultValues);

  const [isDataLoading, setDataLoading] = useState(false);

  const fetchData = async (count?: number) => {
    try {
      const { data } = await axios.get("/entries/last", {
        params: removeBlankAttributes({ items: count }),
      });

      setData(() => data.data);
      setStats(() => data.stats);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
      setDataLoading(false);
    }
  };

  const handleChangeItems = async (evt: any) => {
    const value: number = evt.target.value;
    setItems(value);
    setDataLoading(true);
    await fetchData(value);
  };

  const Dashboard = () => (
    <Box sx={{ marginBottom: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile
            icon={<TotalCountIcon size={32} />}
            iconColor="#ff9800"
            heading="Watch time last 2 weeks"
            value={`${stats.hoursWatchedLastTwoWeeks} hour${
              stats.hoursWatchedLastTwoWeeks > 1 ? "s" : ""
            }`}
            footer={`Total Episodes: ${stats.totalEps}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile
            icon={<LastCountIcon size={32} />}
            iconColor="#2196f3"
            heading="Time since last entry"
            value={`${stats.daysLastEntry} day${
              stats.daysLastEntry > 1 ? "s" : ""
            }`}
            footer={`Days since oldest entry: ${stats.daysOldestEntry}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile
            icon={<WeeklyCountIcon size={32} />}
            iconColor="#009688"
            heading="Titles per week"
            value={stats.titlesPerWeek}
            footer={`One-Cour (12 Eps) per week: ${stats.coursPerWeek}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile
            icon={<DailyCountIcon size={32} />}
            iconColor="#00bcd4"
            heading="Episodes per day"
            value={stats.epsPerDay}
            footer={`Episodes per week: ${stats.epsPerWeek}`}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const HeaderControls = () => (
    <Stack direction="row" spacing={2}>
      {isDataLoading ? <CircularProgress /> : null}
      <FormControl sx={{ minWidth: 100 }} size="small">
        <InputLabel id="last-watch-items">Items</InputLabel>
        <Select
          id="last-watch-items"
          label="Items"
          value={items}
          onChange={handleChangeItems}
        >
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={30}>30</MenuItem>
          <MenuItem value={50}>50</MenuItem>
          <MenuItem value={100}>100</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );

  useEffect(() => {
    fetchData();
  }, []);

  useLayoutEffect(() => {
    toggleLoader(true);
  }, []);

  if (isLoading) return null;

  return (
    <ModuleContainer
      headerText="Last Watched"
      dashboard={<Dashboard />}
      headerControls={<HeaderControls />}
    >
      <Table.Container component={Paper}>
        <Table.Element sx={{ minWidth: 650 }}>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Title</Table.Cell>
              <Table.Cell sx={{ minWidth: 110 }}>E / O / S</Table.Cell>
              <Table.Cell sx={{ minWidth: 115 }}>Filesize</Table.Cell>
              <Table.Cell sx={{ minWidth: 205 }}>Date Finished</Table.Cell>
              <Table.Cell sx={{ minWidth: 130 }}>Release</Table.Cell>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {data.map((item) => (
              <Table.Row hover key={item.id}>
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
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Element>
      </Table.Container>
    </ModuleContainer>
  );
};

export default LastWatch;
