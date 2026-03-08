import { useContext, useEffect, useState } from "preact/hooks";
import { useLocation, useRoute } from "preact-iso";
import { toast } from "sonner";
import { format } from "date-fns";
import axios from "axios";

import {
  Box,
  Grid,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  X as UploadCancelIcon,
  Trash as UploadDeleteIcon,
  UploadCloud as UploadSaveIcon,
  Image as UploadSelectIcon,
} from "react-feather";

import {
  Button,
  ButtonLoading,
  Dialog,
  GlobalLoaderContext,
  ModuleContainer,
} from "@components";

import { Item } from "./types";

const BlankImage = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

const RecipeEditImage = () => {
  const route = useRoute();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Item>();
  const [defaultImageUrl, setDefaultImageUrl] = useState("");
  const [defaultImageUrlLg, setDefaultImageUrlLg] = useState("");

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);

  const [isDeleteDisabled, setDeleteDisabled] = useState(true);
  const [isImageDeleting, setImageDeleting] = useState(false);

  const fetchData = async () => {
    try {
      toggleLoader(true);

      const {
        data: { data },
      } = await axios.get(`/recipes/${route.params.id}`);

      setData(data);

      if (data.imageUrl) {
        setDefaultImageUrl(data.imageUrl);
        setDefaultImageUrlLg(data.imageUrlLg);
        setDeleteDisabled(false);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleChangeFile = (e: any) => {
    const element = e.target as HTMLInputElement;
    const { files } = element;

    if (files) {
      setDeleteDisabled(true);
      setImageFile(() => files[0]);

      const url = URL.createObjectURL(files[0]);
      setTempImage(url);
    }
  };

  const handleRemoveFile = () => {
    if (defaultImageUrl) {
      setDeleteDisabled(false);
    }

    setImageFile(() => null);

    URL.revokeObjectURL(tempImage);
    setTempImage("");
  };

  const handleUploadFile = async () => {
    if (imageFile) {
      try {
        setImageUploading(true);

        const body = new FormData();
        body.append("_method", "PUT");
        body.append("image", imageFile);

        await axios.post(`/recipes/img-upload/${route.params.id}`, body, {
          headers: {
            "Content-Type": "image/*",
          },
        });

        toast.success("Success");
        location.route(`/recipes/${route.params.id}`);
      } catch (err) {
        console.error(err);
        toast.error("Failed");
        setImageUploading(false);
      }
    }
  };

  const handleDeleteFile = async () => {
    try {
      setDeleteDialogOpen(false);
      setImageDeleting(true);

      await axios.delete(`/recipes/img-upload/${route.params.id}`);

      setTempImage(() => BlankImage);
      setDeleteDisabled(true);
      toast.success("Success");
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setImageDeleting(false);
    }
  };

  useEffect(() => {
    if (isDesktop) {
      fetchData();
    } else {
      location.route("/recipes");
    }
  }, []);

  if (isLoading || !data) return;

  return (
    <ModuleContainer
      handleBack={() => setDialogOpen(true)}
      headerText={`Editing image of ${data.title}`}
    >
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <Stack spacing={1.5}>
            <Box
              sx={{
                height: 256,
                width: "100%",
                background: "#ccc",
              }}
            >
              {(tempImage || defaultImageUrl) && (
                <Box
                  component="img"
                  alt=""
                  src={tempImage || defaultImageUrl}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              )}
            </Box>

            {!imageFile ? (
              <Button
                component="label"
                variant="contained"
                disabled={imageUploading || isImageDeleting}
                startIcon={<UploadSelectIcon color="#fff" />}
              >
                <span>Select Image</span>
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleChangeFile}
                />
              </Button>
            ) : (
              <Box display="flex" gap={1}>
                <ButtonLoading
                  fullWidth
                  variant="contained"
                  loading={imageUploading}
                  startIcon={<UploadSaveIcon color="#fff" />}
                  onClick={handleUploadFile}
                >
                  Save
                </ButtonLoading>
                <Button
                  fullWidth
                  variant="contained"
                  color="secondary"
                  disabled={imageUploading}
                  startIcon={<UploadCancelIcon color="#fff" />}
                  onClick={handleRemoveFile}
                >
                  Revert
                </Button>
              </Box>
            )}

            <ButtonLoading
              variant="contained"
              color="warning"
              startIcon={<UploadDeleteIcon color="#fff" />}
              loading={isImageDeleting}
              disabled={isDeleteDisabled || imageUploading}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Remove Image
            </ButtonLoading>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
          <Paper
            sx={{
              padding: "16px 24px 32px",
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6" width="100%">
              Preview
            </Typography>

            <Box width="100%">
              <Typography variant="body1">
                <span>Banner Image&nbsp;</span>
                <Typography variant="caption">(1152 x 300)</Typography>
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  maxWidth: 1152,
                  aspectRatio: "1152 / 300",
                  overflow: "hidden",
                  background: "#ccc",
                }}
              >
                {(tempImage || defaultImageUrlLg) && (
                  <Box
                    component="img"
                    alt=""
                    src={tempImage || defaultImageUrlLg}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                )}
              </Box>
            </Box>

            <Box display="flex" gap={6}>
              <Box>
                <Typography variant="body1">
                  <span>Thumbnail&nbsp;</span>
                  <Typography variant="caption">(256 x 256)</Typography>
                </Typography>
                <Box
                  sx={{
                    height: 256,
                    width: 256,
                    background: "#ccc",
                  }}
                >
                  {(tempImage || defaultImageUrl) && (
                    <Box
                      component="img"
                      alt=""
                      src={tempImage || defaultImageUrl}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
              </Box>
              <Box>
                <Typography variant="body1">
                  <span>Phone&nbsp;</span>
                  <Typography variant="caption">(380 x 200)</Typography>
                </Typography>
                <Box
                  sx={{
                    width: "100%",
                    maxWidth: 380,
                    aspectRatio: "380 / 200",
                    overflow: "hidden",
                    background: "#ccc",
                  }}
                >
                  {(tempImage || defaultImageUrlLg) && (
                    <Box
                      component="img"
                      alt=""
                      src={tempImage || defaultImageUrlLg}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </Box>
                <Box
                  sx={{
                    width: 380,
                    padding: "12px 8px 4px",
                    mt: "7px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                  }}
                >
                  <Typography variant="h4">{data.title}</Typography>
                  <Typography variant="body1" gutterBottom>
                    {data.description}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="caption">
                      Created:&nbsp;
                      {format(data.createdAt, "MMM d, yyyy HH:mm")}
                    </Typography>
                    <Typography variant="caption">
                      Last Updated:&nbsp;
                      {format(data.updatedAt, "MMM d, yyyy HH:mm")}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Dialog
        type="warning"
        title="Are you sure?"
        text="Any changes will not be saved."
        onSubmit={() => location.route(`/recipes/${route.params.id}`)}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />

      <Dialog
        type="warning"
        title="Are you sure?"
        text="This would delete the image from the database. As such, this action cannot be undone."
        onSubmit={handleDeleteFile}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </ModuleContainer>
  );
};

export default RecipeEditImage;
