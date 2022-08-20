import { Box, styled } from "@mui/material";

import DataSection from "./components/DataSection";
import GraphSection from "./components/GraphSection";
import ManagementSection from "./components/ManagementSection";
import StatsSection from "./components/StatsSection";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const DataManagement = () => {
  return (
    <ModuleContainer>
      <DataSection />
      <StatsSection />
      <GraphSection />
      <ManagementSection />
    </ModuleContainer>
  )
}

export default DataManagement;
