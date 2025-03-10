import { toast } from "sonner";
import { isEmpty } from "lodash-es";
import { Grid2 as Grid, InputAdornment } from "@mui/material";
import axios from "axios";
import DebouncePromise from "awesome-debounce-promise";

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
  UseFormTrigger,
} from "react-hook-form";

import {
  ControlledAutocomplete,
  ControlledDatepicker,
  ControlledField,
  ControlledMultiSelect,
  ControlledSelect,
  ControlledSwitch,
  Dialog,
  GlobalLoaderContext,
  OptionsKeyedProps,
  parseNumberFilesizeToString,
} from "@components";

import { Form } from "../validation";
import {
  AnilistTitle,
  DropdownsApiResponse,
  TitleObject,
  TitleObjects,
} from "../types";
import AddFormAutocomplete from "./AddFormAutocomplete";
import AddFormDuration from "./AddFormDuration";

type Props = {
  control: Control<Form>;
  getValues: UseFormGetValues<Form>;
  setValue: UseFormSetValue<Form>;
  trigger: UseFormTrigger<Form>;
  errors: FieldErrors<Form>;
  setDropdownLoading: Dispatch<StateUpdater<boolean>>;
  entryId?: string;
  watchFilesize?: number;
};

type AutocompleteOptions = Array<{
  id: string;
  label: string;
}>;

type AutofillAnilistType = {
  title?: string;
  premiered?: string;
  episodes?: number;
};

const seasons = ["Winter", "Spring", "Summer", "Fall"];

const currYear = new Date().getFullYear();
const earliestAcceptedYear = 1990;
const years = Array.from(
  { length: currYear - earliestAcceptedYear + 1 },
  (_, i) => ({
    label: `${currYear - i}`,
    key: `${currYear - i}`,
    value: currYear - i,
  }),
);

const searchAPI = (id?: string, needle?: string) =>
  axios.get("/entries/titles", {
    params: {
      id: id === "" ? null : id,
      needle: needle === "" ? null : needle,
    },
  });

const titleSearchAPI = (title?: string) =>
  axios.get("/anilist/search", {
    params: {
      query: title,
    },
  });

const titleSearchAPIDebounced = DebouncePromise(titleSearchAPI, 350);

const AddForm = (props: Props) => {
  const { control, errors } = props;

  const [qualities, setQualities] = useState<OptionsKeyedProps>([]);
  const [audioCodecs, setAudioCodecs] = useState<OptionsKeyedProps>([]);
  const [videoCodecs, setVideoCodecs] = useState<OptionsKeyedProps>([]);
  const [genres, setGenres] = useState<OptionsKeyedProps>([]);
  const [groups, setGroups] = useState<Array<string>>([]);
  const [watchers, setWatchers] = useState<OptionsKeyedProps>([]);

  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [initACOptions, setInitACOptions] = useState<AutocompleteOptions>([]);

  const [titleLoading, setTitleLoading] = useState(false);
  const [titleSearch, setTitleSearch] = useState<Array<string>>([]);
  const [titleObjects, setTitleObjects] = useState<TitleObjects>([]);
  const [filesizeAdornment, setFilesizeAdornment] = useState<string>();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [savedAutofill, setSavedAutofill] = useState<AutofillAnilistType>({});

  const fetchDropdowns = async () => {
    const {
      data: { data },
    } = (await axios.get("/dropdowns")) as DropdownsApiResponse;

    const newQualities = data.qualities.map((item) => ({
      label: item.quality,
      key: `quality-${item.id}`,
      value: item.id,
    }));

    const newAudioCodecs = data.codecs.audio.map(
      (item: { id: number; codec: string }) => ({
        label: item.codec,
        key: `acodec-${item.id}`,
        value: `${item.id}`,
      }),
    );

    const newVideoCodecs = data.codecs.video.map(
      (item: { id: number; codec: string }) => ({
        label: item.codec,
        key: `acodec-${item.id}`,
        value: `${item.id}`,
      }),
    );

    const newGenres = data.genres.map((item) => ({
      label: item.genre,
      key: `genre-${item.id}`,
      value: item.id,
    }));

    const newWatchers = data.watchers.map((item) => ({
      label: item.label,
      key: `watchers-${item.id}`,
      value: item.id,
    }));

    setGroups(data.groups);
    setQualities(newQualities);
    setAudioCodecs(newAudioCodecs);
    setVideoCodecs(newVideoCodecs);
    setGenres(newGenres);
    setWatchers(newWatchers);

    props.setValue("id_quality", "2");
  };

  const fetchRelations = async () => {
    const {
      data: { data },
    } = await searchAPI(props.entryId);

    const values = data.map((data: TitleObject) => ({
      id: data.id,
      label: data.title,
    }));

    setInitACOptions(structuredClone(values));
  };

  const fetchData = async () => {
    try {
      toggleLoader(true);
      props.setDropdownLoading(true);

      await Promise.all([fetchRelations(), fetchDropdowns()]);
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

    const {
      data: { data },
    } = await titleSearchAPIDebounced(val);

    const values = data.map((data: TitleObject) => ({
      id: data.id,
      label: data.title,
    }));

    setTitleSearch(values);
    setTitleObjects(data);
  };

  const setAutofillTitleValues = (values: AutofillAnilistType) => {
    if (values.title) props.setValue("title", values.title);
    props.trigger("title");

    if (values.episodes) props.setValue("episodes", values.episodes);

    if (values.premiered) {
      const [season, year] = values.premiered.split(" ");

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
        const {
          data: { data },
        } = await axios.get(`anilist/title/${obj.id}`);

        const { title, premiered, episodes } = data as AnilistTitle;

        const {
          episodes: cEpisodes,
          release_season: cSeason,
          release_year: cYear,
        } = props.getValues();

        if (cEpisodes || cSeason || cYear) {
          setSavedAutofill({ title, premiered, episodes });
          setDialogOpen(true);
        } else {
          setAutofillTitleValues({ title, premiered, episodes });
        }
      }
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    setFilesizeAdornment(parseNumberFilesizeToString(props.watchFilesize ?? 0));
  }, [props.watchFilesize]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Grid container spacing={2} sx={{ pb: 4 }}>
      <Grid size={{ xs: 12, sm: 4, md: 3 }}>
        <ControlledSelect
          name="id_quality"
          label="Quality"
          options={qualities}
          control={control}
          error={!!errors.id_quality}
          helperText={errors.id_quality?.message}
          disabled={isLoading}
          displayActualEmpty
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
        <AddFormAutocomplete
          entryId={props.entryId}
          name="season_first_title"
          actualIdFieldName="season_first_title_id"
          label="First Season Title"
          control={control}
          setValue={props.setValue}
          error={!!errors.season_first_title}
          helperText={errors.season_first_title?.message}
          disabled={isLoading}
          initialOptions={initACOptions}
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
          displayActualEmpty
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
          displayActualEmpty
          fullWidth
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 5, lg: 4 }}>
        <AddFormDuration
          control={control}
          errors={errors}
          disabled={isLoading}
        />
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
        <AddFormAutocomplete
          entryId={props.entryId}
          name="prequel"
          actualIdFieldName="prequel_id"
          label="Prequel"
          control={control}
          setValue={props.setValue}
          error={!!errors.prequel}
          helperText={errors.prequel?.message}
          disabled={isLoading}
          initialOptions={initACOptions}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <AddFormAutocomplete
          entryId={props.entryId}
          name="sequel"
          actualIdFieldName="sequel_id"
          label="Sequel"
          control={control}
          setValue={props.setValue}
          error={!!errors.sequel}
          helperText={errors.sequel?.message}
          disabled={isLoading}
          initialOptions={initACOptions}
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
          displayActualEmpty
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
          displayActualEmpty
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 3, md: 2 }}>
        <ControlledSwitch name="codec_hdr" label="HDR" control={control} />
      </Grid>

      <Grid size={{ xs: 12, sm: 8 }}>
        <ControlledMultiSelect
          name="genres"
          label="Genres"
          options={genres}
          control={control}
          error={!!errors.genres}
          helperText={errors.genres?.message}
          disabled={isLoading}
          fullWidth
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <ControlledSelect
          name="id_watcher"
          label="Who watched this?"
          options={watchers}
          control={control}
          error={!!errors.id_watcher}
          helperText={errors.id_watcher?.message}
          disabled={isLoading}
          displayActualEmpty
          fullWidth
        />
      </Grid>

      <Dialog
        type="info"
        title="Override?"
        text="Override existing 'Episodes', 'Release Season' and 'Release Year'?"
        onSubmit={() => {
          setDialogOpen(false);
          setAutofillTitleValues(savedAutofill);
        }}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />
    </Grid>
  );
};

export default AddForm;
