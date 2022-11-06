import { StateUpdater } from "preact/hooks";
import { DropzoneOptions, FileWithPath, useDropzone } from "react-dropzone";
import UAParser from "ua-parser-js";

import { Box, styled, Typography } from "@mui/material";

import { AutofillProps } from "../types";

const parser = new UAParser("user-agent");
const browser = parser.getBrowser().name;

type Props = {
  setAutofillValues: StateUpdater<AutofillProps>;
};

const DropzoneContainer = styled(Box)({
  border: "8px dashed #b3e5fc",
  margin: 12,
  padding: "24px 12px",
  textAlign: "center",
  userSelect: "none",
  cursor: "pointer",
});

const getPromiseFromEvent = (item: any, event: any): Promise<void> => {
  return new Promise((resolve) => {
    const listener = () => {
      item.removeEventListener(event, listener);
      resolve();
    };

    item.addEventListener(event, listener);
  });
};

const getTotalDuration = async (files: Array<File>): Promise<number> => {
  let duration = 0;

  for (const file of files) {
    const video = document.createElement("video");
    video.preload = "metadata";

    video.src = URL.createObjectURL(file);
    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
    };

    await getPromiseFromEvent(video, "loadedmetadata");

    duration += video.duration;
  }

  return duration;
};

const getTotalFilesize = (files: Array<FileWithPath>): number => {
  let filesize = 0;

  files.forEach((file) => {
    filesize += file.size;
  });

  return filesize;
};

const AutofillHelper = (props: Props) => {
  const handleDropFiles = async (files: Array<FileWithPath>) => {
    if (files.length) {
      const filesize = getTotalFilesize(files);
      const duration = Math.floor(await getTotalDuration(files));

      let hrs = 0;
      let mins = 0;
      let secs = 0;
      if (duration) {
        hrs = Math.floor(duration / 3600);
        mins = Math.floor((duration % 3600) / 60);
        secs = (duration % 3600) % 60;
      }

      let foldername = "";
      if (files[0].path?.charAt(0) === "/") {
        foldername = files[0].path.split("/", 2)[1];
      }

      let encoderVideo = "";
      let encoderAudio = "";
      let encoderSub = "";
      if (foldername) {
        const encFull = foldername.split("]", 1)[0].slice(1);
        const encSplit = encFull.split("-");

        encoderVideo = encSplit[0];

        if (encSplit.length === 3) {
          encoderAudio = encSplit[1];
          encoderSub = encSplit[2];
        } else if (encSplit.length === 2) {
          encoderAudio = encSplit[0];
          encoderSub = encSplit[1];
        } else if (encSplit.length === 1) {
          encoderAudio = encSplit[0];
          encoderSub = encSplit[0];
        }
      }

      props.setAutofillValues({
        encoderVideo,
        encoderAudio,
        encoderSub,
        filesize,
        episodes: files.length,
        durationHr: hrs,
        durationMin: mins,
        durationSec: secs,
      });
    }
  };

  const dzConfig: DropzoneOptions = {
    accept: {
      "video/mkv": [".mkv"],
    },
    multiple: true,
    onDropAccepted: handleDropFiles,
  };

  const { acceptedFiles, getRootProps, getInputProps } = useDropzone(dzConfig);

  if (browser === "Chrome" || browser === "Edge") {
    return (
      <Box>
        <DropzoneContainer {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {acceptedFiles.length ? (
            <Box>
              <Typography>Files Selected:</Typography>
              {acceptedFiles.map((file, index) => (
                <Typography key={`file-${index}`}>
                  &#11208; {file.name}
                </Typography>
              ))}
            </Box>
          ) : (
            <Typography>
              Drop some files here, or click to select files
            </Typography>
          )}
        </DropzoneContainer>
      </Box>
    );
  }
  return null;
};

export default AutofillHelper;
