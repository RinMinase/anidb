import { useState } from "preact/hooks";
import { Tab, Tabs } from "@mui/material";

import { ModuleContainer, TabPanel } from "@components";

import ComponentsTypesTab from "./components/ComponentTypesTab";
import ComponentsListTab from "./components/ComponentsListTab";

const PcComponents = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <ModuleContainer headerText="PC Components">
      <Tabs
        value={currentTab}
        onChange={(_e, tab: number) => setCurrentTab(tab)}
      >
        <Tab label="Components List" />
        <Tab label="Component Types" />
      </Tabs>

      <TabPanel
        currentTab={currentTab}
        tabIndex={0}
        children={<ComponentsListTab />}
      />
      <TabPanel
        currentTab={currentTab}
        tabIndex={1}
        children={<ComponentsTypesTab />}
      />
    </ModuleContainer>
  );
};

export default PcComponents;
