import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";

import {
  Box,
  Button,
  Grid,
  IconButton,
  LinearProgress,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  styled,
} from "@mui/material";

import { green, orange, red } from "@mui/material/colors";

import {
  faDatabase as StorageIcon,
  faHardDrive as DriveIcon,
  faPenToSquare as EditIcon,
  faTrash as DeleteIcon,
} from "@fortawesome/free-solid-svg-icons";

import { DashboardTile, GlobalLoaderContext } from "@components";

import { Data, Item, Sims } from "./types";
import Swal from "sweetalert2";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Dashboard = styled(Box)({
  marginBottom: 32,
});

const CustomMenuList = styled(MenuList)<{ component: any }>({
  marginTop: 12,
  padding: 0,
  overflow: "hidden",
});

const BucketSim = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [sims, setSims] = useState<Sims>([]);
  const [data, setData] = useState<Data>([]);

  const handleSelectSim = (uuid: string) => {
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
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  };

  const handleEditClick = (e: any, uuid: string) => {
    e.stopPropagation();
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
    <ModuleContainer>
      {!isLoading && (
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => route("/bucket-sim/add")}
            >
              Add
            </Button>
            <CustomMenuList component={Paper}>
              {sims.map((item) => (
                <MenuItem
                  key={item.uuid}
                  onClick={() => handleSelectSim(item.uuid)}
                >
                  <ListItemText>{item.description}</ListItemText>
                  <IconButton
                    size="small"
                    onClick={(e) => handleEditClick(e, item.uuid)}
                  >
                    <FontAwesomeSvgIcon icon={EditIcon} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={(e) => handleDeleteClick(e, item.uuid)}
                  >
                    <FontAwesomeSvgIcon icon={DeleteIcon} />
                  </IconButton>
                </MenuItem>
              ))}
            </CustomMenuList>
          </Grid>
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
                            subHeading={`${item.used} / ${item.total}`}
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
                          subHeading={`${item.used} / ${item.total}`}
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
        </Grid>
      )}
    </ModuleContainer>
  );
};

export default BucketSim;
