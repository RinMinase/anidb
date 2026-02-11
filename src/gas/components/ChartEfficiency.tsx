import { Chart, registerables } from "chart.js";
import { MutableRef, useEffect, useState } from "preact/hooks";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import axios from "axios";
import ChartDataLabels from "chartjs-plugin-datalabels";

import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  efficiencyChartInitialData,
  efficiencyChartOptions,
} from "../constants";

Chart.register(...registerables, ChartDataLabels);

type Props = {
  toggleGraphRefresh: MutableRef<boolean>;
};

type TypeDropdown = typeof typeDropdown;
type TypeDropdownValue = TypeDropdown[number]["value"];
const typeDropdown = [
  { label: "Last 20", value: "last20data" },
  { label: "Last 12 Months", value: "last12mos" },
] as const;

type GraphData = Array<{
  date: string;
  value: number;
}>;

type GraphMonthlyData = Array<{
  month: string;
  value: number;
}>;

let chartEfficiency: Chart;

const ChartEfficiency = (props: Props) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [type, setType] = useState<TypeDropdownValue>("last20data");
  const [data, setData] = useState<GraphData>([]);
  const [dataMonthly, setDataMonthly] = useState<GraphMonthlyData>([]);

  const fetchData = async (effType: TypeDropdownValue = "last20data") => {
    try {
      const {
        data: { data },
      } = await axios.get("/fourleaf/gas/efficiency", {
        params: {
          type: effType,
        },
      });

      if (effType === "last20data") {
        setDataMonthly([]);

        let formatted = Object.entries(data).map(([date, value]) => ({
          date: format(parseISO(date), "MMM d"),
          value: +(value as number).toFixed(2),
        }));

        if (isMobile) {
          formatted = formatted.slice(-7);
        }

        setData(formatted);
      } else {
        setData([]);

        let formatted = Object.entries(data).map(([month, value]) => ({
          month: isMobile
            ? month[0].toUpperCase()
            : `${month[0].toUpperCase()}${month.slice(1)}`,
          value: value as number,
        }));

        setDataMonthly(formatted);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  useEffect(() => {
    if (data.length) {
      chartEfficiency.data.datasets[0].data = [
        ...data.map(({ value }) => value),
      ];
      chartEfficiency.data.labels = [...data.map(({ date }) => date)];
      chartEfficiency?.update();
    }

    if (dataMonthly.length) {
      chartEfficiency.data.datasets[0].data = [
        ...dataMonthly.map(({ value }) => value),
      ];
      chartEfficiency.data.labels = [...dataMonthly.map(({ month }) => month)];
      chartEfficiency?.update();
    }
  }, [data, dataMonthly, chartEfficiency]);

  useEffect(() => {
    if (props.toggleGraphRefresh.current) {
      fetchData(type);
    }
  }, [props.toggleGraphRefresh.current]);

  useEffect(() => {
    fetchData(type);
  }, [type]);

  useEffect(() => {
    if (document.getElementById("efficiency")) {
      const canvas = document.getElementById("efficiency") as HTMLCanvasElement;
      const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

      chartEfficiency = new Chart(ctx, {
        type: "line",
        plugins: [ChartDataLabels],
        options: efficiencyChartOptions,
        data: efficiencyChartInitialData,
      });
    }

    return () => {
      chartEfficiency.destroy();
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
        <Typography variant="h6" textAlign="center">
          Efficiency over fuel refills
        </Typography>
        <FormControl
          size="small"
          fullWidth={isTablet}
          sx={{
            width: { md: "160px" },
            position: { xs: "relative", md: "absolute" },
            right: 0,
            top: 0,
          }}
        >
          <InputLabel>Type</InputLabel>
          <Select
            value={type}
            label="Type"
            onChange={(e: any) => setType(e.target.value)}
          >
            {typeDropdown.map((item) => (
              <MenuItem value={item.value} key={`eff_chart_${item.value}`}>
                {item.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box width="100%" position="relative">
        <canvas id="efficiency" />
      </Box>
    </Grid>
  );
};

export default ChartEfficiency;
