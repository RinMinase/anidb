import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { Chart, ChartOptions, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { v4 as uuid } from "uuid";
import { toast } from "sonner";

import {
  Box,
  Grid2 as Grid,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  styled,
} from "@mui/material";

import {
  Calendar as DayCountIcon,
  Trash as DeleteIcon,
  Edit as EditIcon,
  Tv as TitleCountIcon,
  Database as TotalCountIcon,
} from "react-feather";

import {
  Button,
  DashboardTile,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
  Quality,
  RewatchIndicator,
  Swal,
  Table,
} from "@components";

import { Data, Sequences, Stats } from "./types";

let chartElement: Chart;
Chart.register(...registerables, ChartDataLabels);

const DashboardContainer = styled(Box)({
  marginBottom: 32,
});

const ChartContainer = styled(Box)({
  width: 250,
  position: "relative",
  boxSizing: "content-box",
});

const CustomMenuList = styled(MenuList)<{ component: any }>({
  marginTop: 12,
  padding: 0,
  overflow: "hidden",
});

const CustomTable = styled(Table.Element)({
  minWidth: 650,
});

const Marathon = () => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [isTableLoading, setTableLoading] = useState(false);
  const [chartData, setChartData] = useState([-1, -1, -1, -1, -1]);
  const [data, setData] = useState<Data>([]);
  const [sequences, setSequences] = useState<Sequences>([]);
  const [selected, setSelected] = useState(0);
  const [stats, setStats] = useState<Stats>({
    titlesPerDay: 0,
    epsPerDay: 0,
    quality2160: 0,
    quality1080: 0,
    quality720: 0,
    quality480: 0,
    quality360: 0,
    totalTitles: 0,
    totalEps: 0,
    totalSize: "",
    totalDays: 0,
    startDate: "-",
    endDate: "-",
  });

  const chartInitialData = {
    labels: ["LQ", "HQ", "HD", "FHD", "UHD"],
    datasets: [
      {
        data: [],
        backgroundColor: ["#777", "#fc6", "#9cf", "#9f9", "#f9c"],
      },
    ],
  };

  const chartOptions: ChartOptions = {
    aspectRatio: 1.25,
    plugins: {
      datalabels: {
        formatter: (val) => {
          return val < 0 ? "None" : val < 1 ? "" : val;
        },
        color: "#000",
      },
      legend: {
        position: "left",
        reverse: true,
        labels: {
          boxWidth: 12,
          padding: 16,
        },
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const processDuplicateIds = (data: Data) => {
    const existingIds: Array<string> = [];

    return data.map((item) => {
      if (!existingIds.includes(item.id)) {
        existingIds.push(item.id);

        return item;
      }

      return {
        ...item,
        id: uuid(),
      };
    });
  };

  const fetchData = async () => {
    try {
      if (document.getElementById("graph")) {
        const canvas = document.getElementById("graph") as HTMLCanvasElement;
        const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

        chartElement = new Chart(ctx, {
          type: "pie",
          plugins: [ChartDataLabels],
          options: chartOptions,
          data: chartInitialData,
        });
      }

      toggleLoader(true);

      const {
        data: { data },
      } = await axios.get("/sequences");

      setSequences(() => data);
      toggleLoader(false);

      if (data.length) {
        handleClickSequence(data[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleClickSequence = async (id: number) => {
    try {
      if (id !== selected) {
        setTableLoading(true);

        const { data } = await axios.get(`/entries/by-sequence/${id}`);

        setData(() => processDuplicateIds(data.data));
        setStats(() => data.stats);
        setSelected(id);
        setChartData(() => [
          data.stats.quality360,
          data.stats.quality480,
          data.stats.quality720,
          data.stats.quality1080,
          data.stats.quality2160,
        ]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const handleEditClick = (e: any, id: number) => {
    e.stopPropagation();
    route(`/marathons/edit/${id}`);
  };

  const handleDeleteClick = async (e: any, id: number) => {
    e.stopPropagation();

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This item will be deleted",
        icon: "error",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        setTableLoading(true);

        await axios.delete(`/sequences/${id}`);
        toast.success("Success");

        const {
          data: { data },
        } = await axios.get("/sequences");

        setSequences(() => data);

        if (data.length) handleClickSequence(data[0].id);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const DashboardTiles = () => (
    <>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardTile
          icon={<TitleCountIcon size={32} />}
          iconColor="#ff9800"
          heading="Episodes per day"
          value={stats.epsPerDay}
          footer={`Titles per day: ${stats.titlesPerDay}`}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardTile
          icon={<TotalCountIcon size={32} />}
          iconColor="#2196f3"
          heading="Total titles"
          value={stats.totalTitles}
          footers={[
            `Total episodes: ${stats.totalEps}`,
            `Total size: ${stats.totalSize}`,
          ]}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <DashboardTile
          icon={<DayCountIcon size={32} />}
          iconColor="#009688"
          heading="Days"
          value={stats.totalDays}
          footers={[
            `Starts at: ${stats.startDate}`,
            `Ends at: ${stats.endDate}`,
          ]}
        />
      </Grid>
    </>
  );

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (chartData.length) {
      let hasAnyValue = false;

      chartData.forEach((item) => {
        if (item > 0) hasAnyValue = true;
      });

      if (hasAnyValue) {
        chartElement.data.datasets[0].data = chartData;
      } else {
        chartElement.data.datasets[0].data = [-1, -1, -1, -1, -1];
      }

      chartElement.update();
    }
  }, [chartData]);

  return (
    <ModuleContainer
      headerText="Marathons"
      dashboard={
        <DashboardContainer>
          <Grid container spacing={4}>
            <DashboardTiles />

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <ChartContainer>
                <canvas id="graph" />
              </ChartContainer>
            </Grid>
          </Grid>
        </DashboardContainer>
      }
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => route("/marathons/add")}
          >
            Add
          </Button>
          <CustomMenuList component={Paper}>
            {sequences.map((item, index) => (
              <MenuItem
                key={`mara-${index}`}
                selected={selected === item.id}
                onClick={() => handleClickSequence(item.id)}
              >
                <ListItemText>{item.title}</ListItemText>
                <IconButton
                  sx={{ marginRight: 1 }}
                  size="small"
                  onClick={(e) => handleEditClick(e, item.id)}
                  children={<EditIcon size={20} />}
                />
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteClick(e, item.id)}
                  children={<DeleteIcon size={20} />}
                />
              </MenuItem>
            ))}
          </CustomMenuList>
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
          <Table.Container component={Paper}>
            <CustomTable>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>Title</Table.Cell>
                  <Table.Cell sx={{ minWidth: 110 }}>E / O / S</Table.Cell>
                  <Table.Cell sx={{ minWidth: 115 }}>Filesize</Table.Cell>
                  <Table.Cell sx={{ minWidth: 190 }}>Date Finished</Table.Cell>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {!isTableLoading ? (
                  data.map((item) => (
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
                    </Table.Row>
                  ))
                ) : (
                  <Table.Loader />
                )}
              </Table.Body>
            </CustomTable>
          </Table.Container>
        </Grid>
      </Grid>
    </ModuleContainer>
  );
};

export default Marathon;
