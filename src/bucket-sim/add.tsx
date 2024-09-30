import { useContext } from "preact/hooks";
import { route } from "preact-router";
import { useFieldArray, useForm } from "react-hook-form";
import axios from "axios";

import {
  FormControl,
  FormHelperText,
  InputAdornment,
  Paper,
  TextField,
} from "@mui/material";

import {
  Plus as AddIcon,
  ArrowLeft as BackIcon,
  ChevronDown as DownIcon,
  Trash2 as RemoveIcon,
  Save as SaveIcon,
  ChevronUp as UpIcon,
} from "react-feather";

import { GlobalLoaderContext, ModuleContainer, Swal, Table } from "@components";

import {
  CellContainer,
  CellField,
  CellField2,
  CellLabel,
  ControlButtons,
  CustomCell,
  CustomCellButton,
  CustomIconButton,
  DescriptionContainer,
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

  const HeaderControls = () => (
    <>
      <ControlButtons
        variant="contained"
        color="error"
        startIcon={<BackIcon size={20} />}
        sx={{ display: { xs: "none", sm: "inline-flex" } }}
        onClick={handleBack}
      >
        Back
      </ControlButtons>
      <ControlButtons
        variant="contained"
        startIcon={<AddIcon size={20} />}
        onClick={() => {
          append({ from: "", to: "", size: null });
        }}
      >
        Add
      </ControlButtons>
      <ControlButtons
        variant="contained"
        startIcon={<SaveIcon size={20} />}
        onClick={handleSubmit(handleSubmitForm)}
      >
        Save
      </ControlButtons>
    </>
  );

  return (
    <ModuleContainer
      headerText="Add Bucket Simulation"
      handleBack={handleBack}
      headerControls={<HeaderControls />}
    >
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
                      children={<UpIcon size={20} />}
                    />
                  </CustomCellButton>
                ) : (
                  <CustomCellButton />
                )}

                {index !== fields.length - 1 ? (
                  <CustomCellButton>
                    <CustomIconButton
                      size="small"
                      onClick={() => swap(index, index + 1)}
                      children={<DownIcon size={20} />}
                    />
                  </CustomCellButton>
                ) : (
                  <CustomCellButton />
                )}

                <CustomCellButton>
                  <CustomIconButton
                    size="small"
                    color="error"
                    onClick={() => remove(index)}
                    children={<RemoveIcon size={20} />}
                  />
                </CustomCellButton>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Element>
      </Table.Container>
    </ModuleContainer>
  );
};

export default BucketSimAdd;
