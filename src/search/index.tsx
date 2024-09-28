import {
  Box,
  Grid2 as Grid,
  Paper,
  Rating,
  styled,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";

import {
  Button,
  ControlledField,
  ControlledMultiSelect,
  ControlledSelect,
  GlobalLoaderContext,
  ModuleContainer,
  OptionsKeyedProps,
  Quality,
  RewatchIndicator,
  Table,
} from "@components";

import { Codecs, Data } from "./types";
import { useForm } from "react-hook-form";

import {
  ColumnDropDownOptions,
  defaultValues,
  Form,
  OrderDropDownOptions,
  resolver,
  SearchDropDownOptions,
} from "./validation";

const sampleCodecData: Codecs = {
  audio: [
    {
      id: "35aec409-de76-489f-a48b-284367b4c423",
      codec: "Codec 1",
    },
    {
      id: "ce7e2467-0708-410e-8b9e-75052a6d3733",
      codec: "Codec 2",
    },
    {
      id: "e819f06b-c3a7-426a-a490-11801a5976cf",
      codec: "Codec 3",
    },
  ],
  video: [
    {
      id: "7dc98c43-654c-43aa-a32d-6eefc58c3df0",
      codec: "Vid Codec 1",
    },
    {
      id: "8490fb5a-6be8-462a-9f2d-89d05ca384a6",
      codec: "Vid Codec 2",
    },
  ],
};

const CustomTableRow = styled(Table.Row)({
  cursor: "pointer",
});

const StyledRating = styled(Rating)(({ value }) => ({
  "& .MuiRating-iconFilled": {
    color: value
      ? value > 3.75
        ? "#28a745"
        : value > 3
        ? "#1e90ff"
        : "#e57373"
      : "",
  },
}));

const RatingIcon = styled(FontAwesomeSvgIcon)({
  marginRight: 2,
  fontSize: 14,
});

const Search = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState<Data>([]);
  const [audioCodecs, setAudioCodecs] = useState<OptionsKeyedProps>([]);
  const [videoCodecs, setVideoCodecs] = useState<OptionsKeyedProps>([]);

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  useEffect(() => {
    toggleLoader(true);

    setData([]);

    const audioCodecOptions: OptionsKeyedProps = sampleCodecData.audio.map(
      (item) => ({
        label: item.codec,
        key: item.id,
        value: item.id,
      }),
    );

    const videoCodecOptions: OptionsKeyedProps = sampleCodecData.video.map(
      (item) => ({
        label: item.codec,
        key: item.id,
        value: item.id,
      }),
    );

    setAudioCodecs(audioCodecOptions);
    setVideoCodecs(videoCodecOptions);

    toggleLoader(false);
  }, []);

  return (
    <ModuleContainer>
      {!isLoading && (
        <Grid container spacing={2}>
          <Grid size={4}>
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
                    <br />- Range: '2020 to 2021', 'summer 2020 to spring 2021',
                    '2020 summer to 2022'
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

              <Box
                component={Paper}
                elevation={3}
                width="100%"
                height="72px"
                p={2}
              >
                <Button variant="contained" fullWidth>
                  Search
                </Button>
              </Box>
            </Box>
          </Grid>
          <Grid size={8}>
            <Table.Container component={Paper}>
              <Table.Element>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell>Title</Table.Cell>
                    <Table.Cell sx={{ minWidth: 110 }}>E / O / S</Table.Cell>
                    <Table.Cell sx={{ minWidth: 115 }}>Filesize</Table.Cell>
                    <Table.Cell sx={{ minWidth: 190 }}>
                      Date Finished
                    </Table.Cell>
                    <Table.Cell sx={{ minWidth: 130 }}>Release</Table.Cell>
                    <Table.Cell>Encoder</Table.Cell>
                    {!isMobile && <Table.Cell>Rating</Table.Cell>}
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  {!isLoading ? (
                    data.map((item) => (
                      <CustomTableRow
                        hover
                        key={item.id}
                        onClick={() => route(`/search/view/${item.id}`)}
                      >
                        <Table.Cell>
                          <Quality quality={item.quality} />
                          {item.title}
                        </Table.Cell>
                        <Table.Cell>
                          {item.episodes} / {item.ovas} / {item.specials}
                        </Table.Cell>
                        <Table.Cell>{item.filesize}</Table.Cell>
                        <Table.Cell>
                          {item.dateFinished}
                          <RewatchIndicator show={item.rewatched} />
                        </Table.Cell>
                        <Table.Cell>{item.release}</Table.Cell>
                        <Table.Cell>
                          {item.encoder
                            ? item.encoder.replaceAll(" ", "\u00a0")
                            : ""}
                        </Table.Cell>

                        {!isMobile && (
                          <Table.Cell>
                            <Tooltip title={item.rating ?? "0"} placement="top">
                              <Box>
                                <StyledRating
                                  value={item.rating ? item.rating / 2 : 0}
                                  precision={0.25}
                                  icon={<RatingIcon icon={faHeart} />}
                                  emptyIcon={<RatingIcon icon={faHeartEmpty} />}
                                  readOnly
                                />
                              </Box>
                            </Tooltip>
                          </Table.Cell>
                        )}
                      </CustomTableRow>
                    ))
                  ) : (
                    <Table.Loader />
                  )}
                </Table.Body>
              </Table.Element>
            </Table.Container>
          </Grid>
        </Grid>
      )}
    </ModuleContainer>
  );
};

export default Search;
