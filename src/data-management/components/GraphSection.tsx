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
  chartYearInitialData,
  chartYearOptions,
} from "../constants";

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
