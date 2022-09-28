import { useContext } from "preact/hooks";
import { route } from "preact-router";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import Swal from "sweetalert2";
import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";

import {
  Box,
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

import { Button, GlobalLoaderContext } from "@components";

import {
  CellContainer,
  CellField,
  CellField2,
  CellLabel,
  ControlButtons,
  ControlButtonsContainer,
  CustomCell,
  CustomCellButton,
  CustomIconButton,
  DescriptionContainer,
  Header,
  ModuleContainer,
} from "./_components";

import { defaultValues, Form, resolver } from "./validation";

const TB = 1000169533440;

const BucketSimAdd = () => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "buckets",
  });

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

        await axios.post("/bucket-sims", {
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
            Add Bucket Simulation
          </Typography>
        </Box>
        <ControlButtonsContainer>
          <ControlButtons
            variant="contained"
            color="error"
            startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
            onClick={handleBack}
          >
            Back
          </ControlButtons>
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
        </ControlButtonsContainer>
      </Header>

      <DescriptionContainer>
        <TextField
          fullWidth
          variant="outlined"
          label="Description"
          error={!!errors.description}
          helperText={errors.description?.message}
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
                      error={errors.buckets && !!errors.buckets[index]?.from}
                      helperText={
                        errors.buckets && errors.buckets[index]?.from?.message
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
                        error={errors.buckets && !!errors.buckets[index]?.size}
                        {...register(`buckets.${index}.size`)}
                      />
                      <FormHelperText error>
                        {errors.buckets && errors.buckets[index]?.size?.message}
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
    </ModuleContainer>
  );
};

export default BucketSimAdd;
