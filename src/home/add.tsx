import { useContext, useEffect, useState } from "preact/hooks";
import { useLocation, useRoute } from "preact-iso";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { isEmpty } from "lodash-es";
import { ArrowLeft as BackIcon } from "react-feather";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

import { ErrorResponse } from "@components/types";

import {
  Button,
  ButtonLoading,
  Dialog,
  GlobalLoaderContext,
  ModuleContainer,
} from "@components";

import { defaultValues, Form, resolver } from "./validation";
import AddForm from "./components/AddForm";
import AutofillHelper from "./components/AutofillHelper";
import { AutofillProps } from "./types";

const HomeAdd = () => {
  const route = useRoute();
  const location = useLocation();

  const { toggleLoader, isLoading } = useContext(GlobalLoaderContext);

  const [isDropdownLoading, setDropdownLoading] = useState(false);
  const [hasEntryId, setHasEntryId] = useState(false);
  const [isSaveLoading, setSaveLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);

  const [autofillValues, setAutofillValues] = useState<AutofillProps>({});

  const {
    control,
    handleSubmit,
    getValues,
    setValue,
    reset,
    watch,
    trigger,
    setError,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  const watchFilesize = watch("filesize");

  const fetchEntryData = async () => {
    try {
      if (route.params.id) {
        toggleLoader(true);

        const { id } = route.params;
        const partialsData = await axios.get(`/entries/${id}`);

        const {
          idQuality,
          title,
          dateInitFinishedRaw,
          filesizeRaw,
          episodes,
          ovas,
          specials,
          seasonNumber,
          seasonFirstTitle,
          releaseSeason,
          releaseYear,
          variants,
          remarks,
          durationRaw,
          encoderVideo,
          encoderAudio,
          encoderSubs,
          idCodecVideo,
          idCodecAudio,
          codecHDR,
          prequel,
          sequel,
          // prequelTitle,
          // sequelTitle,
          genres,
          idWatcher,
        } = partialsData.data.data;

        let hrs = 0;
        let mins = 0;
        let secs = 0;
        const duration: number | undefined = durationRaw;

        if (duration) {
          hrs = Math.floor(duration / 3600);
          mins = Math.floor((duration % 3600) / 60);
          secs = (duration % 3600) % 60;
        }

        let prequel_value: any;
        if (prequel) {
          prequel_value = {
            id: prequel.id,
            label: prequel.title,
          };
        }

        let sequel_value: any;
        if (sequel) {
          sequel_value = {
            id: sequel.id,
            label: sequel.title,
          };
        }

        let season_first_title_value: any;
        if (seasonFirstTitle) {
          season_first_title_value = {
            id: seasonFirstTitle.id,
            label: seasonFirstTitle.title,
          };
        }

        const genre_ids = genres.length
          ? genres.map((genre: any) => genre.id)
          : [];

        reset({
          id_quality: idQuality,
          title,
          date_finished: new Date(dateInitFinishedRaw),
          filesize: filesizeRaw,

          episodes,
          ovas,
          specials,

          season_number: seasonNumber,
          season_first_title: season_first_title_value,
          season_first_title_id: seasonFirstTitle?.id || null,

          release_season: releaseSeason || "",
          release_year: releaseYear || "",

          variants,
          remarks,

          encoder_video: encoderVideo,
          encoder_audio: encoderAudio,
          encoder_subs: encoderSubs,

          prequel: prequel_value,
          prequel_id: prequel?.id || null,

          sequel: sequel_value,
          sequel_id: sequel?.id || null,

          id_codec_video: idCodecVideo || "",
          id_codec_audio: idCodecAudio || "",
          codec_hdr: !!codecHDR,

          duration_hrs: hrs,
          duration_mins: mins,
          duration_secs: secs,

          genres: genre_ids,
          id_watcher: idWatcher,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleBackSubmit = () => {
    if (route.params.id) {
      location.route(`/home/view/${route.params.id}`);
    } else {
      location.route("/home");
    }
  };

  const handleSubmitForm = async (formdata: Form) => {
    try {
      setSaveLoading(true);

      const { duration_hrs, duration_mins, duration_secs, genres, ...rest } =
        formdata;

      let duration = 0;
      if (duration_hrs) duration += duration_hrs * 3600;
      if (duration_mins) duration += duration_mins * 60;
      if (duration_secs) duration += duration_secs;

      const genre_ids = genres && genres.length ? genres.join(",") : "";

      const body = {
        ...rest,
        date_finished: format(formdata.date_finished, "yyyy-MM-dd"),
        codec_hdr: formdata.codec_hdr ? 1 : 0,
        genres: genre_ids,
        duration,
      };

      if (route.params.id) {
        await axios.put(`/entries/${route.params.id}`, body);
      } else {
        await axios.post("/entries", body);
      }

      toast.success("Success");

      if (route.params.id) {
        location.route(`/home/view/${route.params.id}`);
      } else {
        location.route("/home");
      }
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponse;

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
      setSaveLoading(false);
    }
  };

  const HeaderControls = () => (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<BackIcon size={20} />}
        sx={{
          display: { xs: "none", sm: "inline-flex" },
          minWidth: 120,
          marginLeft: 2,
        }}
        onClick={() => setDialogOpen(true)}
      >
        Back
      </Button>
      <ButtonLoading
        variant="contained"
        loading={isSaveLoading || isLoading}
        sx={{ minWidth: 120, marginLeft: 2 }}
        onClick={handleSubmit(handleSubmitForm)}
      >
        Save
      </ButtonLoading>
    </>
  );

  useEffect(() => {
    if (!isEmpty(autofillValues)) {
      setValue("episodes", autofillValues.episodes);
      setValue("encoder_video", autofillValues.encoderVideo);
      setValue("encoder_audio", autofillValues.encoderAudio);
      setValue("encoder_subs", autofillValues.encoderSub);
      setValue("filesize", autofillValues.filesize);
      setValue("duration_hrs", autofillValues.durationHr);
      setValue("duration_mins", autofillValues.durationMin);
      setValue("duration_secs", autofillValues.durationSec);
    }
  }, [autofillValues]);

  useEffect(() => {
    if (hasEntryId && !isDropdownLoading) {
      fetchEntryData();
    }
  }, [hasEntryId, isDropdownLoading]);

  useEffect(() => {
    if (route.params.id) {
      setHasEntryId(true);
    }
  }, []);

  return (
    <ModuleContainer
      headerText={route.params.id ? "Edit Entry" : "Add Entry"}
      handleBack={() => setDialogOpen(true)}
      headerControls={<HeaderControls />}
      largeGutter
    >
      <AddForm
        entryId={route.params.id || ""}
        control={control}
        getValues={getValues}
        setValue={setValue}
        trigger={trigger}
        errors={errors}
        setDropdownLoading={setDropdownLoading}
        watchFilesize={watchFilesize}
      />

      <AutofillHelper setAutofillValues={setAutofillValues} />

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

export default HomeAdd;
