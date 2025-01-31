import { useEffect } from "preact/hooks";
import { Chart, registerables } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Box, Grid2 as Grid, styled, Typography } from "@mui/material";

import { Graph } from "../types";

import {
  chartMonthInitialData,
  chartMonthOptions,
  chartQualityInitialData,
  chartQualityOptions,
  chartRatingsInitialData,
  chartRatingsOptions,
  chartSeasonsInitialData,
  chartSeasonsOptions,
  chartYearInitialData,
  chartYearOptions,
} from "../constants";

type Props = {
  graph: Graph;
};

let chartQuality: Chart;
let chartRatings: Chart;
let chartMonths: Chart;
let chartYears: Chart;
let chartSeasons: Chart;

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

      chartMonths = new Chart(ctx, {
        type: "line",
        plugins: [ChartDataLabels],
        options: chartMonthOptions,
        data: chartMonthInitialData,
      });
    }

    if (document.getElementById("years")) {
      const canvas = document.getElementById("years") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartYears = new Chart(ctx, {
        type: "bar",
        plugins: [ChartDataLabels],
        options: chartYearOptions,
        data: chartYearInitialData,
      });
    }

    if (document.getElementById("seasons")) {
      const canvas = document.getElementById("seasons") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartSeasons = new Chart(ctx, {
        type: "pie",
        plugins: [ChartDataLabels],
        options: chartSeasonsOptions,
        data: chartSeasonsInitialData,
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
      chartMonths.data.datasets[0].data.push(value);
    }

    chartMonths.update();
  }, [props.graph.months]);

  useEffect(() => {
    if (props.graph.ratings.length) {
      chartRatings.data.datasets[0].data = [...props.graph.ratings];
      chartRatings.update();
    }
  }, [props.graph.ratings]);

  useEffect(() => {
    if (props.graph.years.length) {
      props.graph.years.forEach((item) => {
        chartYears.data.labels?.push(item.year);
        chartYears.data.datasets[0].data.push(item.value);
      });

      chartYears.update();
    }
  }, [props.graph.years]);

  useEffect(() => {
    if (props.graph.seasons.length) {
      props.graph.seasons.forEach((item) => {
        if (item.season === "None") {
          chartSeasons.data.datasets[0].data[0] = item.value;
        } else if (item.season === "Winter") {
          chartSeasons.data.datasets[0].data[1] = item.value;
        } else if (item.season === "Spring") {
          chartSeasons.data.datasets[0].data[2] = item.value;
        } else if (item.season === "Summer") {
          chartSeasons.data.datasets[0].data[3] = item.value;
        } else if (item.season === "Fall") {
          chartSeasons.data.datasets[0].data[4] = item.value;
        }
      });

      chartSeasons.update();
    }
  }, [props.graph.seasons]);

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
            <canvas id="years" />
          </BarChartContainer>
        </Grid>
        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          display="flex"
          alignItems="center"
          flexDirection="column"
          gap={2}
        >
          <Typography variant="h6" textAlign="center">
            Titles per Season
          </Typography>
          <PieChartContainer>
            <canvas id="seasons" />
          </PieChartContainer>
        </Grid>
      </Grid>
    </GraphTopContainer>
  );
};

export default GraphSection;
