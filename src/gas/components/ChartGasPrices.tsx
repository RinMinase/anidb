import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import axios from "axios";
import { Chart, ChartOptions, registerables } from "chart.js";
import { format, parseISO } from "date-fns";
import { useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables, ChartDataLabels);

export const chartEfficiencyInitialData = {
  labels: [],
  datasets: [{ data: [] }],
};

const chartEfficiencyOptions: ChartOptions = {
  layout: {
    padding: {
      top: 20,
    },
  },
  scales: {
    y: {
      ticks: {
        stepSize: 5,
        padding: 10,
      },
      grace: 5,
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
    legend: { display: false },
    tooltip: { enabled: false },
  },
};

type GraphData = Array<{
  date: string;
  value: number;
}>;

let chartGasPrice: Chart;

const ChartGasPrices = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState<GraphData>([]);

  const fetchData = async () => {
    try {
      const {
        data: { data },
      } = await axios.get("/fourleaf/gas/prices");

      let formatted = Object.entries(data).map(([date, value]) => ({
        date: format(parseISO(date), "MMM d"),
        value: +(value as number).toFixed(2),
      }));

      if (isMobile) {
        formatted = formatted.slice(-7);
      }

      setData(formatted);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  useEffect(() => {
    if (data.length && chartGasPrice) {
      chartGasPrice.data.datasets[0].data = [...data.map(({ value }) => value)];
      chartGasPrice.data.labels = [...data.map(({ date }) => date)];
      chartGasPrice?.update();
    }
  }, [data, chartGasPrice]);

  useEffect(() => {
    if (document.getElementById("gas-price")) {
      const canvas = document.getElementById("gas-price") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartGasPrice = new Chart(ctx, {
        type: "line",
        plugins: [ChartDataLabels],
        options: chartEfficiencyOptions,
        data: chartEfficiencyInitialData,
      });
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid
      size={{ xs: 12 }}
      display="flex"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      <Typography variant="h6" textAlign="center">
        Gas price over time
      </Typography>
      <Box width="100%" position="relative">
        <canvas id="gas-price" />
      </Box>
    </Grid>
  );
};

export default ChartGasPrices;
