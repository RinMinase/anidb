import { Box, Grid2 as Grid, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";

import {
  Button,
  ControlledField,
  ControlledMultiSelect,
  ControlledSelect,
  OptionsKeyedProps,
} from "@components";

import { Codecs } from "../types";

import {
  ColumnDropDownOptions,
  defaultValues,
  Form,
  OrderDropDownOptions,
  resolver,
  SearchDropDownOptions,
} from "../validation";

type Props = {
  codecs: Codecs;
  handleSearch: (formData: Form) => void;
};

const SearchForm = (props: Props) => {
  const [audioCodecs, setAudioCodecs] = useState<OptionsKeyedProps>([]);
  const [videoCodecs, setVideoCodecs] = useState<OptionsKeyedProps>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    const audioCodecOptions: OptionsKeyedProps = props.codecs.audio.map(
      (item) => ({
        label: item.codec,
        key: item.id,
        value: item.id,
      }),
    );

    const videoCodecOptions: OptionsKeyedProps = props.codecs.video.map(
      (item) => ({
        label: item.codec,
        key: item.id,
        value: item.id,
      }),
    );

    setAudioCodecs(audioCodecOptions);
    setVideoCodecs(videoCodecOptions);
  }, [props.codecs]);

  return (
    <Box component={Paper}>
      <Typography variant="h6" p={2}>
        Search Parameters
      </Typography>

      <Grid
        container
        spacing={2.5}
        p={2}
        sx={{
          // 100vh - screen
          // 48px - navbar
          // 48px - main container top padding
          // 64px - search params heading height and margin
          // 72px - search button height and padding
          maxHeight: "calc(100vh - 48px - 48px - 64px - 72px)",
          overflowY: "auto",
        }}
      >
        {/* Search Fields */}

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="quality"
            label="Quality"
            size="small"
            control={control}
            error={!!errors.quality}
            helperText={errors.quality?.message}
            fullWidth
          />
          <Typography variant="caption">
            - Range or Comma separated values
            <br />- Common terms: 4K, UHD
            <br />- Vertical pixels: 1080, 1080p
            <br />- Range: 1080p to UHD
            <br />
            {`- Comparators: >= 1080p`}
          </Typography>
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="title"
            label="Title"
            size="small"
            control={control}
            error={!!errors.title}
            helperText={errors.title?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="date"
            label="Date"
            size="small"
            control={control}
            error={!!errors.date}
            helperText={errors.date?.message}
            fullWidth
          />
          <Typography variant="caption">
            {`- Date or date range: '{date}', '{date} to {date}', 'from {date} to {date}';`}
            <br />
            {`- Comparators: '> 2024-10-20', '>= 2024', 'gt 2024-10-20', 'gte 2024', 'greater than 2024-10', 'greater than or equal 2024-10-20'`}
          </Typography>
          <Typography variant="caption" fontStyle="italic">
            Example : 2024-10 to 2024-11
          </Typography>
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="filesize"
            label="Filesize"
            size="small"
            control={control}
            error={!!errors.filesize}
            helperText={errors.filesize?.message}
            fullWidth
          />
          <Typography variant="caption">
            - Common terms or byte value: '3 GB', 3000000000
            <br />
            {`- Comparators: '> 3 GB'`}
          </Typography>
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="episodes"
            label="Episodes"
            size="small"
            control={control}
            error={!!errors.episodes}
            helperText={errors.episodes?.message}
            fullWidth
          />
          <Typography variant="caption">
            - Absolute value: 3
            <br />- Range: 10 to 12
            <br />
            {`- Comparators > 12`}
          </Typography>
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="ovas"
            label="OVAs"
            size="small"
            control={control}
            error={!!errors.ovas}
            helperText={errors.ovas?.message}
            fullWidth
          />
          <Typography variant="caption">Similar to episodes</Typography>
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="specials"
            label="Specials"
            size="small"
            control={control}
            error={!!errors.specials}
            helperText={errors.specials?.message}
            fullWidth
          />
          <Typography variant="caption">Similar to episodes</Typography>
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="encoder"
            label="Encoder"
            size="small"
            control={control}
            error={!!errors.encoder}
            helperText={errors.encoder?.message}
            fullWidth
          />
          <Typography variant="caption">
            This searches / matches for all Video, Audio, Sub Encoders
          </Typography>
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="encoder_video"
            label="Video Encoder"
            size="small"
            control={control}
            error={!!errors.encoder_video}
            helperText={errors.encoder_video?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="encoder_audio"
            label="Audio Encoder"
            size="small"
            control={control}
            error={!!errors.encoder_audio}
            helperText={errors.encoder_audio?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="encoder_subs"
            label="Subtitles Encoder"
            size="small"
            control={control}
            error={!!errors.encoder_subs}
            helperText={errors.encoder_subs?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="release"
            label="Release"
            size="small"
            control={control}
            error={!!errors.release}
            helperText={errors.release?.message}
            fullWidth
          />
          <Typography variant="caption">
            - Absolute: spring, 2020, 'spring 2020'
            <br />- Range: '2020 to 2021', 'summer 2020 to spring 2021', '2020
            summer to 2022'
            <br />
            {`- Comparators: '> spring 2023'`}
          </Typography>
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="rating"
            label="Rating"
            size="small"
            control={control}
            error={!!errors.rating}
            helperText={errors.rating?.message}
            fullWidth
          />
          <Typography variant="caption">
            - Max value should be 10
            <br />- Absolute value: 3
            <br />- Range: 5 to 10
            <br />
            {`- Comparators < 7`}
          </Typography>
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledField
            name="remarks"
            label="Remarks"
            size="small"
            control={control}
            error={!!errors.remarks}
            helperText={errors.remarks?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledSelect
            name="has_remarks"
            label="Has Remarks?"
            size="small"
            options={SearchDropDownOptions}
            control={control}
            error={!!errors.has_remarks}
            helperText={errors.has_remarks?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledSelect
            name="has_image"
            label="Has an Image?"
            size="small"
            options={SearchDropDownOptions}
            control={control}
            error={!!errors.has_image}
            helperText={errors.has_image?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledSelect
            name="is_hdr"
            label="Is the content HDR?"
            size="small"
            options={SearchDropDownOptions}
            control={control}
            error={!!errors.is_hdr}
            helperText={errors.is_hdr?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledMultiSelect
            name="codec_video"
            label="Video Codecs"
            size="small"
            options={videoCodecs}
            control={control}
            error={!!errors.codec_video}
            helperText={errors.codec_video?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledMultiSelect
            name="codec_audio"
            label="Audio Codecs"
            size="small"
            options={audioCodecs}
            control={control}
            error={!!errors.codec_audio}
            helperText={errors.codec_audio?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledSelect
            name="column"
            label="Column to Order"
            size="small"
            options={ColumnDropDownOptions}
            control={control}
            error={!!errors.column}
            helperText={errors.column?.message}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledSelect
            name="order"
            label="Ordering of Column"
            size="small"
            options={OrderDropDownOptions}
            control={control}
            error={!!errors.order}
            helperText={errors.order?.message}
            fullWidth
          />
        </Grid>
        {/* End of Search Fields */}
      </Grid>

      <Box component={Paper} elevation={3} width="100%" height="72px" p={2}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit(props.handleSearch)}
        >
          Search
        </Button>
      </Box>
    </Box>
  );
};

export default SearchForm;
