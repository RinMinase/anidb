import { DashboardTile } from "@components";
import { Grid } from "@mui/material";

import { Stats } from "../types";

type Props = {
  stats: Stats;
};

const StatsSection = (props: Props) => {
  return (
    <>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            heading="Total watch time"
            value={props.stats.watch}
            subHeading={props.stats.watchSubtext}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            heading="Total rewatch time"
            value={props.stats.rewatch}
            subHeading={props.stats.rewatchSubtext}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            heading="Total bucket size"
            value={props.stats.bucketSize}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            heading="Total entry size"
            value={props.stats.entrySize}
          />
        </Grid>
      </Grid>

      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            heading="Total episode count"
            value={props.stats.episodes}
            largeText
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            heading="Total title count"
            value={props.stats.titles}
            largeText
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DashboardTile
            heading="Total season count"
            value={props.stats.seasons}
            largeText
          />
        </Grid>
      </Grid>
    </>
  );
};

export default StatsSection;
