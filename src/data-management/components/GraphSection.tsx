import { useEffect } from "preact/hooks";
import { Chart, ChartOptions, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { Box, Grid, styled } from "@mui/material";

import { Graph } from "../types";

type Props = {
  graph: Graph;
};

let chartQuality: Chart;
let chartMonth: Chart;
Chart.register(...registerables, ChartDataLabels);

const GraphTopContainer = styled(Box)({
  paddingTop: 24,
});

const PieChartContainer = styled(Box)({
  width: "100%",
  maxWidth: 450,
  textAlign: "center",
});

const LineChartContainer = styled(Box)({
  width: "100%",
  maxWidth: 600,
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
      },
    ],
  };

  const chartMonthOptions: ChartOptions = {
    // aspectRatio: 1.5,
    scales: {
      y: {
        ticks: {
          stepSize: 5,
        }
      }
    },
    plugins: {
      datalabels: {
        formatter: (val) => {
          return val < 0 ? "None" : val < 1 ? "" : val;
        },
        color: "#000",
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
  }, []);

  useEffect(() => {
    let hasAnyValue = false;

    // eslint-disable-next-line
    for (const [key, value] of Object.entries(props.graph.quality)) {
      if (value > 0) hasAnyValue = true;
    }

    if (hasAnyValue) {
      chartQuality.data.datasets[0].data = [
        props.graph.quality.quality_2160 || 0,
        props.graph.quality.quality_1080 || 0,
        props.graph.quality.quality_720 || 0,
        props.graph.quality.quality_480 || 0,
        props.graph.quality.quality_360 || 0,
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

  return (
    <GraphTopContainer>
      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          display="flex"
          justifyContent="center"
        >
          <PieChartContainer>
            <canvas id="quality" />
          </PieChartContainer>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={6}
          display="flex"
          justifyContent="center"
          alignItems="end"
        >
          <LineChartContainer>
            <canvas id="month" />
          </LineChartContainer>
        </Grid>
      </Grid>
    </GraphTopContainer>
  );
};

export default GraphSection;
