import { MutableRef, useEffect, useState } from "preact/hooks";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Chart, registerables } from "chart.js";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import axios from "axios";
import ChartDataLabels from "chartjs-plugin-datalabels";

import { gasPricesChartInitialData, gasPricesChartOptions } from "../constants";

Chart.register(...registerables, ChartDataLabels);

type Props = {
  toggleGraphRefresh: MutableRef<boolean>;
};

type GraphData = Array<{
  date: string;
  value: number;
}>;

let chartGasPrice: Chart;

const ChartGasPrices = (props: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState<GraphData>([]);

  const fetchData = async () => {
    try {
      const {
        data: { data },
      } = await axios.get("/gas/prices");

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
    if (props.toggleGraphRefresh.current) {
      fetchData();
    }
  }, [props.toggleGraphRefresh.current]);

  useEffect(() => {
    if (document.getElementById("gas-price")) {
      const canvas = document.getElementById("gas-price") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartGasPrice = new Chart(ctx, {
        type: "line",
        plugins: [ChartDataLabels],
        options: gasPricesChartOptions,
        data: gasPricesChartInitialData,
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
