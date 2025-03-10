import {
  Grid2 as Grid,
  Paper,
  Skeleton,
  Typography,
  useTheme,
} from "@mui/material";

import { DashboardTile } from "@components";

import CpuImageIcon from "@components/icons/images/cpu.png";
import GpuImageIcon from "@components/icons/images/gpu.png";
import HddImageIcon from "@components/icons/images/hdd.png";
import RamImageIcon from "@components/icons/images/ram.png";

import { PCInfoStats } from "../types";

type Props = {
  isTableLoading: boolean;
  stats?: PCInfoStats;
};

type HighlightsTileProps = {
  imageSrc: string;
  value: string;
  isLoading: boolean;
};

const Highlights = (props: Props) => {
  const theme = useTheme();

  const HighlightsTile = (highlightsTileProps: HighlightsTileProps) => (
    <Grid
      size={{ xs: 12, md: 6 }}
      component={Paper}
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ p: 1 }}
    >
      <img
        src={highlightsTileProps.imageSrc}
        style={{
          width: 48,
          height: 48,
          filter: theme.palette.mode === "dark" ? "invert(1)" : undefined,
        }}
      />
      <Typography
        display="inline-block"
        fontSize={14}
        fontWeight={700}
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
        width="100%"
      >
        {highlightsTileProps.isLoading ? (
          <Skeleton animation="wave" />
        ) : (
          highlightsTileProps.value
        )}
      </Typography>
    </Grid>
  );

  return (
    <Grid container spacing={2} sx={{ mb: 3 }}>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <DashboardTile
          heading="Total Setup Cost"
          value={props.stats?.totalSetupCostFormat || ""}
          isLoading={props.isTableLoading}
          mediumText
          noTopMargin
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 3 }}>
        <DashboardTile
          heading="Total System Cost"
          value={props.stats?.totalSystemCostFormat || ""}
          footerLeft="Peripheral Cost"
          footerRight={props.stats?.totalPeripheralCostFormat || ""}
          isLoading={props.isTableLoading}
          isFooterRightLoading={props.isTableLoading}
          footerFontSize={13}
          mediumText
          noTopMargin
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }} display="flex" alignItems="center">
        <Grid container spacing={{ xs: 2, lg: 1 }} width="100%">
          <HighlightsTile
            imageSrc={CpuImageIcon}
            isLoading={props.isTableLoading}
            value={props.stats?.highlightCpu || ""}
          />
          <HighlightsTile
            imageSrc={GpuImageIcon}
            isLoading={props.isTableLoading}
            value={props.stats?.highlightGpu || ""}
          />
          <HighlightsTile
            imageSrc={RamImageIcon}
            isLoading={props.isTableLoading}
            value={props.stats?.highlightRam || ""}
          />
          <HighlightsTile
            imageSrc={HddImageIcon}
            isLoading={props.isTableLoading}
            value={props.stats?.highlightStorage || ""}
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Highlights;
