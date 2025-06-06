import { Box, Grid, Paper, Typography } from "@mui/material";
import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import { ErrorResponse } from "@components/types";

import {
  ButtonLoading,
  ControlledField,
  ControlledMultiSelect,
  ControlledSelect,
  OptionsKeyedProps,
} from "@components";

import { Codecs, Data, EntryWatchers, Genres } from "../types";

import {
  ColumnDropDownOptions,
  defaultValues,
  Form,
  OrderDropDownOptions,
  resolver,
  SearchDropdownOptions,
} from "../validation";

type Props = {
  codecs: Codecs;
  genres: Genres;
  watchers: EntryWatchers;
  isSearchLoading: boolean;
  setTableLoader: Dispatch<StateUpdater<boolean>>;
  setData: Dispatch<StateUpdater<Data>>;
};

const staticWatcherOptions: OptionsKeyedProps = [
  { label: "Any", key: -1, value: "any" },
  { label: "Rin", key: 0, value: 0 },
];

const SearchForm = (props: Props) => {
  const [audioCodecs, setAudioCodecs] = useState<OptionsKeyedProps>([]);
  const [videoCodecs, setVideoCodecs] = useState<OptionsKeyedProps>([]);
  const [genres, setGenres] = useState<OptionsKeyedProps>([]);
  const [watchers, setWatchers] = useState<OptionsKeyedProps>([]);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  const handleSearch = async (formData: Form) => {
    try {
      props.setTableLoader(true);

      const { codec_video, codec_audio, genres, watcher, ...others } = formData;

      const query: any = { ...others };

      for (const key of Object.keys(query)) {
        if (query[key] === "") {
          delete query[key];
        }
      }

      const {
        data: { data },
      } = await axios.get("/entries/search", {
        params: {
          ...query,
          codec_video:
            codec_video && codec_video.length
              ? codec_video.join(",")
              : undefined,
          codec_audio:
            codec_audio && codec_audio.length
              ? codec_audio.join(",")
              : undefined,
          genres: genres && genres.length ? genres.join(",") : undefined,
          watcher: watcher === "any" || watcher === "" ? null : watcher,
        },
      });

      props.setData(data);
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponse;

        for (const key in data) {
          setError(key as any, {
            type: "manual",
            message: data[key].length ? data[key][0] : "Unknown error.",
          });
        }

        props.setData([]);
        toast.error("Form validation failed");
      } else {
        console.error(err);
        toast.error("Failed");
      }
    } finally {
      props.setTableLoader(false);
    }
  };

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

  useEffect(() => {
    const genreOptions: OptionsKeyedProps = props.genres.map((item) => ({
      label: item.genre,
      key: item.id,
      value: item.id,
    }));

    setGenres(genreOptions);
  }, [props.genres]);

  useEffect(() => {
    const watcherOptions: OptionsKeyedProps = props.watchers.map((item) => ({
      label: item.label,
      key: item.id,
      value: item.id,
    }));

    setWatchers([...staticWatcherOptions, ...watcherOptions]);
  }, [props.watchers]);

  return (
    <Box component={Paper}>
      <Typography variant="h6" p={2}>
        Search Parameters
      </Typography>

      <Grid
        container
        spacing={2.5}
        px={2}
        pb={2}
        pt={1}
        sx={{
          // 100vh - screen
          // 48px - navbar
          // 48px - main container top and bottom padding
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
            disabled={props.isSearchLoading}
            fullWidth
          />
          <Typography variant="caption">
            - Range or Comma separated values
            <br />- Common terms: 4K, UHD
            <br />- Vertical pixels: 1080, 1080p
            <br />- Range: 1080p to UHD
            <br />- Comparators: &gt;= 1080p
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
            fullWidth
          />
          <Typography variant="caption">
            - Common terms or byte value: '3 GB', 3000000000
            <br />- Comparators: '&gt; 3 GB'
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
            disabled={props.isSearchLoading}
            fullWidth
          />
          <Typography variant="caption">
            - Absolute value: 3
            <br />- Range: 10 to 12
            <br />- Comparators &gt; 12
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
            fullWidth
          />
          <Typography variant="caption">
            - Absolute: spring, 2020, 'spring 2020'
            <br />- Comma Separated: spring, 2020, fall 2021
            <br />- Range: '2020 to 2021', 'summer 2020 to spring 2021', '2020
            summer to 2022'
            <br />- Comparators: &gt; spring 2023'
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
            disabled={props.isSearchLoading}
            fullWidth
          />
          <Typography variant="caption">
            - Max value should be 5
            <br />- Absolute value: 3
            <br />- Range: 2 to 5
            <br />- Comparators &lt; 3
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
            disabled={props.isSearchLoading}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledSelect
            name="has_remarks"
            label="Has Remarks?"
            size="small"
            options={SearchDropdownOptions}
            control={control}
            error={!!errors.has_remarks}
            helperText={errors.has_remarks?.message}
            disabled={props.isSearchLoading}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledSelect
            name="has_image"
            label="Has an Image?"
            size="small"
            options={SearchDropdownOptions}
            control={control}
            error={!!errors.has_image}
            helperText={errors.has_image?.message}
            disabled={props.isSearchLoading}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledSelect
            name="is_hdr"
            label="Is the content HDR?"
            size="small"
            options={SearchDropdownOptions}
            control={control}
            error={!!errors.is_hdr}
            helperText={errors.is_hdr?.message}
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledMultiSelect
            name="genres"
            label="Genres"
            size="small"
            options={genres}
            control={control}
            error={!!errors.genres}
            helperText={errors.genres?.message}
            disabled={props.isSearchLoading}
            fullWidth
          />
        </Grid>

        <Grid container size={12} spacing={1}>
          <ControlledSelect
            name="watcher"
            label="Who watched this content"
            size="small"
            options={watchers}
            control={control}
            error={!!errors.watcher}
            helperText={errors.watcher?.message}
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
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
            disabled={props.isSearchLoading}
            fullWidth
          />
        </Grid>
        {/* End of Search Fields */}
      </Grid>

      <Box component={Paper} elevation={3} width="100%" height="72px" p={2}>
        <ButtonLoading
          variant="contained"
          fullWidth
          loading={props.isSearchLoading}
          onClick={handleSubmit(handleSearch)}
        >
          Search
        </ButtonLoading>
      </Box>
    </Box>
  );
};

export default SearchForm;
