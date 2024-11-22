import { Layers as ListIcon } from "react-feather";
import { route } from "preact-router";
import { Box, Grid2 as Grid } from "@mui/material";

import { Button, DashboardTile, ModuleContainer } from "@components";
// import { Data, sampleData } from "./types";
// import { useState } from "preact/hooks";

const HeaderControls = () => (
  <>
    <Button
      variant="contained"
      startIcon={<ListIcon size={20} strokeWidth={1.5} />}
      sx={{ minWidth: 120, marginLeft: 2 }}
      onClick={() => route("/pc-setups/list")}
    >
      Manage List
    </Button>
  </>
);

const PcSetup = () => {
  // const [data, setData] = useState<Data>(sampleData);

  const Dashboard = () => (
    <Box sx={{ marginBottom: 4 }}>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile heading="Total Cost" value={`300,000`} mediumText />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile
            heading="Total System Unit Cost"
            value={`100,000`}
            mediumText
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile
            heading="Total Peripheral Cost"
            value={`200,000`}
            mediumText
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <DashboardTile
            heading="Total Cost of Old and New Parts"
            value={`500,000`}
            mediumText
          />
        </Grid>
      </Grid>
    </Box>
  );

  return (
    <ModuleContainer
      headerText="PC Setup"
      headerControls={<HeaderControls />}
      dashboard={<Dashboard />}
    >
      <p>pc contents</p>
    </ModuleContainer>
  );
};

export default PcSetup;
