import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import axios from "axios";

import { Box, styled, Typography } from "@mui/material";

import {
  faArrowLeftLong as BackIcon,
  faFloppyDisk as SaveIcon,
} from "@fortawesome/free-solid-svg-icons";

import { Button, GlobalLoaderContext } from "@components";
import { defaultValues, Form, resolver } from "./validation";

import AddForm from "./components/AddForm";
import { format } from "date-fns";

type Props = {
  matches?: {
    id: string;
  };
};

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Header = styled(Box)({
  display: "flex",
  marginBottom: 32,
});

const ControlButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
    alignItems: "unset",
  },
}));

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

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Form>({
    resolver,
    defaultValues,
    mode: "onChange",
  });

  const handleBack = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "Any changes will not be saved",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) route("/home");
    });
  };

  const handleSubmitForm = async (formdata: Form) => {
    toggleLoader(true);

    try {
      const body = {
        ...formdata,
        date_finished: format(formdata.date_finished, "yyyy-MM-dd"),
        codec_hdr: formdata.codec_hdr ? 1 : 0,
      };

      if (props.matches?.id) {
        await axios.put(`/entries/${props.matches.id}`, formdata);
      } else {
        await axios.post("/entries", body);
      }

      await Swal.fire({
        title: "Success!",
        icon: "success",
      });

      if (props.matches?.id) {
        route(`/home/view/${props.matches.id}`);
      } else {
        route("/home");
      }
    } catch (err) {
      console.error(err);
    } finally {
      toggleLoader(false);
    }
  };

  const fetchEntryData = async () => {
    if (props.matches?.id) {
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
        encoderVideo,
        encoderAudio,
        encoderSubs,
        id_codec_video,
        id_codec_audio,
        codecHDR,
      } = partialsData.data.data;

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

        release_season: releaseSeason,
        release_year: releaseYear,

        variants,
        remarks,

        encoder_video: encoderVideo,
        encoder_audio: encoderAudio,
        encoder_subs: encoderSubs,

        id_codec_video,
        id_codec_audio,
        codec_hdr: !!codecHDR,
      });
    }
  };

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
    <ModuleContainer>
      <Header>
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              width: 120,
              marginBottom: 2,
            }}
            onClick={handleBack}
          >
            Back
          </Button>
          <Typography variant="h5" alignItems="center">
            Add Entry
          </Typography>
        </Box>
        <ControlButtonsContainer>
          <ControlButtons
            variant="contained"
            color="error"
            startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
            onClick={handleBack}
          >
            Back
          </ControlButtons>
          <ControlButtons
            variant="contained"
            startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
            onClick={handleSubmit(handleSubmitForm)}
          >
            Save
          </ControlButtons>
        </ControlButtonsContainer>
      </Header>

      <AddForm
        control={control}
        setValue={setValue}
        errors={errors}
        setDropdownLoading={setDropdownLoading}
      />
    </ModuleContainer>
  );
};

export default HomeAdd;
