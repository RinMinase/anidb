import { useContext, useEffect, useLayoutEffect, useState } from "preact/hooks";
import axios from "axios";
import { toast } from "sonner";

import { Box, styled, Typography } from "@mui/material";

import { GlobalLoaderContext, ModuleContainer } from "@components";

import DataSection from "./components/DataSection";
import GraphSection from "./components/GraphSection";
import ManagementSection from "./components/ManagementSection";
import StatsSection from "./components/StatsSection";
import { Data, Graph, Stats } from "./types";

const Label = styled(Typography)({
  paddingTop: 24,
});

const DataManagement = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>({});
  const [stats, setStats] = useState<Stats>({});
  const [graph, setGraph] = useState<Graph>({
    quality: {},
    months: {},
    seasons: [],
    years: [],
    ratings: [],
    genres: {
      list: [],
      values: [],
    },
  });

  const reloadPageData = async () => {
    try {
      toggleLoader(true);

      const {
        data: { data },
      } = await axios.get("/management");

      setData(() => data.count);
      setStats(() => data.stats);
      setGraph(() => data.graph);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    reloadPageData();
  }, []);

  useLayoutEffect(() => {
    toggleLoader(true);
  }, []);

  if (isLoading) return null;

  return (
    <ModuleContainer>
      <Typography variant="h5">Data</Typography>

      <DataSection data={data} />

      <Label variant="h5">Statistics</Label>
      <StatsSection stats={stats} />
      <GraphSection graph={graph} />

      <Box sx={{ display: { sm: "none", md: "block" } }}>
        <Label variant="h5">Import / Export</Label>
        <ManagementSection reloadPageData={reloadPageData} />
      </Box>
    </ModuleContainer>
  );
};

export default DataManagement;
