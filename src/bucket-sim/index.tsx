// commit to change to lf

import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { green, orange, red } from "@mui/material/colors";
import { toast } from "sonner";
import axios from "axios";

import {
  Box,
  Grid2 as Grid,
  LinearProgress,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Tooltip,
} from "@mui/material";

import {
  Copy as CopyIcon,
  Trash as DeleteIcon,
  HardDrive as DriveIcon,
  Edit as EditIcon,
  Database as StorageIcon,
} from "react-feather";

import {
  Button,
  ButtonLoading,
  DashboardTile,
  Dialog,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
} from "@components";

import { Data, Item, Sims } from "./types";

const BucketSim = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [isOverwriteButtonLoading, setOverwriteButtonLoading] = useState(false);
  const [isBackupLoading, setBackupLoading] = useState(false);

  const [isCloneDialogOpen, setCloneDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSaveDialogOpen, setSaveDialogOpen] = useState(false);
  const [dialogSelection, setDialogSelection] = useState<string>();

  const [sims, setSims] = useState<Sims>([]);
  const [data, setData] = useState<Data>([]);
  const [selected, setSelected] = useState("");

  const fetchData = async () => {
    try {
      toggleLoader(true);

      const {
        data: { data },
      } = await axios.get("/bucket-sims");

      setSims(() => data);

      if (data.length) {
        await fetchSim(data[0].uuid);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const fetchSim = async (uuid: string) => {
    try {
      const {
        data: { data },
      } = await axios.get(`/bucket-sims/${uuid}`);

      const buckets: Data = data.map((item: Item) => {
        const { percent } = item;

        let bucketColor: string = green[700];
        let progressColor = "success";

        if (percent > 90) {
          bucketColor = red[700];
          progressColor = "error";
        } else if (percent > 80) {
          bucketColor = orange[700];
          progressColor = "warning";
        }

        return { ...item, bucketColor, progressColor };
      });

      setData(() => buckets);
      setSelected(uuid);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleSelectSim = async (uuid: string) => {
    if (uuid !== selected) {
      toggleLoader(true);
      await fetchSim(uuid);
    }
  };

  const handleSaveSubmit = async () => {
    try {
      setSaveDialogOpen(false);
      setOverwriteButtonLoading(true);

      await axios.post(`/bucket-sims/save/${selected}`);
      toast.success("Success");

      route(`/buckets`);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setOverwriteButtonLoading(false);
    }
  };

  const handleCloneClick = (e: any, uuid: string) => {
    e.stopPropagation();
    setDialogSelection(uuid);
    setCloneDialogOpen(true);
  };

  const handleCloneSubmit = async () => {
    try {
      setCloneDialogOpen(false);
      toggleLoader(true);

      const {
        data: {
          data: { newId },
        },
      } = await axios.post(`/bucket-sims/clone/${dialogSelection}`);

      toast.success("Success");

      const {
        data: { data },
      } = await axios.get("/bucket-sims");

      setSims(() => data);

      if (data.length) {
        handleSelectSim(newId);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleEditClick = (e: any, uuid: string) => {
    e.stopPropagation();
    route(`/bucket-sims/edit/${uuid}`);
  };

  const handleDeleteClick = (e: any, uuid: string) => {
    e.stopPropagation();
    setDialogSelection(uuid);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      setDeleteDialogOpen(false);
      toggleLoader(true);

      await axios.delete(`/bucket-sims/${dialogSelection}`);
      toast.success("Success");

      const {
        data: { data },
      } = await axios.get("/bucket-sims");

      setSims(() => data);

      if (data.length) {
        handleSelectSim(data[0].uuid);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleBackup = async () => {
    try {
      setBackupLoading(true);

      await axios.post("/bucket-sims/backup");
      toast.success("Success");

      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setBackupLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="Bucket Simulator">
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Stack spacing={1}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => route("/bucket-sims/add")}
            >
              Add
            </Button>
            <ButtonLoading
              variant="contained"
              fullWidth
              loading={isBackupLoading}
              onClick={handleBackup}
            >
              Backup current bucket list
            </ButtonLoading>
          </Stack>
          <MenuList
            component={Paper}
            sx={{ marginTop: 1.5, padding: 0, overflow: "hidden" }}
          >
            {sims.map((item) => (
              <MenuItem
                key={item.uuid}
                selected={selected === item.uuid}
                onClick={() => handleSelectSim(item.uuid)}
              >
                <ListItemText
                  sx={{
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-all",
                  }}
                >
                  {item.description}
                </ListItemText>
                <Tooltip title="Clone" placement="top">
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleCloneClick(e, item.uuid)}
                      children={<CopyIcon size={20} />}
                    />
                  </Box>
                </Tooltip>
                <Tooltip title="Edit" placement="top">
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleEditClick(e, item.uuid)}
                      children={<EditIcon size={20} />}
                    />
                  </Box>
                </Tooltip>
                <Tooltip title="Delete" placement="top">
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteClick(e, item.uuid)}
                      children={<DeleteIcon size={20} />}
                    />
                  </Box>
                </Tooltip>
              </MenuItem>
            ))}
          </MenuList>
        </Grid>
        {!isLoading && (
          <Grid size={{ xs: 12, sm: 8 }}>
            <Box mb={4}>
              <Box mb={2} textAlign="center">
                <ButtonLoading
                  variant="contained"
                  loading={isOverwriteButtonLoading || isLoading}
                  onClick={() => setSaveDialogOpen(true)}
                >
                  Overwrite current bucket setup with this
                </ButtonLoading>
              </Box>
              <Grid container spacing={4}>
                {data.map((item, index) => {
                  if (index === 0) {
                    return (
                      <Grid
                        size={{ xs: 12, sm: 6, md: 4 }}
                        key={`bucket${index}`}
                      >
                        <DashboardTile
                          icon={<StorageIcon size={32} />}
                          iconColor={item.bucketColor}
                          heading={"Total"}
                          subHeading={`${item.used || "0 B"} / ${item.total}`}
                          value={`${item.percent}%`}
                          footerLeft={`Free: ${item.free}`}
                          footerRight={`${item.titles} Titles`}
                          CustomDivider={
                            <LinearProgress
                              variant="determinate"
                              value={item.percent}
                              color={item.progressColor}
                            />
                          }
                        />
                      </Grid>
                    );
                  }

                  return (
                    <Grid
                      size={{ xs: 12, sm: 6, md: 4 }}
                      key={`bucket${index}`}
                    >
                      <DashboardTile
                        icon={<DriveIcon size={32} />}
                        iconColor={item.bucketColor}
                        heading={`${item.from.toUpperCase()} - ${item.to.toUpperCase()}`}
                        subHeading={`${item.used || "0 B"} / ${item.total}`}
                        value={`${item.percent}%`}
                        footerLeft={`Free: ${item.free}`}
                        footerRight={`${item.titles} Titles`}
                        CustomDivider={
                          <LinearProgress
                            variant="determinate"
                            value={item.percent}
                            color={item.progressColor}
                          />
                        }
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          </Grid>
        )}
      </Grid>

      <Dialog
        type="warning"
        title="Are you sure?"
        text="This will replace the current bucket list."
        onSubmit={handleSaveSubmit}
        open={isSaveDialogOpen}
        setOpen={setSaveDialogOpen}
      />

      <Dialog
        type="info"
        title="Are you sure?"
        text="This item will be cloned to a new bucket sim."
        onSubmit={handleCloneSubmit}
        open={isCloneDialogOpen}
        setOpen={setCloneDialogOpen}
      />

      <Dialog
        title="Are you sure?"
        text="This content would be deleted."
        onSubmit={handleDeleteSubmit}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </ModuleContainer>
  );
};

export default BucketSim;
