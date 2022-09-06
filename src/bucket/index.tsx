import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import {
  Box,
  Grid,
  LinearProgress,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  faDatabase as StorageIcon,
  faHardDrive as DriveIcon,
} from "@fortawesome/free-solid-svg-icons";

import {
  DashboardTile,
  GlobalLoaderContext,
  Quality,
  TableLoader,
} from "@components";

import { Bucket as SingleBucket, Buckets, Data, Stats } from "./types";
import { green, orange, red } from "@mui/material/colors";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Dashboard = styled(Box)({
  marginBottom: 32,
});

const CustomTable = styled(Table)({
  minWidth: 650,
});

const Bucket = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);
  const [data, setData] = useState<Data>([]);
  const [buckets, setBuckets] = useState<Buckets>([]);
  const [currBucket, setCurrBucket] = useState<Stats>({
    from: "",
    to: "",
  });

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/entries/by-bucket")
      .then(({ data: { data } }) => {
        const bucketList: Buckets = data.map((item: SingleBucket) => {
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

        setBuckets(() => bucketList);

        axios
          .get("/entries/by-bucket/1")
          .then(({ data: { data } }) => {
            setData(() => data.data);
            setCurrBucket(() => data.stats);
            toggleLoader(false);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));
  }, []);

  const handleClickBucket = (id: number) => {
    toggleLoader(true);

    axios
      .get(`/entries/by-bucket/${id}`)
      .then(({ data: { data } }) => {
        setData(() => data.data);
        setCurrBucket(() => data.stats);
        toggleLoader(false);
      })
      .catch((err) => console.error(err));
  };

  return (
    <ModuleContainer>
      <Dashboard>
        <Grid container spacing={4}>
          {buckets &&
            buckets.map((bucket, index) => {
              if (index === 0) {
                return (
                  <Grid item xs={12} sm={6} md={3} key={`bucket${index}`}>
                    <DashboardTile
                      icon={<FontAwesomeSvgIcon size="2x" icon={StorageIcon} />}
                      iconColor={bucket.bucketColor}
                      heading={"Total"}
                      subHeading={`${bucket.used} / ${bucket.total}`}
                      value={`${bucket.percent}%`}
                      footerLeft={`Free: ${bucket.free}`}
                      footerRight={`${bucket.titles} Titles`}
                      CustomDivider={
                        <LinearProgress
                          variant="determinate"
                          value={bucket.percent}
                          color={bucket.progressColor}
                        />
                      }
                    />
                  </Grid>
                );
              }

              return (
                <Grid item xs={12} sm={6} md={3} key={`bucket${index}`}>
                  <DashboardTile
                    icon={<FontAwesomeSvgIcon size="2x" icon={DriveIcon} />}
                    iconColor={bucket.bucketColor}
                    heading={`${bucket.from.toUpperCase()} - ${bucket.to.toUpperCase()}`}
                    subHeading={`${bucket.used} / ${bucket.total}`}
                    value={`${bucket.percent}%`}
                    footerLeft={`Free: ${bucket.free}`}
                    footerRight={`${bucket.titles} Titles`}
                    onClick={() => handleClickBucket(bucket.id)}
                    CustomDivider={
                      <LinearProgress
                        variant="determinate"
                        value={bucket.percent}
                        color={bucket.progressColor}
                      />
                    }
                  />
                </Grid>
              );
            })}
        </Grid>
      </Dashboard>

      {!isLoading && (
        <Typography variant="h5" gutterBottom>
          <Typography variant="inherit" component="span">
            Selected Disk:{" "}
          </Typography>
          <Typography
            variant="inherit"
            component="span"
          >{` ${currBucket.from.toUpperCase()}`}</Typography>
          <Typography
            variant="inherit"
            component="span"
          >{` - ${currBucket.to.toUpperCase()}`}</Typography>
        </Typography>
      )}

      <TableContainer component={Paper}>
        <CustomTable>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Filesize</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {!isLoading ? (
              data.map((item) => (
                <TableRow hover key={item.id}>
                  <TableCell>
                    <Quality quality={item.quality} />
                    {item.title}
                  </TableCell>
                  <TableCell>{item.filesize}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableLoader />
            )}
          </TableBody>
        </CustomTable>
      </TableContainer>
    </ModuleContainer>
  );
};

export default Bucket;
