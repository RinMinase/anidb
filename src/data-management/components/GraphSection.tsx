import { useEffect } from "preact/hooks";
import { Chart, ChartOptions, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box, Grid2 as Grid, styled, Typography } from "@mui/material";
import { grey, red, orange, indigo, green } from "@mui/material/colors";

import { Graph } from "../types";

type Props = {
  graph: Graph;
};

let chartQuality: Chart;
let chartRatings: Chart;
let chartMonth: Chart;
let chartYear: Chart;

Chart.register(...registerables, ChartDataLabels);

const GraphTopContainer = styled(Box)({
  paddingTop: 24,
});

const BarChartContainer = styled(Box)({
  width: "100%",
  maxWidth: 450,
  textAlign: "center",
});

const LineChartContainer = styled(Box)({
  width: "100%",
  maxWidth: 600,
  textAlign: "center",
});

const PieChartContainer = styled(Box)({
  width: "100%",
  maxWidth: 450,
  textAlign: "center",
});

const GraphSection = (props: Props) => {
  const chartQualityInitialData = {
    labels: ["LQ", "HQ", "HD", "FHD", "UHD"],
    datasets: [
      {
        data: [],
        backgroundColor: ["#777", "#fc6", "#9cf", "#9f9", "#f9c"],
      },
    ],
  };

  const chartQualityOptions: ChartOptions = {
    aspectRatio: 1.5,
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

  const chartMonthInitialData = {
    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    datasets: [
      {
        data: [],
        backgroundColor: ["#777", "#fc6", "#9cf", "#9f9", "#f9c"],
        borderColor: "#81C784",
      },
    ],
  };

  const chartMonthOptions: ChartOptions = {
    // aspectRatio: 1.5,
    layout: {
      padding: {
        top: 20,
      },
    },
    scales: {
      y: {
        ticks: {
          stepSize: 5,
        },
        grace: 20,
      },
    },
    plugins: {
      datalabels: {
        formatter: (val) => {
          return val < 0 ? "None" : val < 1 ? "" : val;
        },
        color: "#2196F3",
        font: {
          weight: "bold",
          size: 12,
        },
        align: "top",
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const chartRatingsInitialData = {
    labels: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
    datasets: [
      {
        data: [],
        // [gray500, ]
        backgroundColor: [
          grey[500],
          red[800],
          red[500],
          red[300],
          orange[800],
          orange[500],
          orange[300],
          indigo[400],
          indigo[800],
          green[500],
          green[800],
        ],
      },
    ],
  };

  const chartRatingsOptions: ChartOptions = {
    aspectRatio: 1.5,
    hover: { mode: null as any },
    scales: {
      y: {
        grace: "20%",
      },
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        clamp: true,
        color: "#2196F3",
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  const chartYearInitialData = {
    labels: [],
    datasets: [{ data: [] }],
  };

  const chartYearOptions: ChartOptions = {
    aspectRatio: 1.5,
    scales: {
      y: {
        grace: "20%",
      },
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "top",
        clamp: true,
        color: "#2196F3",
      },
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  useEffect(() => {
    if (document.getElementById("quality")) {
      const canvas = document.getElementById("quality") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartQuality = new Chart(ctx, {
        type: "pie",
        plugins: [ChartDataLabels],
        options: chartQualityOptions,
        data: chartQualityInitialData,
      });
    }

    if (document.getElementById("ratings")) {
      const canvas = document.getElementById("ratings") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartRatings = new Chart(ctx, {
        type: "bar",
        plugins: [ChartDataLabels],
        options: chartRatingsOptions,
        data: chartRatingsInitialData,
      });
    }

    if (document.getElementById("month")) {
      const canvas = document.getElementById("month") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartMonth = new Chart(ctx, {
        type: "line",
        plugins: [ChartDataLabels],
        options: chartMonthOptions,
        data: chartMonthInitialData,
      });
    }

    if (document.getElementById("year")) {
      const canvas = document.getElementById("year") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartYear = new Chart(ctx, {
        type: "bar",
        plugins: [ChartDataLabels],
        options: chartYearOptions,
        data: chartYearInitialData,
      });
    }
  }, []);

  useEffect(() => {
    let hasAnyValue = false;

    // eslint-disable-next-line
    for (const [key, value] of Object.entries(props.graph.quality)) {
      if (value > 0) hasAnyValue = true;
    }

    if (hasAnyValue) {
      chartQuality.data.datasets[0].data = [
        props.graph.quality.quality360 || 0,
        props.graph.quality.quality480 || 0,
        props.graph.quality.quality720 || 0,
        props.graph.quality.quality1080 || 0,
        props.graph.quality.quality2160 || 0,
      ];
    } else {
      chartQuality.data.datasets[0].data = [-1, -1, -1, -1, -1];
    }

    chartQuality.update();
  }, [props.graph.quality]);

  useEffect(() => {
    // eslint-disable-next-line
    for (const [key, value] of Object.entries(props.graph.months)) {
      chartMonth.data.datasets[0].data.push(value);
    }

    chartMonth.update();
  }, [props.graph.months]);

  useEffect(() => {
    if (props.graph.ratings.length) {
      chartRatings.data.datasets[0].data = [...props.graph.ratings];
      chartRatings.update();
    }
  }, [props.graph.ratings]);

  useEffect(() => {
    if (props.graph.year.length) {
      props.graph.year.forEach((item) => {
        chartYear.data.labels?.push(item.year);
        chartYear.data.datasets[0].data.push(item.value);
      });

      chartYear.update();
    }
  }, [props.graph.year]);

  return (
    <GraphTopContainer>
      <Grid container spacing={2}>
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          display="flex"
          alignItems="center"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h6" textAlign="center">
            Titles per Quality
          </Typography>
          <PieChartContainer>
            <canvas id="quality" />
          </PieChartContainer>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          display="flex"
          alignItems="center"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h6" textAlign="center">
            Titles per Rating
          </Typography>
          <BarChartContainer>
            <canvas id="ratings" />
          </BarChartContainer>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          gap={2}
        >
          <Typography variant="h6" textAlign="center">
            Titles Watched per Month
          </Typography>
          <LineChartContainer>
            <canvas id="month" />
          </LineChartContainer>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          gap={2}
        >
          <Typography variant="h6" textAlign="center">
            Titles Watched per Year
          </Typography>
          <BarChartContainer>
            <canvas id="year" />
          </BarChartContainer>
        </Grid>
      </Grid>
    </GraphTopContainer>
  );
};

export default GraphSection;
