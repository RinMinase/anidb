import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { green, orange, red } from "@mui/material/colors";
import { toast } from "sonner";

import {
  Box,
  Grid2 as Grid,
  LinearProgress,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  styled,
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
  DashboardTile,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
  Swal,
} from "@components";

import { Dashboard } from "./_components";
import { Data, Item, Sims } from "./types";

const CustomMenuList = styled(MenuList)<{ component: any }>({
  marginTop: 12,
  padding: 0,
  overflow: "hidden",
});

const BucketSim = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [sims, setSims] = useState<Sims>([]);
  const [data, setData] = useState<Data>([]);
  const [selected, setSelected] = useState("");

  const handleSelectSim = async (uuid: string) => {
    if (uuid !== selected) {
      toggleLoader(true);

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
      } finally {
        toggleLoader(false);
      }
    }
  };

  const handleSaveClick = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will replace the current bucket list",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      toggleLoader(true);

      await axios.post(`/bucket-sims/save/${selected}`);
      toast.success("Success");

      toggleLoader(false);
      route(`/buckets`);
    }
  };

  const handleCloneClick = async (e: any, uuid: string) => {
    e.stopPropagation();

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This item will be cloned to a new bucket sim",
        icon: "question",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        toggleLoader(true);

        const {
          data: {
            data: { newId },
          },
        } = await axios.post(`/bucket-sims/clone/${uuid}`);

        toast.success("Success");

        const {
          data: { data },
        } = await axios.get("/bucket-sims");

        setSims(() => data);

        if (data.length) {
          handleSelectSim(newId);
        }
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

  const handleDeleteClick = async (e: any, uuid: string) => {
    e.stopPropagation();

    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "This item will be deleted",
        icon: "error",
        showCancelButton: true,
      });

      if (result.isConfirmed) {
        toggleLoader(true);

        await axios.delete(`/bucket-sims/${uuid}`);
        toast.success("Success");

        const {
          data: { data },
        } = await axios.get("/bucket-sims");

        setSims(() => data);

        if (data.length) {
          handleSelectSim(data[0].uuid);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const fetchData = async () => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = await axios.get("/bucket-sims");

      setSims(() => data);

      if (data.length) {
        await handleSelectSim(data[0].uuid);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="Bucket Simulator">
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <Button
            variant="contained"
            fullWidth
            onClick={() => route("/bucket-sims/add")}
          >
            Add
          </Button>
          <CustomMenuList component={Paper}>
            {sims.map((item) => (
              <MenuItem
                key={item.uuid}
                selected={selected === item.uuid}
                onClick={() => handleSelectSim(item.uuid)}
              >
                <ListItemText>{item.description}</ListItemText>
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
          </CustomMenuList>
        </Grid>
        {!isLoading && (
          <Grid size={{ xs: 12, sm: 8 }}>
            <Dashboard>
              <Box mb={2} textAlign="center">
                <Button variant="contained" onClick={handleSaveClick}>
                  Overwrite current bucket setup with this
                </Button>
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
            </Dashboard>
          </Grid>
        )}
      </Grid>
    </ModuleContainer>
  );
};

export default BucketSim;
