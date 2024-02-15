import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { Chart, ChartOptions, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import {
  Box,
  Grid,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  styled,
} from "@mui/material";

import {
  faCalendarDays as DayCountIcon,
  faClapperboard as TotalCountIcon,
  faPenToSquare as EditIcon,
  faTrash as DeleteIcon,
  faTv as TitleCountIcon,
} from "@fortawesome/free-solid-svg-icons";

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
        .then(({ data }) => {
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

  const DashboardTiles = () => (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <DashboardTile
          icon={<FontAwesomeSvgIcon size="2x" icon={TitleCountIcon} />}
          iconColor="#ff9800"
          heading="Episodes per day"
          value={stats.eps_per_day}
          footer={`Titles per day: ${stats.titles_per_day}`}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DashboardTile
          icon={<FontAwesomeSvgIcon size="2x" icon={TotalCountIcon} />}
          iconColor="#2196f3"
          heading="Total titles"
          value={stats.total_titles}
          footers={[
            `Total episodes: ${stats.total_eps}`,
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
    </>
  );

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
    <ModuleContainer
      headerText="Marathons"
      dashboard={
        <DashboardContainer>
          <Grid container spacing={4}>
            <DashboardTiles />

            <Grid item xs={12} sm={6} md={3}>
              <ChartContainer>
                <canvas id="graph" />
              </ChartContainer>
            </Grid>
          </Grid>
        </DashboardContainer>
      }
    >
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
              </MenuItem>
            ))}
          </CustomMenuList>
        </Grid>
        <Grid item xs={12} sm={7} md={9}>
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
                {!isLoading ? (
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
