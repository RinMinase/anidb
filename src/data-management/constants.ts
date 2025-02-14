import { grey, red, orange, indigo, green } from "@mui/material/colors";
import { ChartOptions } from "chart.js";

// Quality
export const chartQualityInitialData = {
  labels: ["LQ", "HQ", "HD", "FHD", "UHD"],
  datasets: [
    {
      // Data value in percentage, used for visualizing small slices
      data: [],
      backgroundColor: ["#777", "#fc6", "#9cf", "#9f9", "#f9c"],
    },
    {
      // Actual data value, but hidden for label reference only
      data: [],
      hidden: true,
    },
  ],
};

export const chartQualityOptions: ChartOptions = {
  aspectRatio: 1.5,
  hover: { mode: null as any },
  plugins: {
    datalabels: {
      formatter: (val, ctx) => {
        const data = ctx.chart.data.datasets[1].data as Array<number>;
        const index = ctx.dataIndex;

        return data[index] < 0 ? "None" : data[index] < 1 ? "" : data[index];
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
    tooltip: { enabled: false },
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
    legend: { display: false },
    tooltip: { enabled: false },
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
      beginAtZero: true,
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

// By Year Per Month
export const chartByYearInitialData = {
  labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  datasets: [
    {
      data: [],
      backgroundColor: ["#777", "#fc6", "#9cf", "#9f9", "#f9c"],
      borderColor: "#81C784",
    },
  ],
};

export const chartByYearOptions: ChartOptions = {
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
      beginAtZero: true,
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
  labels: ["Uncategorized", "Winter", "Spring", "Summer", "Fall"],
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
      formatter: (value, ctx) => {
        const data = ctx.chart.data.datasets[0].data as Array<number>;
        const sum = data.reduce((part, a) => part + a, 0);
        const percentage = ((value / sum) * 100).toFixed(0);

        if (value <= 0) return null;

        return `${value}\n${percentage}%`;
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
    tooltip: { enabled: false },
  },
};

// By Genre
export const chartGenreInitialData = {
  labels: [],
  datasets: [{ data: [] }],
};

export const chartGenreOptions: ChartOptions = {
  aspectRatio: 1.5,
  scales: {
    x: {
      ticks: {
        maxRotation: 60,
        minRotation: 60,
      },
    },
    y: {
      grace: "20%",
      ticks: {
        precision: 0,
      },
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
