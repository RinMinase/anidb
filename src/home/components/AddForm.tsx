import { useContext, useEffect, useState } from "preact/hooks";
import { Control, FieldErrorsImpl, UseFormSetValue } from "react-hook-form";
import axios from "axios";

import { Grid } from "@mui/material";

import {
  ControlledAutocomplete,
  ControlledDatepicker,
  ControlledField,
  ControlledSelect,
  ControlledSwitch,
  GlobalLoaderContext,
  OptionsKeyedProps,
} from "@components";

import { Form } from "../validation";

type Props = {
  control: Control<Form>;
  setValue: UseFormSetValue<Form>;
  errors: FieldErrorsImpl<Form>;
};

const seasons = ["Winter", "Spring", "Summer", "Fall"];

const currYear = new Date().getFullYear();
const years = Array.from({ length: 25 }, (_, i) => ({
  label: `${currYear - i}`,
  key: `${currYear - i}`,
  value: currYear - i,
}));

const titles = [
  {
    value: "1de",
    label: "one",
  },
  {
    value: "2ab",
    label: "two",
  },
  {
    value: "3cd",
    label: "three",
  },
];

const AddForm = (props: Props) => {
  const { control, errors } = props;

  const [qualities, setQualities] = useState<OptionsKeyedProps>([]);
  const [audioCodecs, setAudioCodecs] = useState<OptionsKeyedProps>([]);
  const [videoCodecs, setVideoCodecs] = useState<OptionsKeyedProps>([]);

  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const fetchQualities = async () => {
    const {
      data: { data },
    } = await axios.get("/qualities");

    setQualities(
      data.map((item: { quality: string; id: string }) => ({
        label: item.quality,
        key: `quality-${item.id}`,
        value: item.id,
      })),
    );

    props.setValue("id_quality", "2");
  };

  const fetchCodecs = async () => {
    const {
      data: {
        data: { audio, video },
      },
    } = await axios.get("/codecs");

    setAudioCodecs(
      audio.map((item: { id: number; codec: string }) => ({
        label: item.codec,
        key: `acodec-${item.id}`,
        value: `${item.id}`,
      })),
    );

    setVideoCodecs(
      video.map((item: { id: number; codec: string }) => ({
        label: item.codec,
        key: `acodec-${item.id}`,
        value: `${item.id}`,
      })),
    );
  };

  useEffect(() => {
    toggleLoader(true);

    fetchQualities().then(() => {
      fetchCodecs().then(() => toggleLoader(false));
    });
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={4} md={3}>
        <ControlledSelect
          name="id_quality"
          label="Quality"
          options={qualities}
          control={control}
          error={!!errors.id_quality}
          helperText={errors.id_quality?.message}
          disabled={isLoading}
          displayEmpty
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={8} md={9}>
        <ControlledField
          name="title"
          label="Title"
          control={control}
          error={!!errors.title}
          helperText={errors.title?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>

      <Grid item xs={4} sm={2}>
        <ControlledField
          name="episodes"
          label="Episodes"
          control={control}
          error={!!errors.episodes}
          helperText={errors.episodes?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>
      <Grid item xs={4} sm={2}>
        <ControlledField
          name="ovas"
          label="OVAs"
          control={control}
          error={!!errors.ovas}
          helperText={errors.ovas?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>
      <Grid item xs={4} sm={2}>
        <ControlledField
          name="specials"
          label="Specials"
          control={control}
          error={!!errors.specials}
          helperText={errors.specials?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>

      <Grid item xs={6} sm={3}>
        <ControlledDatepicker
          name="date_finished"
          label="Date Finished"
          control={control}
          error={!!errors.date_finished}
          helperText={errors.date_finished?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <ControlledField
          name="filesize"
          label="Filesize"
          control={control}
          error={!!errors.filesize}
          helperText={errors.filesize?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>

      <Grid item xs={4} sm={2}>
        <ControlledField
          name="season_number"
          label="Season #"
          control={control}
          error={!!errors.season_number}
          helperText={errors.season_number?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>
      <Grid item xs={8} sm={4}>
        <ControlledField
          name="season_first_title_id"
          label="First Season Title"
          control={control}
          error={!!errors.season_first_title_id}
          helperText={errors.season_first_title_id?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <ControlledSelect
          name="release_season"
          label="Release Season"
          options={seasons}
          control={control}
          error={!!errors.release_season}
          helperText={errors.release_season?.message}
          disabled={isLoading}
          displayEmpty
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={3}>
        <ControlledSelect
          name="release_year"
          label="Release Year"
          options={years}
          control={control}
          error={!!errors.release_year}
          helperText={errors.release_year?.message}
          disabled={isLoading}
          displayEmpty
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <ControlledField
          name="duration"
          label="Duration"
          control={control}
          error={!!errors.duration}
          helperText={errors.duration?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ControlledField
          name="variants"
          label="Variants"
          control={control}
          error={!!errors.variants}
          helperText={errors.variants?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ControlledField
          name="remarks"
          label="Remarks"
          control={control}
          error={!!errors.remarks}
          helperText={errors.remarks?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <ControlledAutocomplete
          name="prequel_id"
          label="Prequel"
          options={titles}
          control={control}
          error={!!errors.prequel_id}
          helperText={errors.prequel_id?.message}
          disabled={isLoading}
          fullWidth
          freeSolo
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ControlledAutocomplete
          name="sequel_id"
          label="Sequel"
          options={titles}
          control={control}
          error={!!errors.sequel_id}
          helperText={errors.sequel_id?.message}
          disabled={isLoading}
          fullWidth
          freeSolo
        />
      </Grid>

      <Grid item xs={12} sm={4}>
        <ControlledAutocomplete
          name="encoder_video"
          label="Video Encoder"
          options={titles}
          control={control}
          error={!!errors.encoder_video}
          helperText={errors.encoder_video?.message}
          disabled={isLoading}
          fullWidth
          freeSolo
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ControlledAutocomplete
          name="encoder_audio"
          label="Audio Encoder"
          options={titles}
          control={control}
          error={!!errors.encoder_audio}
          helperText={errors.encoder_audio?.message}
          disabled={isLoading}
          fullWidth
          freeSolo
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <ControlledAutocomplete
          name="encoder_subs"
          label="Subtitle Encoder"
          options={titles}
          control={control}
          error={!!errors.encoder_subs}
          helperText={errors.encoder_subs?.message}
          disabled={isLoading}
          fullWidth
          freeSolo
        />
      </Grid>

      <Grid item xs={6} sm={5}>
        <ControlledSelect
          name="codec_video"
          label="Video Codec"
          options={videoCodecs}
          control={control}
          error={!!errors.codec_video}
          helperText={errors.codec_video?.message}
          disabled={isLoading}
          displayEmpty
          fullWidth
        />
      </Grid>
      <Grid item xs={6} sm={5}>
        <ControlledSelect
          name="codec_audio"
          label="Audio Codec"
          options={audioCodecs}
          control={control}
          error={!!errors.codec_audio}
          helperText={errors.codec_audio?.message}
          disabled={isLoading}
          displayEmpty
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={2}>
        <ControlledSwitch name="hdr" label="HDR" control={control} />
      </Grid>
    </Grid>
  );
};

export default AddForm;
