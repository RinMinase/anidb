import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import { HardDrive as DriveIcon, Database as StorageIcon } from "react-feather";
import { green, orange, red } from "@mui/material/colors";
import { toast } from "sonner";

import {
  Box,
  Grid2 as Grid,
  LinearProgress,
  Paper,
  styled,
  Typography,
} from "@mui/material";

import {
  DashboardTile,
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  Table,
} from "@components";

import { Bucket as SingleBucket, Buckets, Data, Stats } from "./types";

const Dashboard = styled(Box)({
  marginBottom: 32,
});

const CustomTable = styled(Table.Element)({
  minWidth: 650,
});

const Bucket = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [isTableLoading, setTableLoading] = useState(false);
  const [data, setData] = useState<Data>([]);
  const [buckets, setBuckets] = useState<Buckets>([]);
  const [currBucket, setCurrBucket] = useState<Stats>({
    from: "",
    to: "",
  });

  const handleClickBucket = async (id: number) => {
    try {
      setTableLoading(true);

      const {
        data: { data, stats },
      } = await axios.get(`/entries/by-bucket/${id}`);

      setData(() => data);
      setCurrBucket(() => stats);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      toggleLoader(true);

      const {
        data: { data },
      } = await axios.get("/entries/by-bucket");

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

      handleClickBucket(bucketList[1].id);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="Bucket Lists">
      <Dashboard>
        <Grid container spacing={4}>
          {buckets &&
            buckets.map((bucket, index) => {
              if (index === 0) {
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`bucket${index}`}>
                    <DashboardTile
                      icon={<StorageIcon size={32} />}
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
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={`bucket${index}`}>
                  <DashboardTile
                    icon={<DriveIcon size={32} />}
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

      {!isLoading && !isTableLoading && (
        <Typography variant="h5" gutterBottom>
          <Typography variant="inherit" component={"span" as any}>
            Selected Disk:{" "}
          </Typography>
          <Typography
            variant="inherit"
            component={"span" as any}
          >{` ${currBucket.from.toUpperCase()}`}</Typography>
          <Typography
            variant="inherit"
            component={"span" as any}
          >{` - ${currBucket.to.toUpperCase()}`}</Typography>
        </Typography>
      )}

      <Table.Container component={Paper}>
        <CustomTable>
          <Table.Head>
            <Table.Row>
              <Table.Cell>Title</Table.Cell>
              <Table.Cell>Filesize</Table.Cell>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {!isTableLoading ? (
              data.map((item) => (
                <Table.Row hover key={item.id}>
                  <Table.Cell>
                    <Quality quality={item.quality} />
                    {item.title}
                  </Table.Cell>
                  <Table.Cell>{item.filesize}</Table.Cell>
                </Table.Row>
              ))
            ) : (
              <Table.Loader />
            )}
          </Table.Body>
        </CustomTable>
      </Table.Container>
    </ModuleContainer>
  );
};

export default Bucket;
