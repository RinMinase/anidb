import { useContext, useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { Chart, ChartOptions, registerables } from "chart.js";
import { toast } from "sonner";
import axios from "axios";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Box,
  Grid,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
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
  Dialog,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
  Quality,
  randomAlphaString,
  RewatchIndicator,
  Table,
} from "@components";

import { Data, Sequences, Stats } from "./types";

let chartElement: Chart;
Chart.register(...registerables, ChartDataLabels);

const Marathon = () => {
  const location = useLocation();

  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [isTableLoading, setTableLoading] = useState(false);
  const [chartData, setChartData] = useState([-1, -1, -1, -1, -1]);
  const [data, setData] = useState<Data>([]);
  const [sequences, setSequences] = useState<Sequences>([]);
  const [selected, setSelected] = useState(0);

  const [selectedDelete, setSelectedDelete] = useState<number>();
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
        id: randomAlphaString(),
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
    location.route(`/marathons/edit/${id}`);
  };

  const handleDeleteClick = (e: any, id: number) => {
    e.stopPropagation();
    setSelectedDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      setDeleteDialogOpen(false);
      setTableLoading(true);

      await axios.delete(`/sequences/${selectedDelete}`);
      toast.success("Success");

      const {
        data: { data },
      } = await axios.get("/sequences");

      setSequences(() => data);

      if (data.length) handleClickSequence(data[0].id);
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
        <Box sx={{ marginBottom: 4 }}>
          <Grid container spacing={4}>
            <DashboardTiles />

            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <Box
                sx={{
                  width: 250,
                  position: "relative",
                  boxSizing: "content-box",
                }}
              >
                <canvas id="graph" />
              </Box>
            </Grid>
          </Grid>
        </Box>
      }
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5, md: 4, lg: 3 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => location.route("/marathons/add")}
          >
            Add
          </Button>
          <MenuList
            component={Paper}
            sx={{ marginTop: 1.5, padding: 0, overflow: "hidden" }}
          >
            {sequences.map((item, index) => (
              <MenuItem
                key={`mara-${index}`}
                selected={selected === item.id}
                onClick={() => handleClickSequence(item.id)}
              >
                <ListItemText
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {item.title}
                </ListItemText>
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
          </MenuList>
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 8, lg: 9 }}>
          <Table.Container component={Paper}>
            <Table.Element sx={{ minWidth: 650 }}>
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
            </Table.Element>
          </Table.Container>
        </Grid>
      </Grid>

      <Dialog
        title="Are you sure?"
        text="This content would be deleted."
        onSubmit={handleDeleteSubmit}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </ModuleContainer>
  );
};

export default Marathon;
