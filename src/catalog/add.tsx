import { route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Save as SaveIcon } from "react-feather";
import { Button, Stack, styled } from "@mui/material";
import { toast } from "sonner";

import {
  ControlledField,
  ControlledSelect,
  GlobalLoaderContext,
  ModuleContainer,
  OptionsProps,
  Swal,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";
import { Catalogs, Priorities } from "./types";

type Props = {
  matches?: {
    id: string;
  };
};

const SaveButton = styled(Button)(({ theme }) => ({
  maxWidth: 150,

  [theme.breakpoints.down("sm")]: {
    maxWidth: "unset",
  },
}));

const CatalogAdd = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [catalogs, setCatalogs] = useState<OptionsProps>([]);
  const [priorities, setPriorities] = useState<OptionsProps>([]);

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const handleBack = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Any changes will not be saved",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) route("/catalogs");
  };

  const handleSubmitForm = async (formdata: Form) => {
    toggleLoader(true);

    try {
      if (props.matches?.id) {
        await axios.put(`/partials/${props.matches.id}`, formdata);
      } else {
        await axios.post("/partials", formdata);
      }

      toast.success("Success");
      route("/catalogs");
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleOnLoad = async () => {
    try {
      toggleLoader(true);

      const priorityAPI = await axios.get("/priorities");
      const rawPriorities: Priorities = priorityAPI.data.data;
      const priorityOptions: OptionsProps = rawPriorities.map((item) => ({
        key: item.id,
        value: item.id,
        label: item.priority,
      }));

      if (priorityOptions.length) {
        setPriorities(() => priorityOptions);

        const normalId = priorityOptions.findIndex((i) => i.label === "Normal");
        if (normalId >= 0) {
          setValue("id_priority", priorityOptions[normalId].value as number);
        }
      }

      const catalogsAPI = await axios.get("/catalogs");
      const rawCatalogs: Catalogs = catalogsAPI.data.data;
      const catalogOptions: OptionsProps = rawCatalogs.map((item) => ({
        key: item.uuid,
        value: item.uuid,
        label: `${item.season} ${item.year}`,
      }));

      setCatalogs(() => catalogOptions);

      if (props.matches?.id) {
        const { id } = props.matches;

        const partialsData = await axios.get(`/partials/${id}`);
        const { title, id_catalog, id_priority } = partialsData.data.data;

        setValue("title", title);
        setValue("id_catalog", id_catalog);
        setValue("id_priority", id_priority);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    handleOnLoad();
  }, []);

  return (
    <ModuleContainer
      handleBack={handleBack}
      headerText={
        props.matches?.id ? "Edit Partial Entry" : "Add Partial Entry"
      }
    >
      <Stack spacing={3} maxWidth={450}>
        <ControlledField
          name="title"
          label="Title"
          control={control}
          error={!!errors.title}
          helperText={errors.title?.message}
          disabled={isLoading}
        />

        <ControlledSelect
          name="id_catalog"
          label="Catalog"
          options={catalogs}
          control={control}
          error={!!errors.id_catalog}
          helperText={errors.id_catalog?.message}
          disabled={isLoading}
          displayEmpty
        />

        <ControlledSelect
          name="id_priority"
          label="Priority"
          options={priorities}
          control={control}
          error={!!errors.id_priority}
          helperText={errors.id_priority?.message}
          disabled={isLoading}
        />

        <SaveButton
          variant="contained"
          startIcon={<SaveIcon size={20} />}
          onClick={handleSubmit(handleSubmitForm)}
        >
          Save
        </SaveButton>
      </Stack>
    </ModuleContainer>
  );
};

export default CatalogAdd;
