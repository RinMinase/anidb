import { useEffect, useState } from "preact/hooks";
import { Chart, registerables } from "chart.js";
import { toast } from "sonner";
import axios from "axios";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Box,
  Grid2 as Grid,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
  styled,
  Typography,
} from "@mui/material";

import { ByYearData, Graph } from "../types";

import {
  chartByYearInitialData,
  chartByYearOptions,
  chartGenreInitialData,
  chartGenreOptions,
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
let chartByYear: Chart;
let chartYears: Chart;
let chartSeasons: Chart;
let chartGenres: Chart;

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
  maxWidth: 500,
  textAlign: "center",
});

const PieChartContainer = styled(Box)({
  width: "100%",
  maxWidth: 450,
  textAlign: "center",
});

const currYear = new Date().getFullYear();

const GraphSection = (props: Props) => {
  const [year, setYear] = useState(currYear);
  const [yearsDropdown, setYearsDropdown] = useState([currYear]);
  const [isYearApiLoading, setYearApiLoading] = useState(false);
  const [byYearData, setByYearData] = useState<ByYearData>([]);

  const fetchByYear = async (newYear?: number) => {
    try {
      setYearApiLoading(true);

      const {
        data: { data },
      } = await axios.get("/management/by-year", {
        params: {
          year: newYear ?? year,
        },
      });

      setByYearData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setYearApiLoading(false);
    }
  };

  const handleChangeYear = async (e: SelectChangeEvent<number>) => {
    const newYear = (e.target as any).value as number;
    setYear(newYear);
    await fetchByYear(newYear);
  };

  useEffect(() => {
    fetchByYear();
  }, []);

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

    if (document.getElementById("byyear")) {
      const canvas = document.getElementById("byyear") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartByYear = new Chart(ctx, {
        type: "line",
        plugins: [ChartDataLabels],
        options: chartByYearOptions,
        data: chartByYearInitialData,
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

    if (document.getElementById("genres")) {
      const canvas = document.getElementById("genres") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartGenres = new Chart(ctx, {
        type: "bar",
        plugins: [ChartDataLabels],
        options: chartGenreOptions,
        data: chartGenreInitialData,
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
      const { quality360, quality480, quality720, quality1080, quality2160 } =
        props.graph.quality;
      const sum =
        (quality360 || 0) +
        (quality480 || 0) +
        (quality720 || 0) +
        (quality1080 || 0) +
        (quality2160 || 0);

      const q360 = quality360 ? Math.max((quality360 / sum) * 100, 1) : 0;
      const q480 = quality480 ? Math.max((quality480 / sum) * 100, 1) : 0;
      const q720 = quality720 ? Math.max((quality720 / sum) * 100, 1) : 0;
      const q1080 = quality1080 ? Math.max((quality1080 / sum) * 100, 1) : 0;
      const q2160 = quality2160 ? Math.max((quality2160 / sum) * 100, 1) : 0;

      chartQuality.data.datasets[0].data = [q360, q480, q720, q1080, q2160];
      chartQuality.data.datasets[1].data = [
        quality360 || 0,
        quality480 || 0,
        quality720 || 0,
        quality1080 || 0,
        quality2160 || 0,
      ];
    } else {
      chartQuality.data.datasets[0].data = [-1, -1, -1, -1, -1];
      chartQuality.data.datasets[1].data = [-1, -1, -1, -1, -1];
    }

    chartQuality.update();
  }, [props.graph.quality]);

  useEffect(() => {
    if (props.graph.ratings.length) {
      chartRatings.data.datasets[0].data = [...props.graph.ratings];
      chartRatings.update();
    }
  }, [props.graph.ratings]);

  useEffect(() => {
    if (props.graph.months) {
      chartMonths.data.datasets[0].data = Object.values(props.graph.months);
      chartMonths.update();
    }
  }, [props.graph.months]);

  useEffect(() => {
    if (props.graph.years.length) {
      // Data Reset
      chartYears.data.labels = [];
      chartYears.data.datasets[0].data = [];
      const years: number[] = [];

      props.graph.years.forEach((item) => {
        chartYears.data.labels?.push(item.year);
        chartYears.data.datasets[0].data.push(item.value);
        years.push(parseInt(item.year));
      });

      years.reverse();
      setYearsDropdown([currYear, ...years]);
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

  useEffect(() => {
    if (props.graph.genres.values.length && props.graph.genres.list) {
      const { list, values } = props.graph.genres;
      chartGenres.data.labels = [...list];

      values.forEach((item) => {
        const index = list.findIndex((i) => item.genre === i);
        chartGenres.data.datasets[0].data[index] = item.value;
      });

      chartGenres.update();
    }
  }, [props.graph.genres.values]);

  useEffect(() => {
    if (byYearData.length) {
      chartByYear.data.datasets[0].data = [...byYearData];
      chartByYear.update();
    }
  }, [byYearData]);

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
            Titles Watched and Rewatched per Month of All Time
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
          gap={1}
        >
          <Typography
            variant="h6"
            textAlign="center"
            flexDirection="row"
            alignItems="center"
          >
            <span>Titles Watched and Rewatched of Year :&nbsp;</span>
            <Select
              size="small"
              value={year}
              onChange={handleChangeYear}
              sx={{ float: "right" }}
            >
              {yearsDropdown.map((item) => (
                <MenuItem key={`year-dropdown-${item}`} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </Typography>

          <Box sx={{ width: "60%", height: "4px" }}>
            {isYearApiLoading ? <LinearProgress /> : null}
          </Box>

          <LineChartContainer>
            <canvas id="byyear" />
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
            Titles Watched and Rewatched per Year
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

        <Grid
          size={{ xs: 12, sm: 12, md: 6 }}
          display="flex"
          alignItems="center"
          flexDirection="column"
          justifyContent="center"
          gap={2}
        >
          <Typography variant="h6" textAlign="center">
            Titles Watched and Rewatched per Genre
          </Typography>
          <BarChartContainer>
            <canvas id="genres" />
          </BarChartContainer>
        </Grid>
      </Grid>
    </GraphTopContainer>
  );
};

export default GraphSection;
