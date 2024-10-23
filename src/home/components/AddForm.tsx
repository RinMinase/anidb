import axios from "axios";
import DebouncePromise from "awesome-debounce-promise";
import { isEmpty } from "lodash-es";
import { toast } from "sonner";

import {
  Dispatch,
  StateUpdater,
  useContext,
  useEffect,
  useState,
} from "preact/hooks";

import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";

import {
  FormGroup,
  FormHelperText,
  Grid2 as Grid,
  InputAdornment,
  Stack,
  styled,
} from "@mui/material";

import {
  ControlledAutocomplete,
  ControlledDatepicker,
  ControlledField,
  ControlledSelect,
  ControlledSwitch,
  GlobalLoaderContext,
  OptionsKeyedProps,
  parseNumberFilesizeToString,
  Swal,
} from "@components";

import { Form } from "../validation";
import { MalTitle, TitleObject, TitleObjects } from "../types";

type Props = {
  control: Control<Form>;
  getValues: UseFormGetValues<Form>;
  setValue: UseFormSetValue<Form>;
  errors: FieldErrors<Form>;
  setDropdownLoading: Dispatch<StateUpdater<boolean>>;
  entryId?: string;
  watchFilesize?: number;
};

type AutocompleteOptions = Array<{
  id: string;
  label: string;
}>;

const seasons = ["Winter", "Spring", "Summer", "Fall"];

const currYear = new Date().getFullYear();
const years = Array.from({ length: 25 }, (_, i) => ({
  label: `${currYear - i}`,
  key: `${currYear - i}`,
  value: currYear - i,
}));

const searchAPI = (id?: string, needle?: string) =>
  axios.get("/entries/titles", {
    params: {
      id: id === "" ? null : id,
      needle: needle === "" ? null : needle,
    },
  });

const titleSearchAPI = (title?: string) => axios.get(`/mal/${title}`);

const searchAPIDebounced = DebouncePromise(searchAPI, 250);
const titleSearchAPIDebounced = DebouncePromise(titleSearchAPI, 250);

const DurationContainer = styled(FormGroup)(({ theme }) => ({
  position: "relative",
  border: "1px solid",
  borderColor: theme.palette.action.disabled,
  paddingTop: 15,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: 4,
  borderRadius: 6,

  "& .MuiOutlinedInput-input": {
    paddingTop: 6,
    paddingBottom: 6,
  },

  "& .MuiOutlinedInput-notchedOutline legend": {
    display: "none",
  },
}));

const DurationLabel = styled("span")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  transform: `translate(6px, -13px) scale(0.75)`,
  /* @ts-expect-error Seems to error on typescript as of now (react-hook-form@7.52.1) */
  backgroundColor: theme.palette.background.default,
  paddingLeft: 4,
  paddingRight: 8,
}));

const AddForm = (props: Props) => {
  const { control, errors } = props;

  const [qualities, setQualities] = useState<OptionsKeyedProps>([]);
  const [audioCodecs, setAudioCodecs] = useState<OptionsKeyedProps>([]);
  const [videoCodecs, setVideoCodecs] = useState<OptionsKeyedProps>([]);
  const [groups, setGroups] = useState<Array<string>>([]);

  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [prequels, setPrequels] = useState<AutocompleteOptions>([]);
  const [sequels, setSequels] = useState<AutocompleteOptions>([]);
  const [titlesFirstSeason, setTitlesFirstSeason] =
    useState<AutocompleteOptions>([]);

  const [acLoading, setACLoading] = useState({
    prequel: false,
    sequel: false,
    firstTitle: false,
  });

  const [titleLoading, setTitleLoading] = useState(false);
  const [titleSearch, setTitleSearch] = useState<Array<string>>([]);
  const [titleObjects, setTitleObjects] = useState<TitleObjects>([]);
  const [filesizeAdornment, setFilesizeAdornment] = useState<string>();

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

    const newAudioCodecs = audio.map((item: { id: number; codec: string }) => ({
      label: item.codec,
      key: `acodec-${item.id}`,
      value: `${item.id}`,
    }));

    const newVideoCodecs = video.map((item: { id: number; codec: string }) => ({
      label: item.codec,
      key: `acodec-${item.id}`,
      value: `${item.id}`,
    }));

    setAudioCodecs(newAudioCodecs);
    setVideoCodecs(newVideoCodecs);
  };

  const fetchGroups = async () => {
    const {
      data: { data },
    } = await axios.get("/groups/names");

    setGroups([...data]);
  };

  const fetchRelations = async () => {
    const {
      data: { data },
    } = await searchAPI(props.entryId);

    const values = data.map((data: TitleObject) => ({
      id: data.id,
      label: data.title,
    }));

    setPrequels(structuredClone(values));
    setSequels(structuredClone(values));
    setTitlesFirstSeason(structuredClone(values));
  };

  const fetchData = async () => {
    try {
      toggleLoader(true);
      props.setDropdownLoading(true);

      await Promise.all([
        fetchRelations(),
        fetchGroups(),
        fetchQualities(),
        fetchCodecs(),
      ]);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      if (!props.entryId) {
        toggleLoader(false);
      }

      props.setDropdownLoading(false);
    }
  };

  const handleSearchTitle = async (e: any) => {
    const element = e.target as HTMLInputElement;
    const val = element.value;

    setTitleLoading(true);
    setTitleObjects([]);
    setTitleSearch([]);

    const { data } = await titleSearchAPIDebounced(val);

    const titles = data.map((item: TitleObject) => item.title);

    setTitleSearch(titles);
    setTitleObjects(data);
  };

  const setAutofillTitleValues = (premiered: string, episodes: number) => {
    props.setValue("episodes", episodes);

    if (premiered) {
      const [season, year] = premiered.split(" ");

      props.setValue("release_season", season);
      props.setValue("release_year", year);
    }
  };

  const handleClickTitle = async () => {
    toggleLoader(true);

    try {
      const title = props.getValues("title");
      const obj = titleObjects.find((item) => item.title === title);

      if (!isEmpty(obj)) {
        const { data }: { data: MalTitle } = await axios.get(`mal/${obj.id}`);
        const { premiered, episodes } = data;

        const {
          episodes: cEpisodes,
          release_season: cSeason,
          release_year: cYear,
        } = props.getValues();

        if (cEpisodes || cSeason || cYear) {
          const result = await Swal.fire({
            title: "Override?",
            text: "Override existing 'Episodes', 'Release Season' and 'Release Year'?",
            icon: "question",
            showCancelButton: true,
          });

          if (result.isConfirmed) {
            setAutofillTitleValues(premiered, episodes);
          }
        } else {
          setAutofillTitleValues(premiered, episodes);
        }
      }
    } finally {
      toggleLoader(false);
    }
  };

  const handleChange = async (
    e: any,
    type: "prequel" | "sequel" | "firstTitle",
  ) => {
    const element = e.target as HTMLInputElement;
    const val = element.value;

    if (type === "prequel") setPrequels([]);
    if (type === "sequel") setSequels([]);
    if (type === "firstTitle") setTitlesFirstSeason([]);

    if (type === "prequel") setACLoading((p) => ({ ...p, prequel: true }));
    if (type === "sequel") setACLoading((p) => ({ ...p, sequel: true }));
    if (type === "firstTitle")
      setACLoading((p) => ({ ...p, firstTitle: true }));

    const {
      data: { data },
    } = await searchAPIDebounced(props.entryId, val);

    const values = data.map((data: TitleObject) => ({
      id: data.id,
      label: data.title,
    }));

    if (type === "prequel") {
      setPrequels(structuredClone(values));
      setACLoading((prev) => ({ ...prev, prequel: false }));
    }

    if (type === "sequel") {
      setSequels(structuredClone(values));
      setACLoading((prev) => ({ ...prev, sequel: false }));
    }

    if (type === "firstTitle") {
      setTitlesFirstSeason(values);
      setACLoading((prev) => ({ ...prev, firstTitle: false }));
    }
  };

  const handleChangeInput = (
    e: any,
    data: any,
    type: "prequel" | "sequel" | "firstTitle",
  ) => {
    if (type === "prequel") {
      const item = prequels.find((i) => i.label === data);
      props.setValue("prequel_id", item?.id || undefined);
    }

    if (type === "sequel") {
      const item = sequels.find((i) => i.label === data);
      props.setValue("sequel_id", item?.id || undefined);
    }

    if (type === "firstTitle") {
      const item = titlesFirstSeason.find((i) => i.label === data);
      props.setValue("season_first_title_id", item?.id || undefined);
    }
  };

  useEffect(() => {
    setFilesizeAdornment(parseNumberFilesizeToString(props.watchFilesize ?? 0));
  }, [props.watchFilesize]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
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
      <Grid size={{ xs: 12, sm: 8, md: 9 }}>
        <ControlledAutocomplete
          name="title"
          label="Title"
          options={titleSearch}
          control={control}
          error={!!errors.title}
          helperText={errors.title?.message}
          disabled={isLoading}
          loadingContents={titleLoading}
          onChange={handleSearchTitle}
          extraOnChange={handleClickTitle}
          fullWidth
          freeSolo
        />
      </Grid>

      <Grid size={{ xs: 4, sm: 2 }}>
        <ControlledField
          name="episodes"
          label="Episodes"
          control={control}
          error={!!errors.episodes}
          helperText={errors.episodes?.message}
          disabled={isLoading}
          fullWidth
          numeric
        />
      </Grid>
      <Grid size={{ xs: 4, sm: 2 }}>
        <ControlledField
          name="ovas"
          label="OVAs"
          control={control}
          error={!!errors.ovas}
          helperText={errors.ovas?.message}
          disabled={isLoading}
          fullWidth
          numeric
        />
      </Grid>
      <Grid size={{ xs: 4, sm: 2 }}>
        <ControlledField
          name="specials"
          label="Specials"
          control={control}
          error={!!errors.specials}
          helperText={errors.specials?.message}
          disabled={isLoading}
          fullWidth
          numeric
        />
      </Grid>

      <Grid size={{ xs: 6, md: 3 }}>
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
      <Grid size={{ xs: 6, sm: 4, md: 3 }}>
        <ControlledField
          name="filesize"
          label="Filesize"
          control={control}
          error={!!errors.filesize}
          helperText={errors.filesize?.message}
          endAdornment={
            <InputAdornment position="end">{filesizeAdornment}</InputAdornment>
          }
          disabled={isLoading}
          fullWidth
          numeric
        />
      </Grid>

      <Grid size={{ xs: 4, sm: 2 }}>
        <ControlledField
          name="season_number"
          label="Season #"
          control={control}
          error={!!errors.season_number}
          helperText={errors.season_number?.message}
          disabled={isLoading}
          fullWidth
          numeric
        />
      </Grid>
      <Grid size={{ xs: 8, sm: 6, md: 4 }}>
        <ControlledAutocomplete
          name="season_first_title"
          label="First Season Title"
          options={titlesFirstSeason}
          control={control}
          error={!!errors.season_first_title}
          helperText={errors.season_first_title?.message}
          disabled={isLoading}
          loadingContents={acLoading.firstTitle}
          onChange={(e: any) => handleChange(e, "firstTitle")}
          extraOnInputChange={(e, data) =>
            handleChangeInput(e, data, "firstTitle")
          }
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 3 }}>
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
      <Grid size={{ xs: 6, sm: 3 }}>
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

      <Grid size={{ xs: 12, sm: 6, md: 5, lg: 4 }}>
        <DurationContainer>
          {/* @ts-expect-error Seems to error on typescript as of now (react-hook-form@7.52.1) */}
          <DurationLabel>Duration</DurationLabel>
          <Stack spacing={2} direction="row">
            <ControlledField
              name="duration_hrs"
              size="small"
              control={control}
              error={!!errors.duration_hrs}
              disabled={isLoading}
              maxLength={3}
              endAdornment={<InputAdornment position="end" children="hrs" />}
              outlinedInput
              fullWidth
              numeric
            />
            <ControlledField
              name="duration_mins"
              size="small"
              control={control}
              error={!!errors.duration_mins}
              disabled={isLoading}
              maxLength={2}
              endAdornment={<InputAdornment position="end" children="mins" />}
              outlinedInput
              fullWidth
              numeric
            />
            <ControlledField
              name="duration_secs"
              size="small"
              control={control}
              error={!!errors.duration_secs}
              disabled={isLoading}
              maxLength={2}
              endAdornment={<InputAdornment position="end" children="secs" />}
              outlinedInput
              fullWidth
              numeric
            />
          </Stack>
          {errors.duration_hrs && (
            <FormHelperText error>
              {errors.duration_hrs?.message}
            </FormHelperText>
          )}
          {errors.duration_mins && (
            <FormHelperText error>
              {errors.duration_mins?.message}
            </FormHelperText>
          )}
          {errors.duration_secs && (
            <FormHelperText error>
              {errors.duration_secs?.message}
            </FormHelperText>
          )}
        </DurationContainer>
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 3, lg: 4 }}>
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
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledAutocomplete
          name="prequel"
          label="Prequel"
          options={prequels}
          control={control}
          error={!!errors.prequel}
          helperText={errors.prequel?.message}
          disabled={isLoading}
          loadingContents={acLoading.prequel}
          onChange={(e: any) => handleChange(e, "prequel")}
          extraOnInputChange={(e, data) =>
            handleChangeInput(e, data, "prequel")
          }
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <ControlledAutocomplete
          name="sequel"
          label="Sequel"
          options={sequels}
          control={control}
          error={!!errors.sequel}
          helperText={errors.sequel?.message}
          disabled={isLoading}
          loadingContents={acLoading.sequel}
          onChange={(e: any) => handleChange(e, "sequel")}
          extraOnInputChange={(e, data) => handleChangeInput(e, data, "sequel")}
          fullWidth
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 4 }}>
        <ControlledAutocomplete
          name="encoder_video"
          label="Video Encoder"
          options={groups}
          control={control}
          error={!!errors.encoder_video}
          helperText={errors.encoder_video?.message}
          disabled={isLoading}
          fullWidth
          freeSolo
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <ControlledAutocomplete
          name="encoder_audio"
          label="Audio Encoder"
          options={groups}
          control={control}
          error={!!errors.encoder_audio}
          helperText={errors.encoder_audio?.message}
          disabled={isLoading}
          fullWidth
          freeSolo
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <ControlledAutocomplete
          name="encoder_subs"
          label="Subtitle Encoder"
          options={groups}
          control={control}
          error={!!errors.encoder_subs}
          helperText={errors.encoder_subs?.message}
          disabled={isLoading}
          fullWidth
          freeSolo
        />
      </Grid>

      <Grid size={{ xs: 6, sm: 4 }}>
        <ControlledSelect
          name="id_codec_video"
          label="Video Codec"
          options={videoCodecs}
          control={control}
          error={!!errors.id_codec_video}
          helperText={errors.id_codec_video?.message}
          disabled={isLoading}
          displayEmpty
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 6, sm: 5, md: 4 }}>
        <ControlledSelect
          name="id_codec_audio"
          label="Audio Codec"
          options={audioCodecs}
          control={control}
          error={!!errors.id_codec_audio}
          helperText={errors.id_codec_audio?.message}
          disabled={isLoading}
          displayEmpty
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 3, md: 2 }}>
        <ControlledSwitch name="codec_hdr" label="HDR" control={control} />
      </Grid>
    </Grid>
  );
};

export default AddForm;
