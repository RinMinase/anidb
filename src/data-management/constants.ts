import { grey, red, orange, indigo, green } from "@mui/material/colors";
import { ChartOptions } from "chart.js";

// Quality
export const chartQualityInitialData = {
  labels: ["LQ", "HQ", "HD", "FHD", "UHD"],
  datasets: [
    {
      data: [],
      backgroundColor: ["#777", "#fc6", "#9cf", "#9f9", "#f9c"],
    },
  ],
};

export const chartQualityOptions: ChartOptions = {
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

// Ratings
export const chartRatingsInitialData = {
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

export const chartRatingsOptions: ChartOptions = {
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

// By Month
export const chartMonthInitialData = {
  labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  datasets: [
    {
      data: [],
      backgroundColor: ["#777", "#fc6", "#9cf", "#9f9", "#f9c"],
      borderColor: "#81C784",
    },
  ],
};

export const chartMonthOptions: ChartOptions = {
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

// By Year
export const chartYearInitialData = {
  labels: [],
  datasets: [{ data: [] }],
};

export const chartYearOptions: ChartOptions = {
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

// Seasons
export const chartSeasonsInitialData = {
  labels: ["Unclassified", "Winter", "Spring", "Summer", "Fall"],
  datasets: [
    {
      data: [0, 0, 0, 0, 0],
      backgroundColor: ["#E0E0E0", "#B3E5FC", "#4CAF50", "#FFEE58", "#FF7043"],
    },
  ],
};

export const chartSeasonsOptions: ChartOptions = {
  aspectRatio: 1.5,
  hover: { mode: null as any },
  plugins: {
    datalabels: {
      formatter: (val, ctx) => {
        const data = ctx.chart.data.datasets[0].data as Array<number>;
        const sum = data.reduce((part, a) => part + a, 0);

        const percentage = ((val / sum) * 100).toFixed(0);
        const actualValue = val < 0 ? "None" : val < 1 ? "" : val;

        return `${actualValue}\n${percentage}%`;
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
