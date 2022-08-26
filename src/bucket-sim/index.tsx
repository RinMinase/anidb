import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";

import {
  Box,
  Grid,
  LinearProgress,
  MenuItem,
  MenuList,
  Paper,
  styled,
} from "@mui/material";

import {
  faDatabase as StorageIcon,
  faHardDrive as DriveIcon,
} from "@fortawesome/free-solid-svg-icons";

import { DashboardTile, GlobalLoaderContext } from "@components";

import { Data, Item, Sims } from "./types";
import { green, orange, red } from "@mui/material/colors";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Dashboard = styled(Box)({
  marginBottom: 32,
});

const CustomMenuList = styled(MenuList)<{ component: any }>({
  padding: 0,
  overflow: "hidden",
});

const BucketSim = () => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

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
      <Grid container spacing={4}>
        <Grid item xs={12} sm={4}>
          <CustomMenuList component={Paper}>
            {sims.map((item) => (
              <MenuItem
                key={item.uuid}
                onClick={() => handleSelectSim(item.uuid)}
              >
                {item.description}
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
                            <FontAwesomeSvgIcon size="2x" icon={StorageIcon} />
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
                        icon={<FontAwesomeSvgIcon size="2x" icon={DriveIcon} />}
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
    </ModuleContainer>
  );
};

export default BucketSim;
