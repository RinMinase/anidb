import { useContext, useState } from "preact/hooks";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { Box, Grid2 as Grid, Stack, styled, Typography } from "@mui/material";
import { toast } from "sonner";

import {
  DownloadCloud as ExportIcon,
  UploadCloud as ImportIcon,
} from "react-feather";

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
    try {
      setUploading(true);

      const file = acceptedFiles[0];
      const body = new FormData();
      body.append("file", file);

      const {
        data: { data },
      } = await axios.post("/import", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploading(false);

      toast.success("Success", {
        description: `Accepted: ${data.acceptedImports}, Total: ${data.totalJsonEntries}`,
      });

      props.reloadPageData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  return (
    <Grid container>
      <Grid size={{ md: 8 }} textAlign="center">
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
            component={"p" as any}
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
            endIcon={<ImportIcon size={20} />}
            disabled={!acceptedFiles.length || uploading}
            onClick={handleImport}
          >
            Import All Data
          </Button>

          <Button
            variant="contained"
            endIcon={<ImportIcon size={20} />}
            disabled={!acceptedFiles.length || uploading}
            onClick={handleImport}
          >
            Import Groups
          </Button>
        </ImportContainer>
      </Grid>
      <CustomGrid size={{ md: 4 }}>
        <Button
          variant="contained"
          endIcon={<ExportIcon size={20} />}
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
