import { route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { Stack } from "@mui/material";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import {
  ButtonLoading,
  ControlledField,
  ControlledSelect,
  Dialog,
  ErrorResponseType,
  GlobalLoaderContext,
  ModuleContainer,
  OptionsProps,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";
import { Catalogs, Priorities } from "./types";

type Props = {
  matches?: {
    id: string;
  };
  fromManage?: boolean;
};

const CatalogAdd = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [catalogs, setCatalogs] = useState<OptionsProps>([]);
  const [priorities, setPriorities] = useState<OptionsProps>([]);

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const fetchPriorities = async () => {
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
  };

  const fetchCatalogs = async () => {
    const catalogsAPI = await axios.get("/catalogs");
    const rawCatalogs: Catalogs = catalogsAPI.data.data;
    const catalogOptions: OptionsProps = rawCatalogs.map((item) => ({
      key: item.uuid,
      value: item.uuid,
      label: `${item.season} ${item.year}`,
    }));

    setCatalogs(() => catalogOptions);
  };

  const fetchData = async () => {
    try {
      toggleLoader(true);

      await Promise.all([fetchPriorities(), fetchCatalogs()]);

      if (props.matches?.id) {
        const { id } = props.matches;

        const partialsData = await axios.get(`/partials/${id}`);
        const { title, idCatalog, idPriority } = partialsData.data.data;

        setValue("title", title);
        setValue("id_catalog", idCatalog);
        setValue("id_priority", idPriority);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    try {
      setSubmitLoading(true);

      if (props.matches?.id) {
        await axios.put(`/partials/${props.matches.id}`, formdata);
      } else {
        await axios.post("/partials", formdata);
      }

      toast.success("Success");

      if (props.fromManage) {
        route("/catalogs/manage");
      } else {
        route("/catalogs");
      }
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

  const handleBackSubmit = () => {
    if (props.fromManage) {
      route("/catalogs/manage");
    } else {
      route("/catalogs");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer
      handleBack={() => setDialogOpen(true)}
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

        <ButtonLoading
          variant="contained"
          loading={isSubmitLoading || isLoading}
          onClick={handleSubmit(handleSubmitForm)}
        >
          Save
        </ButtonLoading>
      </Stack>

      <Dialog
        type="warning"
        title="Are you sure?"
        text="Any changes will not be saved."
        onSubmit={handleBackSubmit}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />
    </ModuleContainer>
  );
};

export default CatalogAdd;
