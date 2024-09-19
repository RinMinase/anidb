import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";

import { Box, LinearProgress, styled, Typography } from "@mui/material";

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
  });

  const reloadPageData = () => {
    toggleLoader(true);

    axios
      .get("/management")
      .then(({ data: { data } }) => {
        setData(() => data.count);
        setStats(() => data.stats);
        setGraph(() => data.graph);
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  };

  useEffect(() => {
    reloadPageData();
  }, []);

  return (
    <ModuleContainer>
      <Typography variant="h5">Data</Typography>
      {!isLoading ? (
        <DataSection data={data} />
      ) : (
        <Box width="100%" height={170}>
          <LinearProgress />
        </Box>
      )}

      <Label variant="h5">Statistics</Label>
      {!isLoading ? (
        <>
          <StatsSection stats={stats} />
          <GraphSection graph={graph} />
        </>
      ) : (
        <Box width="100%" height={400}>
          <LinearProgress />
        </Box>
      )}

      <Box sx={{ display: { sm: "none", md: "block" } }}>
        <Label variant="h5">Import / Export</Label>
        <ManagementSection reloadPageData={reloadPageData} />
      </Box>
    </ModuleContainer>
  );
};

export default DataManagement;
