export type MaintenanceData = {
  km: {
    [type: string]: "normal" | "nearing" | "limit";
  };
  year: {
    [type: string]: "normal" | "nearing" | "limit";
  };
};

export type StatsData = {
  age: string;
  ageSplitMonths: string;
  ageSplitYear: string;
  averageEfficiency: number;
  kmPerMonth: number;
  lastEfficiency: number;
  mileage: number;
};

export type Data = {
  maintenance: MaintenanceData;
  stats: StatsData;
};

export type Guide = {
  km: Array<{
    type: string;
    typeCamel: string;
    label: string;
    km: number;
  }>;
  year: Array<{
    type: string;
    typeCamel: string;
    label: string;
    year: number;
  }>;
};
