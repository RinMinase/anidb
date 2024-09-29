import { route } from "preact-router";
import { useContext, useEffect } from "preact/hooks";
import { useForm } from "react-hook-form";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import axios from "axios";

import { Button, Grid, styled, useMediaQuery, useTheme } from "@mui/material";

import { faFloppyDisk as SaveIcon } from "@fortawesome/free-solid-svg-icons";

import {
  ControlledField,
  ControlledSelect,
  GlobalLoaderContext,
  ModuleContainer,
  Swal,
} from "@components";

import { defaultValues, Form, resolver } from "./validation-multi";
import { Data, Stats } from "./types";
import { queryParamsArrayToString } from "@components/functions";

type Props = {
  matches?: {
    id: string;
  };
};

const SaveButton = styled(Button)(({ theme }) => ({
  marginTop: 18,
  maxWidth: 250,

  [theme.breakpoints.down("sm")]: {
    maxWidth: "unset",
  },
}));

const currYear = new Date().getFullYear();
const years = Array.from({ length: 25 }, (_, i) => ({
  label: `${currYear - i}`,
  key: `${currYear - i}`,
  value: currYear - i,
}));

const CatalogMulti = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const nonMobile = useMediaQuery(theme.breakpoints.up("md"));

  const {
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({ defaultValues, resolver, mode: "onChange" });

  const handleBack = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Any changes will not be saved",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) route("/catalogs");
    });
  };

  const handleSubmitForm = async (formdata: Form) => {
    toggleLoader(true);
    try {
      const parsed_low = formdata.low.split("\n");
      const parsed_normal = formdata.normal.split("\n");
      const parsed_high = formdata.high.split("\n");

      const low = queryParamsArrayToString(parsed_low, "low");
      const normal = queryParamsArrayToString(parsed_normal, "normal");
      const high = queryParamsArrayToString(parsed_high, "high");

      const body = encodeURI(
        `${low}${normal ? `&${normal}` : ""}${high ? `&${high}` : ""}`,
      );

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

        await Swal.fire({
          title: "Success!",
          icon: "success",
          html: `
            Accepted: ${data.accepted}<br />
            JSON Entries: ${data.total}
          `,
        });
      }

      route("/catalogs");
    } catch (err) {
      console.error(err);
    } finally {
      toggleLoader(false);
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

  useEffect(() => {
    if (props.matches?.id) {
      toggleLoader(true);

      const { id } = props.matches;

      axios
        .get(`/catalogs/${id}/partials`)
        .then(({ data }) => {
          handleEditLoad(data.data, data.stats);
        })
        .catch((err) => console.error(err))
        .finally(() => toggleLoader(false));
    }
  }, []);

  return (
    <ModuleContainer
      handleBack={handleBack}
      headerText={
        props.matches?.id ? "Bulk Edit Partial Entry" : "Bulk Add Partial Entry"
      }
    >
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={4} md={3}>
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
        <Grid item xs={12} sm={4} md={3}>
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
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <ControlledField
            name="low"
            label="Low"
            control={control}
            error={!!errors.low}
            helperText={errors.low?.message}
            disabled={isLoading}
            minRows={nonMobile ? 15 : 8}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ControlledField
            name="normal"
            label="Normal"
            control={control}
            error={!!errors.normal}
            helperText={errors.normal?.message}
            disabled={isLoading}
            minRows={nonMobile ? 15 : 8}
            multiline
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ControlledField
            name="high"
            label="High"
            control={control}
            error={!!errors.high}
            helperText={errors.high?.message}
            disabled={isLoading}
            minRows={nonMobile ? 15 : 8}
            multiline
            fullWidth
          />
        </Grid>
      </Grid>

      <SaveButton
        variant="contained"
        startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
        onClick={handleSubmit(handleSubmitForm)}
        fullWidth
      >
        Save
      </SaveButton>
    </ModuleContainer>
  );
};

export default CatalogMulti;
