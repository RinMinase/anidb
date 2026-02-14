import { Chart, registerables } from "chart.js";
import { MutableRef, useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import ChartDataLabels from "chartjs-plugin-datalabels";
import axios from "axios";

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";

import { getYearsInArray } from "@components/functions";
import { odoChartInitialData, odoChartOptions } from "../constants";

type Props = {
  toggleGraphRefresh: MutableRef<boolean>;
};

Chart.register(...registerables, ChartDataLabels);

const currentYear = new Date().getFullYear();
const finalYear = 2023;
const yearsDropdown = getYearsInArray(currentYear, finalYear, -1);

let chartOdometer: Chart;

const ChartOdometer = (props: Props) => {
  const [year, setYear] = useState(currentYear);
  const [data, setData] = useState<Array<number>>([]);

  const fetchData = async (odoYear?: number) => {
    try {
      const {
        data: { data },
      } = await axios.get("/gas/odo", {
        params: {
          year: odoYear ?? currentYear,
        },
      });

      setData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  useEffect(() => {
    if (data.length && chartOdometer) {
      chartOdometer.data.datasets[0].data = [...data];
      chartOdometer?.update();
    }
  }, [data, chartOdometer]);

  useEffect(() => {
    if (props.toggleGraphRefresh.current) {
      fetchData(year);
    }
  }, [props.toggleGraphRefresh.current]);

  useEffect(() => {
    fetchData(year);
  }, [year]);

  useEffect(() => {
    if (document.getElementById("odometer")) {
      const canvas = document.getElementById("odometer") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartOdometer = new Chart(ctx, {
        type: "bar",
        plugins: [ChartDataLabels],
        options: odoChartOptions,
        data: odoChartInitialData,
      });
    }

    return () => {
      chartOdometer.destroy();
    };
  }, []);

  return (
    <Grid
      size={{ xs: 12 }}
      display="flex"
      alignItems="center"
      flexDirection="column"
      gap={2}
    >
      <Box width="100%" position="relative">
        <Typography
          variant="h6"
          mb={2}
          sx={{ textAlign: { xs: "left", md: "center" } }}
        >
          Odometer per Month
        </Typography>
        <FormControl
          size="small"
          sx={{ position: "absolute", right: 0, top: 0 }}
        >
          <InputLabel>Year</InputLabel>
          <Select
            value={year}
            label="Year"
            onChange={(e: any) => setYear(e.target.value)}
          >
            {yearsDropdown.map((item) => (
              <MenuItem value={item} key={`odo_chart_${item}`}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box width="100%" textAlign="center">
        <canvas id="odometer" />
      </Box>
    </Grid>
  );
};

export default ChartOdometer;
