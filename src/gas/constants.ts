import { ChartOptions } from "chart.js";

export const efficiencyChartInitialData = {
  labels: [],
  datasets: [{ data: [] }],
};

export const efficiencyChartOptions: ChartOptions = {
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
      grace: 20,
      beginAtZero: true,
    },
  },
  plugins: {
    datalabels: {
      formatter: (val) => {
        return val < 0 ? "None" : val < 1 ? "" : val;
      },
      color: "#000",
      font: {
        size: 12,
      },
      align: "top",
    },
    legend: { display: false },
    tooltip: { enabled: false },
  },
};

export const gasPricesChartInitialData = {
  labels: [],
  datasets: [{ data: [] }],
};

export const gasPricesChartOptions: ChartOptions = {
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

export const odoChartInitialData = {
  labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
  datasets: [{ data: [] }],
};

export const odoChartOptions: ChartOptions = {
  aspectRatio: 1.5,
  hover: { mode: null as any },
  scales: {
    x: {
      ticks: {
        maxRotation: 0,
        minRotation: 0,
      },
    },
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

export const SliderMarks = [
  { value: 0, label: "0" },
  { value: 1, label: "1" },
  { value: 2, label: "2" },
  { value: 3, label: "3" },
  { value: 4, label: "4" },
  { value: 5, label: "5" },
  { value: 6, label: "6" },
  { value: 6, label: "6" },
  { value: 7, label: "7" },
  { value: 8, label: "8" },
  { value: 9, label: "9" },
];
