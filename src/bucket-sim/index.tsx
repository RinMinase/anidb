import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import {
  Box,
  Grid,
  LinearProgress,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  styled,
  Tooltip,
} from "@mui/material";

import { green, orange, red } from "@mui/material/colors";

import {
  faDatabase as StorageIcon,
  faFloppyDisk as SaveIcon,
  faHardDrive as DriveIcon,
  faPenToSquare as EditIcon,
  faTrash as DeleteIcon,
} from "@fortawesome/free-solid-svg-icons";

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

  const handleSelectSim = (uuid: string) => {
    if (uuid !== selected) {
      toggleLoader(true);

      axios
        .get(`/bucket-sims/${uuid}`)
        .then(({ data: { data } }) => {
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
        })
        .catch((err) => console.error(err))
        .finally(() => toggleLoader(false));
    }
  };

  const handleSaveClick = async (e: any, uuid: string) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will replace the current bucket list",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      toggleLoader(true);

      await axios.post(`/bucket-sims/${uuid}`);
      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      toggleLoader(false);
      route(`/buckets`);
    }
  };

  const handleEditClick = (e: any, uuid: string) => {
    e.stopPropagation();
    route(`/bucket-sims/edit/${uuid}`);
  };

  const handleDeleteClick = async (e: any, uuid: string) => {
    e.stopPropagation();

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted",
      icon: "error",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      toggleLoader(true);

      await axios.delete(`/bucket-sims/${uuid}`);
      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      const {
        data: { data },
      } = await axios.get("/bucket-sims");

      setSims(() => data);

      if (data.length) {
        handleSelectSim(data[0].uuid);
      }

      toggleLoader(false);
    }
  };

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/bucket-sims")
      .then(({ data: { data } }) => {
        setSims(() => data);

        if (data.length) {
          handleSelectSim(data[0].uuid);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  }, []);

  return (
    <ModuleContainer headerText="Bucket Simulator">
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
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
                <Tooltip title="Save as current bucket" placement="top">
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleSaveClick(e, item.uuid)}
                    >
                      <FontAwesomeSvgIcon icon={SaveIcon} />
                    </IconButton>
                  </Box>
                </Tooltip>
                <Tooltip title="Edit" placement="top">
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleEditClick(e, item.uuid)}
                    >
                      <FontAwesomeSvgIcon icon={EditIcon} />
                    </IconButton>
                  </Box>
                </Tooltip>
                <Tooltip title="Delete" placement="top">
                  <Box>
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteClick(e, item.uuid)}
                    >
                      <FontAwesomeSvgIcon icon={DeleteIcon} />
                    </IconButton>
                  </Box>
                </Tooltip>
              </MenuItem>
            ))}
          </CustomMenuList>
        </Grid>
        {!isLoading && (
          <Grid item xs={12} sm={8}>
            <Dashboard>
              <Grid container spacing={4}>
                {data &&
                  data.map((item, index) => {
                    if (index === 0) {
                      return (
                        <Grid item xs={12} sm={6} md={4} key={`bucket${index}`}>
                          <DashboardTile
                            icon={
                              <FontAwesomeSvgIcon
                                size="2x"
                                icon={StorageIcon}
                              />
                            }
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
                      <Grid item xs={12} sm={6} md={4} key={`bucket${index}`}>
                        <DashboardTile
                          icon={
                            <FontAwesomeSvgIcon size="2x" icon={DriveIcon} />
                          }
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
