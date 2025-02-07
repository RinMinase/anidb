import { useState } from "preact/hooks";
import { SxProps, Tab, Tabs } from "@mui/material";

import { ModuleContainer, TabPanel } from "@components";

import AudioTab from "./components/audio";
import GroupTab from "./components/group";
import VideoTab from "./components/video";

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
  overflow: {
    xs: undefined,
    md: "scroll",
  },
};

const Autofills = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <ModuleContainer headerText="Autofill Contents">
      <Tabs
        value={currentTab}
        onChange={(e, tab: number) => setCurrentTab(tab)}
      >
        <Tab label="Audio" />
        <Tab label="Video" />
        <Tab label="Groups" />
      </Tabs>

      <TabPanel
        currentTab={currentTab}
        tabIndex={0}
        children={<AudioTab />}
        sx={tabPanelSxProps}
      />
      <TabPanel
        currentTab={currentTab}
        tabIndex={1}
        children={<VideoTab />}
        sx={tabPanelSxProps}
      />
      <TabPanel
        currentTab={currentTab}
        tabIndex={2}
        children={<GroupTab />}
        sx={tabPanelSxProps}
      />
    </ModuleContainer>
  );
};

export default Autofills;
