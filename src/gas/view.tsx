import { useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { format } from "date-fns";
import { toast } from "sonner";
import axios from "axios";

import { SxProps, Tab, Tabs } from "@mui/material";

import {
  ArrowLeft as BackIcon,
  Download as ExportIcon,
  UploadCloud as ImportIcon,
} from "react-feather";

import { Button, ButtonLoading, ModuleContainer, TabPanel } from "@components";

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

  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleImport = async () => {
    try {
      setImportLoading(true);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setImportLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setExportLoading(true);

      const { data } = await axios.post("/gas/export");

      const timestamp = format(new Date(), "yyyyMMdd-HHmmss");
      const filename = `gas_${timestamp}.json`;

      const jsonString = JSON.stringify(data, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setExportLoading(false);
    }
  };

  const HeaderControls = () => (
    <>
      <ButtonLoading
        variant="contained"
        color="secondary"
        loading={importLoading}
        startIcon={<ImportIcon size={20} />}
        sx={{
          display: { xs: "none", md: "inline-flex" },
          width: 130,
          marginLeft: 2,
        }}
        onClick={handleImport}
      >
        Import
      </ButtonLoading>
      <ButtonLoading
        variant="contained"
        color="secondary"
        loading={exportLoading}
        startIcon={<ExportIcon size={20} />}
        sx={{
          display: { xs: "none", md: "inline-flex" },
          width: 130,
          marginLeft: 2,
        }}
        onClick={handleExport}
      >
        Export
      </ButtonLoading>
      <Button
        variant="contained"
        color="error"
        startIcon={<BackIcon size={20} />}
        sx={{
          minWidth: 120,
          marginLeft: 2,
        }}
        onClick={() => location.route("/gas")}
      >
        Back
      </Button>
    </>
  );

  return (
    <ModuleContainer headerText="Gas Data" headerControls={<HeaderControls />}>
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
    </ModuleContainer>
  );
};

export default GasView;
