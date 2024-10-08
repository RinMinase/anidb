import { useContext, useEffect, useLayoutEffect, useState } from "preact/hooks";
import axios from "axios";
import { toast } from "sonner";
import { Box, Grid2 as Grid, Paper, styled } from "@mui/material";

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
  RewatchIndicator,
  Table,
} from "@components";

import { Data, Stats } from "./types";

const DashboardContainer = styled(Box)({
  marginBottom: 32,
});

const CustomTable = styled(Table.Element)({
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

  const fetchData = async () => {
    try {
      const { data } = await axios.get("/entries/last");

      setData(() => data.data);
      setStats(() => data.stats);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const Dashboard = () => (
    <DashboardContainer>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile
            icon={<TotalCountIcon size={32} />}
            iconColor="#ff9800"
            heading="Total Episodes"
            value={stats.totalEps}
            footer={`Total Titles: ${stats.totalTitles}`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile
            icon={<LastCountIcon size={32} />}
            iconColor="#2196f3"
            heading="Days since last entry"
            value={stats.daysLastEntry}
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
    </DashboardContainer>
  );

  useEffect(() => {
    fetchData();
  }, []);

  useLayoutEffect(() => {
    toggleLoader(true);
  }, []);

  if (isLoading) return null;

  return (
    <ModuleContainer headerText="Last Watched" dashboard={<Dashboard />}>
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
                  <RewatchIndicator show={item.rewatched} />
                </Table.Cell>
                <Table.Cell>{item.release}</Table.Cell>
                <Table.Cell>{item.encoder}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </CustomTable>
      </Table.Container>
    </ModuleContainer>
  );
};

export default LastWatch;
