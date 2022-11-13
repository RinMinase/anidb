import { useContext, useState } from "preact/hooks";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import { Box, Grid, Stack, styled, Typography } from "@mui/material";

import {
  faCloudArrowDown as ExportIcon,
  faCloudArrowUp as ImportIcon,
} from "@fortawesome/free-solid-svg-icons";

import { Button, GlobalLoaderContext, Swal } from "@components";

type Props = {
  reloadPageData: () => void;
};

const CustomGrid = styled(Grid)({
  borderLeft: "1px solid #ccc",
  paddingLeft: 24,
});

const DropzoneContainer = styled(Box)({
  border: "8px dashed #b3e5fc",
  margin: 12,
  padding: "24px 12px",
  textAlign: "center",
  userSelect: "none",
  cursor: "pointer",
});

const ImportContainer = styled(Stack)({
  marginTop: 24,
});

const ManagementSection = (props: Props) => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [uploading, setUploading] = useState(false);

  const dzConfig = {
    accept: {
      "application/json": [".json"],
    },
    maxFiles: 1,
  };

  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone(dzConfig);

  const handleImport = async () => {
    setUploading(true);

    const file = acceptedFiles[0];
    const body = new FormData();
    body.append("file", file);

    axios
      .post("/import", body, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then(({ data: { data } }) => {
        setUploading(false);

        Swal.fire({
          title: "Success!",
          html: `
            Accepted: ${data.acceptedImports}<br />
            JSON Entries: ${data.totalJsonEntries}
          `,
          icon: "success",
        }).then(() => props.reloadPageData());
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  };

  return (
    <Grid container>
      <Grid item md={8} textAlign="center">
        <DropzoneContainer {...getRootProps({ className: "dropzone" })}>
          <input {...getInputProps()} />
          {acceptedFiles.length ? (
            <Typography>File Selected: {acceptedFiles[0].name}</Typography>
          ) : (
            <Typography>
              Drop some files here, or click to select files
            </Typography>
          )}
        </DropzoneContainer>

        {fileRejections.length ? (
          <Typography
            component="p"
            variant="caption"
            color="error"
            gutterBottom
          >
            File is invalid
          </Typography>
        ) : null}

        <ImportContainer spacing={2} direction="row" justifyContent="center">
          <Button
            variant="contained"
            endIcon={<FontAwesomeSvgIcon icon={ImportIcon} />}
            disabled={!acceptedFiles.length || uploading}
            onClick={handleImport}
          >
            Import All Data
          </Button>

          <Button
            variant="contained"
            endIcon={<FontAwesomeSvgIcon icon={ImportIcon} />}
            disabled={!acceptedFiles.length || uploading}
            onClick={handleImport}
          >
            Import Groups
          </Button>
        </ImportContainer>
      </Grid>
      <CustomGrid item md={4}>
        <Button
          variant="contained"
          endIcon={<FontAwesomeSvgIcon icon={ExportIcon} />}
          disabled
          fullWidth
        >
          Export All Data
        </Button>
      </CustomGrid>
    </Grid>
  );
};

export default ManagementSection;
