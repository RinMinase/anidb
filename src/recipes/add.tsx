import { useLocation, useRoute } from "preact-iso";
import { useContext, useEffect, useState } from "preact/hooks";
import { useFieldArray, useForm } from "react-hook-form";
import { Stack } from "@mui/material";

import {
  ButtonLoading,
  ControlledField,
  Dialog,
  ErrorResponseType,
  GlobalLoaderContext,
  ModuleContainer,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";
import IngredientsForm from "./components/IngredientsForm";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import InstructionsHelperForm from "./components/InstructionsHelperForm";

const RecipeAdd = () => {
  const route = useRoute();
  const location = useLocation();

  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isSubmitLoading, setSubmitLoading] = useState(false);

  const {
    control,
    setValue,
    getValues,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ingredients",
  });

  const fetchData = async () => {
    try {
      toggleLoader(true);

      const {
        data: { data },
      } = await axios.get(`/recipes/${route.params.id}`);

      const ingredients = data.ingredients
        ? data.ingredients.map((item: string) => ({ value: item }))
        : [];

      setValue("title", data.title);
      setValue("description", data.description);
      setValue("ingredients", ingredients);
      setValue("instructions", data.instructions);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    try {
      const formatted = {
        ...formdata,
        ingredients: formdata.ingredients
          ? formdata.ingredients.map((i) => i.value)
          : [],
      };

      if (route.params.id) {
        await axios.put(`/recipes/${route.params.id}`, formatted);
      } else {
        await axios.post("/recipes", formatted);
      }

      toast.success("Success");
      location.route("/recipes");
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponseType;

        for (const key in data) {
          setError(key as any, {
            type: "manual",
            message: data[key].length ? data[key][0] : "Unknown error.",
          });
        }

        toast.error("Form validation failed");
      } else {
        console.error(err);
        toast.error("Failed");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    if (route.params.id) {
      fetchData();
    }
  }, []);

  return (
    <ModuleContainer
      handleBack={() => setDialogOpen(true)}
      headerText={route.params.id ? "Edit Recipe" : "Add Recipe"}
    >
      <Stack spacing={3}>
        <ControlledField
          name="title"
          label="Title"
          control={control}
          error={!!errors.title}
          helperText={errors.title?.message}
          disabled={isLoading}
        />

        <ControlledField
          name="description"
          label="Description"
          control={control}
          error={!!errors.description}
          helperText={errors.description?.message}
          disabled={isLoading}
        />

        <IngredientsForm fields={fields} append={append} remove={remove} />

        <InstructionsHelperForm
          isLoading={isLoading}
          control={control}
          errors={errors}
          setValue={setValue}
          getValues={getValues}
        />

        <ButtonLoading
          fullWidth
          variant="contained"
          loading={isSubmitLoading || isLoading}
          onClick={handleSubmit(handleSubmitForm)}
          sx={{ maxWidth: 400 }}
        >
          Save
        </ButtonLoading>
      </Stack>

      <Dialog
        type="warning"
        title="Are you sure?"
        text="Any changes will not be saved."
        onSubmit={() => location.route("/recipes")}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />
    </ModuleContainer>
  );
};

export default RecipeAdd;
