import { useRef, useState } from "preact/hooks";
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentTab, setCurrentTab] = useState(0);

  const [importLoading, setImportLoading] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);

  const handleImportClick = async () => {
    setImportLoading(true);
    fileInputRef.current?.click();
  };

  const handleImport = async (event: any) => {
    const file = event.target.files[0] as File;

    if (!file) {
      setImportLoading(false);
      return;
    }

    if (file.type !== "application/json") {
      setImportLoading(false);
      toast.error("Please select a valid JSON file.");
      return;
    }

    const form = new FormData();
    form.append("file", file);

    try {
      const {
        data: { data },
      } = await axios.post("/gas/import", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const description = () => (
        <>
          <span>
            <span>Fuel Entries: {data.gas.acceptedImports}&nbsp;</span>
            <span>(out of {data.gas.totalJsonEntries})</span>
          </span>
          <br />
          <span>
            <span>Maintenance: {data.maintenance.acceptedImports}&nbsp;</span>
            <span>(out of {data.maintenance.totalJsonEntries})</span>
          </span>
          <br />
          <span>
            <span>Parts of All Maintenance Records:&nbsp;</span>
            <span>{data.maintenanceParts.acceptedImports}&nbsp;</span>
            <span>(out of {data.maintenanceParts.totalJsonEntries})</span>
          </span>
          <br />
        </>
      );

      toast.success("Success", {
        dismissible: true,
        duration: Infinity,
        description,
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setImportLoading(false);
      event.target.value = "";
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
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImport}
        onCancel={() => setImportLoading(false)}
        accept=".json,application/json"
        style={{ display: "none" }}
      />

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
        onClick={handleImportClick}
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
