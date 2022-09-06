import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { Chart, ChartOptions, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import Swal from "sweetalert2";

import {
  Box,
  Button,
  Grid,
  IconButton,
  ListItemText,
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

import {
  faCalendarDays as DayCountIcon,
  faClapperboard as TotalCountIcon,
  faPenToSquare as EditIcon,
  faTrash as DeleteIcon,
  faTv as TitleCountIcon,
} from "@fortawesome/free-solid-svg-icons";

import {
  DashboardTile,
  GlobalLoaderContext,
  Quality,
  TableLoader,
} from "@components";

import { Data, Sequences, Stats } from "./types";

let chartElement: Chart;
Chart.register(...registerables, ChartDataLabels);

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Dashboard = styled(Box)({
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

const CustomTable = styled(Table)({
  minWidth: 650,
});

const Marathon = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [chartData, setChartData] = useState([-1, -1, -1, -1, -1]);
  const [data, setData] = useState<Data>([]);
  const [sequences, setSequences] = useState<Sequences>([]);
  const [selected, setSelected] = useState(0);
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

  const handleClickSequence = (id: number) => {
    if (id !== selected) {
      toggleLoader(true);

      axios
        .get(`/entries/by-sequence/${id}`)
        .then(({ data: { data } }) => {
          setData(() => data.data);
          setStats(() => data.stats);
          setSelected(id);
          setChartData(() => [
            data.stats.quality_2160,
            data.stats.quality_1080,
            data.stats.quality_720,
            data.stats.quality_480,
            data.stats.quality_360,
          ]);
        })
        .catch((err) => console.error(err))
        .finally(() => toggleLoader(false));
    }
  };

  const handleEditClick = (e: any, id: number) => {
    e.stopPropagation();
    route(`/marathons/edit/${id}`);
  };

  const handleDeleteClick = async (e: any, id: number) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted",
      icon: "error",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      toggleLoader(true);

      await axios.delete(`/sequences/${id}`);
      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      const {
        data: { data },
      } = await axios.get("/sequences");

      setSequences(() => data);

      if (data.length) handleClickSequence(data[0].id);

      toggleLoader(false);
    }
  };

  useEffect(() => {
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

    axios
      .get("/sequences")
      .then(({ data: { data } }) => {
        setSequences(() => data);

        if (data.length) handleClickSequence(data[0].id);
      })
      .catch((err) => {
        console.error(err);
        toggleLoader(false);
      });
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
    <ModuleContainer>
      <Dashboard>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardTile
              icon={<FontAwesomeSvgIcon size="2x" icon={TitleCountIcon} />}
              iconColor="#ff9800"
              heading="Titles per day"
              value={stats.titles_per_day}
              footer={`Episodes per day: ${stats.eps_per_day}`}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DashboardTile
              icon={<FontAwesomeSvgIcon size="2x" icon={TotalCountIcon} />}
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
              icon={<FontAwesomeSvgIcon size="2x" icon={DayCountIcon} />}
              iconColor="#009688"
              heading="Days"
              value={stats.total_days}
              footers={[
                `Starts at: ${stats.start_date}`,
                `Ends at: ${stats.end_date}`,
              ]}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ChartContainer>
              <canvas id="graph" />
            </ChartContainer>
          </Grid>
        </Grid>
      </Dashboard>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
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
                size="small"
                onClick={(e) => handleEditClick(e, item.id)}
              >
                <FontAwesomeSvgIcon icon={EditIcon} />
              </IconButton>
              <IconButton
                size="small"
                onClick={(e) => handleDeleteClick(e, item.id)}
              >
                <FontAwesomeSvgIcon icon={DeleteIcon} />
              </IconButton>
                {}
              </MenuItem>
            ))}
          </CustomMenuList>
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
                      <TableCell>
                        <Quality quality={item.quality} />
                        {item.title}
                      </TableCell>
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
