import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";

import {
  Box,
  Grid,
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

import StorageIcon from "@mui/icons-material/Storage";
import FolderIcon from "@mui/icons-material/FolderOpenOutlined";

import { DashboardTile, GlobalLoaderContext, TableLoader } from "@components";
import { Buckets, Data, Stats } from "./types";

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
        console.log("data", data);
        setBuckets(() => data);

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
                      icon={<StorageIcon fontSize="large" />}
                      iconColor={"#ff9800"}
                      heading={"Total"}
                      subHeading={`${bucket.used} / ${bucket.total}`}
                      value={`${bucket.percent}%`}
                      footerLeft={`Free: ${bucket.free}`}
                      footerRight={`${bucket.titles} Titles`}
                    />
                  </Grid>
                );
              }

              return (
                <Grid item xs={12} sm={6} md={3} key={`bucket${index}`}>
                  <DashboardTile
                    icon={<FolderIcon fontSize="large" />}
                    iconColor={"#2196f3"}
                    heading={`${bucket.from.toUpperCase()} - ${bucket.to.toUpperCase()}`}
                    subHeading={`${bucket.used} / ${bucket.total}`}
                    value={`${bucket.percent}%`}
                    footerLeft={`Free: ${bucket.free}`}
                    footerRight={`${bucket.titles} Titles`}
                    onClick={() => handleClickBucket(bucket.id)}
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
                  <TableCell>{item.title}</TableCell>
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
