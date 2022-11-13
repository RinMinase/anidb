import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";

import {
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  LinearProgress,
  Paper,
  TextField,
} from "@mui/material";

import { green, orange, red } from "@mui/material/colors";

import {
  faAdd as AddIcon,
  faArrowLeftLong as BackIcon,
  faAngleDown as DownIcon,
  faAngleUp as UpIcon,
  faDatabase as StorageIcon,
  faEye as PreviewIcon,
  faFloppyDisk as SaveIcon,
  faHardDrive as DriveIcon,
  faTrash as RemoveIcon,
} from "@fortawesome/free-solid-svg-icons";

import {
  ButtonLoading,
  DashboardTile,
  GlobalLoaderContext,
  ModuleContainer,
  Swal,
  Table,
} from "@components";

import {
  CellContainer,
  CellField,
  CellField2,
  CellLabel,
  ControlButtons,
  CustomCell,
  CustomCellButton,
  CustomIconButton,
  Dashboard,
  DescriptionContainer,
} from "./_components";

import { Form, resolver } from "./validation";
import { Data, Item } from "./types";

type Props = {
  matches: {
    id: string;
  };
};

const TB = 1000169533440;

const BucketSimEdit = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);
  const [previewLoader, setPreviewLoader] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    mode: "onChange",
  });

  const { fields, append, remove, swap, replace } = useFieldArray({
    control,
    name: "buckets",
  });

  const handlePreviewForm = async (formdata: Form) => {
    setPreviewLoader(true);

    try {
      if (formdata.buckets) {
        const buckets = formdata.buckets.map((item) => ({
          from: item.from.toLowerCase(),
          to: item.to.toLowerCase(),
          size: item.size ? item.size * TB : 0,
        }));

        const bucketData = JSON.stringify(buckets);

        await axios.put(`/bucket-sims/${props.matches.id}`, {
          description: formdata.description,
          buckets: bucketData,
        });

        const {
          data: {
            data: { data },
          },
        } = await axios.get(`/bucket-sims/${props.matches.id}`);

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

        setData(() => newBuckets);
        setPreviewLoader(false);
      }
    } catch (err) {
      setPreviewLoader(false);
      console.error(err);
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    toggleLoader(true);

    try {
      if (formdata.buckets) {
        const buckets = formdata.buckets.map((item) => ({
          from: item.from.toLowerCase(),
          to: item.to.toLowerCase(),
          size: item.size ? item.size * TB : 0,
        }));

        const data = JSON.stringify(buckets);

        await axios.put(`/bucket-sims/${props.matches.id}`, {
          description: formdata.description,
          buckets: data,
        });

        await Swal.fire({
          title: "Success!",
          icon: "success",
        });

        toggleLoader(false);
        route("/bucket-sims");
      }
    } catch (err) {
      toggleLoader(false);
      console.error(err);
    }
  };

  const handleBack = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Any changes will not be saved",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) route("/bucket-sims");
    });
  };

  const HeaderControls = () => (
    <>
      <ControlButtons
        variant="contained"
        color="error"
        startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
        sx={{ display: { xs: "none", sm: "inline-flex" } }}
        onClick={handleBack}
      >
        Back
      </ControlButtons>
      {!isLoading && (
        <>
          <ControlButtons
            variant="contained"
            startIcon={<FontAwesomeSvgIcon icon={AddIcon} />}
            onClick={() => {
              append({ from: "", to: "", size: null });
            }}
          >
            Add
          </ControlButtons>
          <ControlButtons
            variant="contained"
            startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
            onClick={handleSubmit(handleSubmitForm)}
          >
            Save
          </ControlButtons>
        </>
      )}
    </>
  );

  useEffect(() => {
    toggleLoader(true);

    axios
      .get(`/bucket-sims/${props.matches.id}`)
      .then(({ data: { data: apiData } }) => {
        const { data, description } = apiData;

        const formData = data.slice(1).map((item: Item) => ({
          from: item.from,
          to: item.to,
          size: item.rawTotal ? Math.round(item.rawTotal / TB) : 0,
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
        setData(() => buckets);
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  }, []);

  return (
    <ModuleContainer
      headerText="Edit Bucket Simulation"
      handleBack={handleBack}
      headerControls={<HeaderControls />}
    >
      {!isLoading && (
        <Grid item xs={12} sm={8}>
          <Dashboard>
            <Grid container spacing={4}>
              {data &&
                data.map((item, index) => {
                  if (index === 0) {
                    return (
                      <Grid item xs={12} sm={4} md={3} key={`bucket${index}`}>
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
                    <Grid item xs={12} sm={4} md={3} key={`bucket${index}`}>
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
      )}

      {!isLoading && (
        <>
          <DescriptionContainer>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={9} md={10}>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="Description"
                  size="small"
                  error={!!errors.description}
                  helperText={errors.description?.message}
                  InputLabelProps={{ shrink: true }}
                  {...register("description")}
                />
              </Grid>
              <Grid item xs={12} sm={3} md={2} display="flex">
                <ButtonLoading
                  variant="contained"
                  startIcon={<FontAwesomeSvgIcon icon={PreviewIcon} />}
                  onClick={handleSubmit(handlePreviewForm)}
                  loading={previewLoader}
                  fullWidth
                >
                  Preview
                </ButtonLoading>
              </Grid>
            </Grid>
          </DescriptionContainer>

          <Table.Container component={Paper}>
            <Table.Element>
              <Table.Body>
                {fields.map((field, index) => (
                  <Table.Row key={field.id}>
                    <CustomCell>
                      <CellContainer>
                        <CellLabel>From:</CellLabel>
                        <CellField
                          variant="outlined"
                          size="small"
                          error={
                            errors.buckets && !!errors.buckets[index]?.from
                          }
                          helperText={
                            errors.buckets &&
                            errors.buckets[index]?.from?.message
                          }
                          {...register(`buckets.${index}.from`)}
                        />
                      </CellContainer>
                    </CustomCell>
                    <CustomCell>
                      <CellContainer>
                        <CellLabel>To:</CellLabel>
                        <CellField
                          variant="outlined"
                          size="small"
                          error={errors.buckets && !!errors.buckets[index]?.to}
                          helperText={
                            errors.buckets && errors.buckets[index]?.to?.message
                          }
                          {...register(`buckets.${index}.to`)}
                        />
                      </CellContainer>
                    </CustomCell>
                    <CustomCell>
                      <CellContainer>
                        <CellLabel>Size:</CellLabel>
                        <FormControl>
                          <CellField2
                            type="tel"
                            size="small"
                            endAdornment={
                              <InputAdornment position="end">TB</InputAdornment>
                            }
                            error={
                              errors.buckets && !!errors.buckets[index]?.size
                            }
                            {...register(`buckets.${index}.size`)}
                          />
                          <FormHelperText error>
                            {errors.buckets &&
                              errors.buckets[index]?.size?.message}
                          </FormHelperText>
                        </FormControl>
                      </CellContainer>
                    </CustomCell>

                    {index !== 0 ? (
                      <CustomCellButton>
                        <CustomIconButton
                          size="small"
                          onClick={() => swap(index, index - 1)}
                        >
                          <FontAwesomeSvgIcon icon={UpIcon} />
                        </CustomIconButton>
                      </CustomCellButton>
                    ) : (
                      <CustomCellButton />
                    )}

                    {index !== fields.length - 1 ? (
                      <CustomCellButton>
                        <CustomIconButton
                          size="small"
                          onClick={() => swap(index, index + 1)}
                        >
                          <FontAwesomeSvgIcon icon={DownIcon} />
                        </CustomIconButton>
                      </CustomCellButton>
                    ) : (
                      <CustomCellButton />
                    )}

                    <CustomCellButton>
                      <CustomIconButton
                        size="small"
                        color="error"
                        onClick={() => remove(index)}
                      >
                        <FontAwesomeSvgIcon icon={RemoveIcon} />
                      </CustomIconButton>
                    </CustomCellButton>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Element>
          </Table.Container>
        </>
      )}
    </ModuleContainer>
  );
};

export default BucketSimEdit;
