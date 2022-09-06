import { useContext, useEffect } from "preact/hooks";
import { route } from "preact-router";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import Swal from "sweetalert2";
import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";

import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  faAdd as AddIcon,
  faArrowLeftLong as BackIcon,
  faAngleDown as DownIcon,
  faAngleUp as UpIcon,
  faFloppyDisk as SaveIcon,
  faTrash as RemoveIcon,
} from "@fortawesome/free-solid-svg-icons";

import { GlobalLoaderContext } from "@components";

import { Form, resolver } from "./validation";
import { Item } from "./types";

import {
  ModuleContainer,
  Header,
  ControlButtonsContainer,
  ControlButtions,
  DescriptionContainer,
  CustomIconButton,
  CustomCell,
  CustomCellButton,
  CellContainer,
  CellLabel,
  CellField,
  CellField2,
} from "./_components";

type Props = {
  matches: {
    id: string;
  };
};

const TB = 1000169533440;

const BucketSimEdit = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

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

  const handleSubmitForm = (formdata: Form) => {
    toggleLoader(true);

    if (formdata.buckets) {
      const buckets = formdata.buckets.map((item) => ({
        from: item.from.toLowerCase(),
        to: item.to.toLowerCase(),
        size: item.size ? item.size * TB : 0,
      }));

      const data = JSON.stringify(buckets);

      axios
        .put(`/bucket-sims/${props.matches.id}`, {
          description: formdata.description,
          buckets: data,
        })
        .then(() => {
          Swal.fire({
            title: "Success!",
            icon: "success",
          }).then(() => {
            toggleLoader(false);
            route("/bucket-sims");
          });
        })
        .catch((err) => {
          toggleLoader(false);
          console.error(err);
        });
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

        replace([...formData]);
        setValue("description", description);
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  }, []);

  return (
    <ModuleContainer>
      <Header>
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              width: 120,
              marginBottom: 2,
            }}
            onClick={handleBack}
          >
            Back
          </Button>
          <Typography variant="h5" alignItems="center">
            Edit Bucket Simulation
          </Typography>
        </Box>
        <ControlButtonsContainer>
          <ControlButtions
            variant="contained"
            color="error"
            startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
            onClick={handleBack}
          >
            Back
          </ControlButtions>
          {!isLoading && (
            <>
              <ControlButtions
                variant="contained"
                startIcon={<FontAwesomeSvgIcon icon={AddIcon} />}
                onClick={() => {
                  append({ from: "", to: "", size: null });
                }}
              >
                Add
              </ControlButtions>
              <ControlButtions
                variant="contained"
                startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
                onClick={handleSubmit(handleSubmitForm)}
              >
                Save
              </ControlButtions>
            </>
          )}
        </ControlButtonsContainer>
      </Header>

      {!isLoading && (
        <>
          <DescriptionContainer>
            <TextField
              fullWidth
              variant="outlined"
              label="Description"
              error={!!errors.description}
              helperText={errors.description?.message}
              InputLabelProps={{ shrink: true }}
              {...register("description")}
            />
          </DescriptionContainer>

          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
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
                            type="number"
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </ModuleContainer>
  );
};

export default BucketSimEdit;
