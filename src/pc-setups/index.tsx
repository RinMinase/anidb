import { useContext, useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { route } from "preact-router";
import axios from "axios";

import {
  Box,
  Grid2 as Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Database as ManageComponentsIcon,
  Eye,
  EyeOff,
  Plus as AddOwnerIcon,
} from "react-feather";

import {
  Button,
  ButtonLoading,
  ControlledField,
  Dialog,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
} from "@components";

import { PCInfo, PCInfoStats, PCOwnerList } from "./types";

import SetupTable from "./components/SetupTable";
import Highlights from "./components/Highlights";
import OwnerSetupsList from "./components/OwnerSetupsList";

import {
  addOwnerDefaultValues,
  AddOwnerForm,
  addOwnerResolver,
} from "./validation";

const ShowIcon = <Eye size={20} strokeWidth={1.5} />;
const HideIcon = <EyeOff size={20} strokeWidth={1.5} />;

const PcSetup = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [dataOwners, setDataOwners] = useState<PCOwnerList>([]);
  const [dataSetup, setDataSetup] = useState<PCInfo>();
  const [stats, setStats] = useState<PCInfoStats>();
  const [showHidden, setShowHidden] = useState(false);
  const [isTableLoading, setTableLoading] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState<string>();

  const [isAddOwnerDialogOpen, setAddOwnerDialogOpen] = useState(false);
  const [isAddOwnerLoading, setAddOwnerLoading] = useState(false);

  const {
    control: addOwnerControl,
    getValues: addOwnerGetValues,
    reset: addOwnerReset,
    formState: { errors: addOwnerErrors },
  } = useForm<AddOwnerForm>({
    defaultValues: addOwnerDefaultValues,
    resolver: addOwnerResolver,
    mode: "onChange",
  });

  const fetchDataInfo = async (uuid: string) => {
    setSelectedInfo(uuid);
    setTableLoading(true);

    try {
      const {
        data: { data, stats },
      } = await axios.get(`/pc/infos/${uuid}`);

      setDataSetup(data);
      setStats(stats);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchData = async (hidden?: boolean) => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = (await axios.get("/pc/owners", {
        params: { show_hidden: hidden ?? false },
      })) as {
        data: { data: PCOwnerList };
      };

      setDataOwners(data);

      if (selectedInfo) {
        let selectedInfoPresent = false;
        data.forEach((item) => {
          item.infos.forEach((info) => {
            if (info.uuid === selectedInfo) {
              selectedInfoPresent = true;
            }
          });
        });

        if (selectedInfoPresent) return;
      }

      if (data.length) {
        let firstId = "";
        data.forEach((item) => {
          if (!firstId && item.infos.length) {
            firstId = item.infos[0].uuid;
          }
        });

        if (firstId) fetchDataInfo(firstId);
      } else {
        setTableLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleShowHiddenButtonClick = () => {
    fetchData(!showHidden);
    setShowHidden((prev) => !prev);
  };

  const handleAddOwnerSubmit = async () => {
    try {
      setAddOwnerLoading(true);
      setAddOwnerDialogOpen(false);

      const values = addOwnerGetValues();
      await axios.post("/pc/owners", values);

      addOwnerReset();
      setAddOwnerLoading(false);

      toast.success("Success");
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const HeaderControls = () => (
    <Stack
      sx={{ flexDirection: { xs: "column", sm: "row" }, gap: 2 }}
      alignItems="center"
    >
      {isMobile ? (
        <Button
          variant="contained"
          color={showHidden ? "info" : "warning"}
          startIcon={showHidden ? ShowIcon : HideIcon}
          onClick={handleShowHiddenButtonClick}
          sx={{ width: "100%" }}
        >
          {showHidden ? "Show Hidden" : "Hide Hidden"}
        </Button>
      ) : (
        <IconButton
          children={showHidden ? ShowIcon : HideIcon}
          onClick={handleShowHiddenButtonClick}
        />
      )}
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ManageComponentsIcon size={20} strokeWidth={1.5} />}
        sx={{ width: { xs: "100%", sm: "unset" } }}
        onClick={() => route("/pc-setups/components")}
      >
        Manage Components
      </Button>
      <ButtonLoading
        variant="contained"
        loading={isAddOwnerLoading}
        startIcon={<AddOwnerIcon size={20} strokeWidth={1.5} />}
        sx={{ minWidth: 120, width: { xs: "100%", sm: "unset" } }}
        onClick={() => {
          setAddOwnerDialogOpen(true);
        }}
      >
        Add Owner
      </ButtonLoading>
    </Stack>
  );

  const AddOwnerDialog = () => (
    <Box>
      <Typography pb={1}>Enter the name of the Owner</Typography>
      <ControlledField
        name="name"
        size="small"
        control={addOwnerControl}
        error={!!addOwnerErrors.name}
        helperText={addOwnerErrors.name?.message}
      />
    </Box>
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer
      headerText="PC Setups"
      headerControls={<HeaderControls />}
      stackedHeaderControls
    >
      <Grid container spacing={2}>
        <Grid container size={{ xs: 12, sm: 5, md: 4, lg: 3 }}>
          <OwnerSetupsList
            selectedInfo={selectedInfo}
            setSelectedInfo={setSelectedInfo}
            data={dataOwners}
            fetchData={fetchData}
            fetchDataInfo={fetchDataInfo}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 8, lg: 9 }}>
          <Highlights isTableLoading={isTableLoading} stats={stats} />

          <SetupTable
            isTableLoading={isTableLoading}
            fetchData={fetchData}
            data={dataSetup}
          />
        </Grid>
      </Grid>

      <Dialog
        type="primary"
        title="Add new owner"
        content={<AddOwnerDialog />}
        open={isAddOwnerDialogOpen}
        onSubmit={handleAddOwnerSubmit}
        setOpen={setAddOwnerDialogOpen}
      />
    </ModuleContainer>
  );
};

export default PcSetup;
