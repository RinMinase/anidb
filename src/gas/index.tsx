import { useLocation } from "preact-iso";
import { useContext, useEffect, useRef, useState } from "preact/hooks";
import { toast } from "sonner";
import axios from "axios";

import { Box, Grid } from "@mui/material";

import {
  Button,
  DashboardTile,
  GlobalLoaderContext,
  ModuleContainer,
} from "@components";

import { MaintenanceData, StatsData } from "./types";
import MaintenanceGuide from "./components/MaintenanceGuide";
import ChartOdometer from "./components/ChartOdometer";
import ChartEfficiency from "./components/ChartEfficiency";
import ChartGasPrices from "./components/ChartGasPrices";
import AddFuelDialog from "./components/AddFuelDialog";

const Gas = () => {
  const location = useLocation();

  const { toggleLoader } = useContext(GlobalLoaderContext);

  const toggleGraphRefresh = useRef(false);

  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const [statsData, setStatsData] = useState<StatsData>();
  const [maintenanceData, setMaintenanceData] = useState<MaintenanceData>({
    km: {},
    year: {},
  });

  const fetchData = async () => {
    try {
      toggleLoader(true);

      const {
        data: { data },
      } = await axios.get("/gas");

      setMaintenanceData(data.maintenance);
      setStatsData(data.stats);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="Gas Management">
      <Grid container spacing={2}>
        <Grid container size={{ xs: 12, md: 3 }}>
          <Box>
            <Grid container spacing={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => {
                  toggleGraphRefresh.current = false;
                  setAddDialogOpen(true);
                }}
              >
                Add Fuel Data
              </Button>
              <Button
                fullWidth
                variant="contained"
                color="secondary"
                onClick={() => location.route("/gas/view")}
              >
                View All Data
              </Button>

              <MaintenanceGuide maintenanceData={maintenanceData} />
            </Grid>
          </Box>
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          <Grid container spacing={4}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DashboardTile
                noTopMargin
                heading="Average efficiency"
                value={statsData?.averageEfficiency}
                subHeading="KM / Liter"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DashboardTile
                noTopMargin
                heading="Last Efficiency"
                value={statsData?.lastEfficiency}
                subHeading="KM / Liter"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DashboardTile
                noTopMargin
                heading="Mileage"
                value={`${statsData?.mileage} KM`}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <DashboardTile
                noTopMargin
                heading="Avg. KM / Month"
                value={statsData?.kmPerMonth}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <DashboardTile
                smallText
                noTopMargin
                heading="Age"
                value={
                  <span>
                    {statsData?.ageSplitYear}
                    <br />
                    {statsData?.ageSplitMonths}
                  </span>
                }
              />
            </Grid>
          </Grid>

          <Grid container spacing={4} mt={6}>
            <ChartEfficiency toggleGraphRefresh={toggleGraphRefresh} />
            <ChartOdometer toggleGraphRefresh={toggleGraphRefresh} />
            <ChartGasPrices toggleGraphRefresh={toggleGraphRefresh} />
          </Grid>
        </Grid>
      </Grid>

      <AddFuelDialog
        open={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        refreshData={() => {
          fetchData();
          toggleGraphRefresh.current = true;
        }}
      />
    </ModuleContainer>
  );
};

export default Gas;
