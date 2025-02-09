import axios from "axios";
import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { useFieldArray, useForm } from "react-hook-form";
import { green, orange, red } from "@mui/material/colors";
import { toast } from "sonner";

import {
  Grid2 as Grid,
  LinearProgress,
  Paper,
  TextField,
  useTheme,
} from "@mui/material";

import {
  Plus as AddIcon,
  ArrowLeft as BackIcon,
  HardDrive as DriveIcon,
  Eye as PreviewIcon,
  Database as StorageIcon,
} from "react-feather";

import {
  ButtonLoading,
  DashboardTile,
  Dialog,
  FILESIZES,
  GlobalLoaderContext,
  ModuleContainer,
  Table,
} from "@components";

import {
  ControlButtons,
  ControlButtonsLoader,
  Dashboard,
  DescriptionContainer,
} from "./_components";

import { defaultValues, Form, resolver } from "./validation";
import { ByNameData, Data, Item } from "./types";
import BucketListDragArea from "./components/BucketListDragArea";

type Props = {
  matches?: {
    id: string;
  };
};

const BucketSimAdd = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSaveLoading, setSaveLoading] = useState(false);
  const [previewData, setPreviewData] = useState<Data>([]);
  const [isPreviewLoading, setPreviewLoading] = useState(false);

  const [byNameData, setByNameData] = useState<ByNameData>([]);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, move, remove, replace } = useFieldArray({
    control,
    name: "buckets",
  });

  const fetchBucketSim = async () => {
    if (props.matches?.id) {
      const {
        data: {
          data,
          stats: { description },
        },
      } = await axios.get(`/bucket-sims/${props.matches.id}`);

      const formData = data.slice(1).map((item: Item) => ({
        from: item.from,
        to: item.to,
        size: item.rawTotal ? Math.round(item.rawTotal / FILESIZES.TB) : 0,
      }));

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

      replace([...formData]);
      setValue("description", description);
      setPreviewData(() => buckets);
    }
  };

  const fetchByName = async () => {
    const {
      data: { data },
    } = await axios.get(`/entries/by-name`);

    setByNameData(data);
  };

  const fetchData = async () => {
    try {
      toggleLoader(true);
      await Promise.all([fetchBucketSim(), fetchByName()]);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handlePreviewForm = async (formdata: Form) => {
    setPreviewLoading(true);

    try {
      if (formdata.buckets) {
        const buckets = formdata.buckets.map((item) => ({
          from: item.from.toLowerCase(),
          to: item.to.toLowerCase(),
          size: item.size ? item.size * FILESIZES.TB : 0,
        }));

        const bucketData = JSON.stringify(buckets);

        const {
          data: { data },
        } = await axios.post(`/bucket-sims/preview`, {
          buckets: bucketData,
        });

        const newBuckets: Data = data.map((item: Item) => {
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

        setPreviewData(() => newBuckets);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    try {
      setSaveLoading(true);

      if (formdata.buckets) {
        const buckets = formdata.buckets.map((item) => ({
          from: item.from.toLowerCase(),
          to: item.to.toLowerCase(),
          size: item.size ? item.size * FILESIZES.TB : 0,
        }));

        const data = JSON.stringify(buckets);

        if (props.matches?.id) {
          await axios.put(`/bucket-sims/${props.matches.id}`, {
            description: formdata.description,
            buckets: data,
          });
        } else {
          await axios.post("/bucket-sims", {
            description: formdata.description,
            buckets: data,
          });
        }

        route("/bucket-sims");
        toast.success("Success");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setSaveLoading(false);
    }
  };

  const HeaderControls = () => (
    <>
      <ControlButtons
        variant="contained"
        color="error"
        startIcon={<BackIcon size={20} />}
        sx={{ display: { xs: "none", sm: "inline-flex" } }}
        onClick={() => setDialogOpen(true)}
      >
        Back
      </ControlButtons>
      {!isLoading && !!previewData.length && (
        <>
          <ControlButtons
            variant="contained"
            startIcon={<AddIcon size={20} />}
            onClick={() => {
              append({ from: "", to: "", size: null });
            }}
          >
            Add
          </ControlButtons>
          <ControlButtonsLoader
            variant="contained"
            loading={isSaveLoading}
            onClick={handleSubmit(handleSubmitForm)}
          >
            Save
          </ControlButtonsLoader>
        </>
      )}
    </>
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer
      headerText={
        props.matches?.id ? "Edit Bucket Simulation" : "Add Bucket Simulation"
      }
      headerControls={<HeaderControls />}
    >
      {!isLoading && (
        <>
          {!isPreviewLoading && (
            <Grid size={{ xs: 12, sm: 8 }}>
              <Dashboard>
                <Grid container spacing={4}>
                  {previewData &&
                    previewData.map((item, index) => {
                      if (index === 0) {
                        return (
                          <Grid
                            size={{ xs: 12, sm: 4, md: 3 }}
                            key={`bucket${index}`}
                          >
                            <DashboardTile
                              icon={<StorageIcon size={32} />}
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
                        <Grid
                          size={{ xs: 12, sm: 4, md: 3 }}
                          key={`bucket${index}`}
                        >
                          <DashboardTile
                            icon={<DriveIcon size={32} />}
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
          )}

          <DescriptionContainer>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 9, md: 10 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Description"
                  size="small"
                  disabled={isSaveLoading}
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  {...register("description")}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 3, md: 2 }} display="flex">
                <ButtonLoading
                  sx={{ maxHeight: 40 }}
                  variant="contained"
                  disabled={isSaveLoading}
                  startIcon={<PreviewIcon size={20} />}
                  onClick={handleSubmit(handlePreviewForm)}
                  loading={isPreviewLoading}
                  fullWidth
                >
                  Preview
                </ButtonLoading>
              </Grid>
            </Grid>
          </DescriptionContainer>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <BucketListDragArea
                register={register}
                trigger={trigger}
                errors={errors}
                fields={fields}
                move={move}
                remove={remove}
                isSaveLoading={isSaveLoading}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Table.Container component={Paper}>
                <Table.Element size="small">
                  <Table.Head>
                    <Table.Row>
                      <Table.Cell />
                      <Table.Cell align="center">Titles</Table.Cell>
                      <Table.Cell align="center">Filesize</Table.Cell>
                    </Table.Row>
                  </Table.Head>

                  <Table.Body>
                    {byNameData.map((item) => (
                      <Table.Row hover key={`byname-${item.letter}`}>
                        <Table.Cell>{item.letter}</Table.Cell>
                        <Table.Cell align="center">{item.titles}</Table.Cell>
                        <Table.Cell align="center">{item.filesize}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Element>
              </Table.Container>
            </Grid>
          </Grid>
        </>
      )}

      <Dialog
        type="warning"
        title="Are you sure?"
        text="Any changes will not be saved."
        onSubmit={() => route("/bucket-sims")}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />
    </ModuleContainer>
  );
};

export default BucketSimAdd;
