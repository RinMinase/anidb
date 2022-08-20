import { DashboardTile } from "@components";
import { Grid } from "@mui/material";

import { Data } from "../types";

type Props = {
  data: Data;
};

const DataSection = (props: Props) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12} sm={6} md={3}>
        <DashboardTile
          heading="Total Entries"
          value={props.data.entries}
          largeText
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DashboardTile
          heading="Total Buckets"
          value={props.data.buckets}
          largeText
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <DashboardTile
          heading="Total Partials"
          value={props.data.partials}
          largeText
        />
      </Grid>
    </Grid>
  );
};

export default DataSection;
