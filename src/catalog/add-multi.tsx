import axios, { AxiosError } from "axios";
import { route } from "preact-router";
import { useContext, useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Box, Grid2 as Grid, useMediaQuery, useTheme } from "@mui/material";

import {
  ButtonLoading,
  ControlledField,
  ControlledSelect,
  Dialog,
  ErrorResponseType,
  GlobalLoaderContext,
  ModuleContainer,
  queryParamsArrayToString,
} from "@components";

import { defaultValues, Form, resolver } from "./validation-multi";
import { Data, Stats } from "./types";

type Props = {
  matches?: {
    id: string;
  };
};

const currYear = new Date().getFullYear();
const years = Array.from({ length: 25 }, (_, i) => ({
  label: `${currYear - i}`,
  key: `${currYear - i}`,
  value: currYear - i,
}));

const CatalogMulti = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const theme = useTheme();
  const nonMobile = useMediaQuery(theme.breakpoints.up("md"));

  const {
    control,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const handleSubmitForm = async (formdata: Form) => {
    try {
      setSubmitLoading(true);

      const parsed_low = formdata.low.split("\n");
      const parsed_normal = formdata.normal.split("\n");
      const parsed_high = formdata.high.split("\n");

      const low = queryParamsArrayToString(parsed_low, "low");
      const normal = queryParamsArrayToString(parsed_normal, "normal");
      const high = queryParamsArrayToString(parsed_high, "high");
      const values = [low, normal, high].filter((n) => n).join("&");
      const body = encodeURI(values);

      let response;
      const formBody = new FormData();
      formBody.append("data", body);
      formBody.append("season", formdata.season);
      formBody.append("year", formdata.year);

      if (props.matches?.id) {
        formBody.append("_method", "PUT");

        response = await axios.post(
          `/partials/multi/${props.matches.id}`,
          formBody,
        );
      } else {
        response = await axios.post("/partials/multi", formBody);
      }

      if (response.data.data) {
        const { data } = response.data;

        toast.success("Success", {
          description: `Accepted: ${data.accepted}, Total: ${data.total}`,
        });
      }

      route("/catalogs");
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

  const handleEditLoad = (data: Data, stats: Stats) => {
    const formatted: { low: string[]; normal: string[]; high: string[] } = {
      low: [],
      normal: [],
      high: [],
    };

    data.forEach((item) => {
      if (item.priority === "Low") formatted.low?.push(item.title);
      if (item.priority === "Normal") formatted.normal?.push(item.title);
      if (item.priority === "High") formatted.high?.push(item.title);
    });

    setValue("year", `${stats.year}` || "");
    setValue("season", stats.season || "");
    setValue("low", formatted.low.join("\\n"));
    setValue("normal", formatted.normal.join("\\n"));
    setValue("high", formatted.high.join("\\n"));
  };

  const fetchData = async () => {
    try {
      toggleLoader(true);

      const { id } = props.matches!;
      const { data } = await axios.get(`/catalogs/${id}/partials`);

      handleEditLoad(data.data, data.stats);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    if (props.matches?.id) {
      fetchData();
    }
  }, []);

  return (
    <ModuleContainer
      handleBack={() => setDialogOpen(true)}
      headerText={
        props.matches?.id ? "Bulk Edit Partial Entry" : "Bulk Add Partial Entry"
      }
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <ControlledSelect
            name="season"
            label="Season"
            options={["Winter", "Spring", "Summer", "Fall"]}
            control={control}
            error={!!errors.season}
            helperText={errors.season?.message}
            disabled={isLoading}
            displayEmpty
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, md: 3 }}>
          <ControlledSelect
            name="year"
            label="Year"
            options={years}
            control={control}
            error={!!errors.year}
            helperText={errors.year?.message}
            disabled={isLoading}
            displayEmpty
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ pb: 7 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <ControlledField
            name="low"
            label="Low"
            control={control}
            error={!!errors.low}
            helperText={errors.low?.message}
            disabled={isLoading}
            minRows={nonMobile ? 15 : 8}
            maxRows={nonMobile ? 15 : 8}
            maxHeight={370}
            multiline
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ControlledField
            name="normal"
            label="Normal"
            control={control}
            error={!!errors.normal}
            helperText={errors.normal?.message}
            disabled={isLoading}
            minRows={nonMobile ? 15 : 8}
            maxRows={nonMobile ? 15 : 8}
            maxHeight={370}
            multiline
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <ControlledField
            name="high"
            label="High"
            control={control}
            error={!!errors.high}
            helperText={errors.high?.message}
            disabled={isLoading}
            minRows={nonMobile ? 15 : 8}
            maxRows={nonMobile ? 15 : 8}
            maxHeight={370}
            multiline
            fullWidth
          />
        </Grid>
      </Grid>

      <Box sx={{ textAlign: "right" }}>
        <ButtonLoading
          variant="contained"
          loading={isSubmitLoading || isLoading}
          onClick={handleSubmit(handleSubmitForm)}
          sx={{ minWidth: { xs: "100%", md: 250 } }}
        >
          Save
        </ButtonLoading>
      </Box>

      <Dialog
        type="warning"
        title="Are you sure?"
        text="Any changes will not be saved."
        onSubmit={() => route("/catalogs")}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />
    </ModuleContainer>
  );
};

export default CatalogMulti;
