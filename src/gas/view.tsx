import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { SxProps, Tab, Tabs } from "@mui/material";

import { Dialog, ModuleContainer, TabPanel } from "@components";

import ViewFuelTab from "./fuel";
import ViewMaintenanceTab from "./maintenance";

const tabPanelSxProps: SxProps = {
  maxHeight: {
    xs: undefined,
    /*
     * Calculation Description:
     * 48px - navbar
     * 48px - container padding
     * 49px - page heading
     * 48px - tab heading
     */
    md: "calc(100vh - 48px - 48px - 49px - 48px)",
  },
  overflowY: {
    xs: undefined,
    md: "hidden",
  },
};

const GasView = () => {
  const location = useLocation();

  const [currentTab, setCurrentTab] = useState(0);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleBackSubmit = () => {
    location.route("/gas");
  };

  return (
    <ModuleContainer
      headerText="Gas Data"
      handleBack={() => setDialogOpen(true)}
    >
      <Tabs
        value={currentTab}
        onChange={(_e, tab: number) => setCurrentTab(tab)}
      >
        <Tab label="Fuel" />
        <Tab label="Maintenance" />
      </Tabs>

      <TabPanel
        currentTab={currentTab}
        tabIndex={0}
        children={<ViewFuelTab />}
        sx={tabPanelSxProps}
      />
      <TabPanel
        currentTab={currentTab}
        tabIndex={1}
        children={<ViewMaintenanceTab />}
        sx={tabPanelSxProps}
      />

      <Dialog
        type="warning"
        title="Are you sure?"
        text="Any changes will not be saved."
        onSubmit={handleBackSubmit}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />
    </ModuleContainer>
  );
};

export default GasView;
