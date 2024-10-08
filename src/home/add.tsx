import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { useForm } from "react-hook-form";
import axios from "axios";
import { format } from "date-fns";
import { isEmpty } from "lodash-es";
import { styled } from "@mui/material";
import { ArrowLeft as BackIcon, Save as SaveIcon } from "react-feather";
import { toast } from "sonner";

import {
  Button,
  GlobalLoaderContext,
  ModuleContainer,
  Swal,
} from "@components";
import { defaultValues, Form, resolver } from "./validation";

import AddForm from "./components/AddForm";
import AutofillHelper from "./components/AutofillHelper";
import { AutofillProps } from "./types";

type Props = {
  matches?: {
    id: string;
  };
};

const ControlButtons = styled(Button)(({ theme }) => ({
  minWidth: 120,
  marginLeft: 16,

  [theme.breakpoints.down("sm")]: {
    marginTop: 8,
  },
}));

const HomeAdd = (props: Props) => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [isDropdownLoading, setDropdownLoading] = useState(false);
  const [hasEntryId, setHasEntryId] = useState(false);

  const [autofillValues, setAutofillValues] = useState<AutofillProps>({});

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

  const fetchEntryData = async () => {
    try {
      if (props.matches?.id) {
        toggleLoader(true);

        const { id } = props.matches;
        const partialsData = await axios.get(`/entries/${id}`);

        const {
          id_quality,
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
          id_codec_video,
          id_codec_audio,
          codecHDR,
          prequelTitle,
          sequelTitle,
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

        reset({
          id_quality,
          title,
          date_finished: dateInitFinishedRaw,
          filesize: filesizeRaw,

          episodes,
          ovas,
          specials,

          season_number: seasonNumber,
          season_first_title_id: seasonFirstTitle,

          release_season: releaseSeason || "",
          release_year: releaseYear || "",

          variants,
          remarks,

          encoder_video: encoderVideo,
          encoder_audio: encoderAudio,
          encoder_subs: encoderSubs,

          prequel_title: prequelTitle || null,
          sequel_title: sequelTitle || null,

          id_codec_video: id_codec_video || "",
          id_codec_audio: id_codec_audio || "",
          codec_hdr: !!codecHDR,

          duration_hrs: hrs,
          duration_mins: mins,
          duration_secs: secs,
        });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleBack = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Any changes will not be saved",
      icon: "warning",
      showCancelButton: true,
    });

    if (result.isConfirmed) route("/home");
  };

  const handleSubmitForm = async (formdata: Form) => {
    toggleLoader(true);

    try {
      const { duration_hrs, duration_mins, duration_secs, ...rest } = formdata;

      let duration = 0;
      if (duration_hrs) duration += duration_hrs * 3600;
      if (duration_mins) duration += duration_mins * 60;
      if (duration_secs) duration += duration_secs;

      const body = {
        ...rest,
        date_finished: format(formdata.date_finished, "yyyy-MM-dd"),
        codec_hdr: formdata.codec_hdr ? 1 : 0,
        duration,
      };

      if (props.matches?.id) {
        await axios.put(`/entries/${props.matches.id}`, body);
      } else {
        await axios.post("/entries", body);
      }

      toast.success("Success");

      if (props.matches?.id) {
        route(`/home/view/${props.matches.id}`);
      } else {
        route("/home");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const HeaderControls = () => (
    <>
      <ControlButtons
        variant="contained"
        color="error"
        startIcon={<BackIcon size={20} />}
        sx={{ display: { xs: "none", sm: "inline-flex" } }}
        onClick={handleBack}
      >
        Back
      </ControlButtons>
      <ControlButtons
        variant="contained"
        startIcon={<SaveIcon size={20} />}
        onClick={handleSubmit(handleSubmitForm)}
      >
        Save
      </ControlButtons>
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
    if (props.matches?.id) {
      setHasEntryId(true);
    }
  }, []);

  return (
    <ModuleContainer
      headerText={props.matches?.id ? "Edit Entry" : "Add Entry"}
      handleBack={handleBack}
      headerControls={<HeaderControls />}
      largeGutter
    >
      <AddForm
        entryId={props.matches?.id || ""}
        control={control}
        getValues={getValues}
        setValue={setValue}
        errors={errors}
        setDropdownLoading={setDropdownLoading}
      />

      <AutofillHelper setAutofillValues={setAutofillValues} />
    </ModuleContainer>
  );
};

export default HomeAdd;
