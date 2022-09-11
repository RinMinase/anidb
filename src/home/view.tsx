import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import contrast from "font-color-contrast";

import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  faAngleRight as BulletIcon,
  faArrowLeftLong as BackIcon,
  faCheck as UploadSaveIcon,
  faCloudArrowUp as UploadImageIcon,
  faHeart as TotalRatingFilledIcon,
  faPen as EditIcon,
  faTrash as DeleteIcon,
  faXmark as UploadCancelIcon,
} from "@fortawesome/free-solid-svg-icons";

import { faHeart as TotalRatingEmptyIcon } from "@fortawesome/free-regular-svg-icons";

import { Alert, AlertProps, Button, GlobalLoaderContext } from "@components";
import { FullData } from "./types";

import {
  ModuleContainer,
  Header,
  Icon,
  ImageBox,
  Image,
  ImageLoader,
  ImageBoxEdit,
  ImageBoxSave,
  ImageBoxRemove,
  TotalStyledRating,
  StyledRating,
  TotalRatingIcon,
  IconWinter,
  IconSpring,
  IconSummer,
  IconFall,
  RatingIconContainer,
} from "./components/ViewComponents";

type Props = {
  matches?: {
    id: string;
  };
};

const HomeView = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [data, setData] = useState<FullData>({});

  const [image, setImage] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);

  const [dialog, setDialog] = useState<AlertProps>({ open: false });

  const renderTotalRating = () => (
    <Box textAlign="center">
      <TotalStyledRating
        value={data.ratingAverage ? data.ratingAverage / 2 : 0}
        precision={0.25}
        icon={<TotalRatingIcon icon={TotalRatingFilledIcon} />}
        emptyIcon={<TotalRatingIcon icon={TotalRatingEmptyIcon} />}
        readOnly
      />
      <Typography>Rating: {data.ratingAverage}</Typography>
    </Box>
  );

  const renderIndividualRatings = () => (
    <Stack spacing={1}>
      <Box textAlign="center">
        <Typography variant="subtitle2" gutterBottom>
          Audio
        </Typography>
        <StyledRating
          value={data.rating?.audio ?? 0}
          IconContainerComponent={RatingIconContainer}
          max={10}
        />
      </Box>
      <Box textAlign="center">
        <Typography variant="subtitle2" gutterBottom>
          Enjoyment
        </Typography>
        <StyledRating
          value={data.rating?.enjoyment ?? 0}
          IconContainerComponent={RatingIconContainer}
          max={10}
        />
      </Box>
      <Box textAlign="center">
        <Typography variant="subtitle2" gutterBottom>
          Graphics
        </Typography>
        <StyledRating
          value={data.rating?.graphics ?? 0}
          IconContainerComponent={RatingIconContainer}
          max={10}
        />
      </Box>
      <Box textAlign="center">
        <Typography variant="subtitle2" gutterBottom>
          Plot
        </Typography>
        <StyledRating
          value={data.rating?.plot ?? 0}
          IconContainerComponent={RatingIconContainer}
          max={10}
        />
      </Box>
    </Stack>
  );

  const handleChangeFile = (e: any) => {
    const element = e.target as HTMLInputElement;
    const { files } = element;

    if (files) {
      setImage(() => files[0]);

      const url = URL.createObjectURL(files[0]);
      setTempImage(url);
    }
  };

  const handleRemoveFile = () => {
    setImage(() => null);

    URL.revokeObjectURL(tempImage);
    setTempImage("");
  };

  const handleUploadFile = async () => {
    if (image) {
      try {
        setImageUploading(true);

        const body = new FormData();
        body.append("_method", "PUT");
        body.append("image", image);

        await axios.post(`/entries/img-upload/${props.matches?.id}`, body);

        setImageUploading(false);

        const {
          data: { data },
        } = await axios.get(`/entries/${props.matches?.id}`);

        handleRemoveFile();

        setData((prev) => ({
          ...prev,
          image: data.image,
        }));

        setDialog({
          open: true,
          message: "Success!",
          severity: "success",
        });
      } catch (err) {
        console.error(err);

        setDialog({
          open: true,
          message: "Failed",
          severity: "error",
        });
      }
    }
  };

  useEffect(() => {
    if (props.matches?.id) {
      toggleLoader(true);

      const { id } = props.matches;
      const getColor = (id?: number) => {
        if (id === 1) return "#f9c";
        if (id === 2) return "#9f9";
        if (id === 3) return "#9cf";
        if (id === 4) return "#fc6";
        return "#777";
      };

      axios
        .get(`/entries/${id}`)
        .then(({ data: { data } }) => {
          setData({
            ...data,
            quality_color: getColor(data.id_quality),
          });
        })
        .catch((err) => {
          console.error(err);

          if (err.response?.data?.message?.includes("ID is invalid")) {
            route("/home");
          }
        })
        .finally(() => toggleLoader(false));
    }
  }, [props.matches]);

  return (
    <ModuleContainer>
      {!isLoading && data.title && (
        <Grid container spacing={2.5}>
          <Grid item xs={12} sm={3}>
            <Grid container spacing={1.25}>
              <Grid item xs={4} sm={12}>
                <Button
                  variant="contained"
                  color="info"
                  startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
                  fullWidth
                  onClick={() => route("/home")}
                >
                  Back
                </Button>
              </Grid>
              <Grid item xs={4} sm={6}>
                <Button
                  variant="contained"
                  color="warning"
                  startIcon={<FontAwesomeSvgIcon icon={EditIcon} />}
                  fullWidth
                >
                  Edit
                </Button>
              </Grid>
              <Grid item xs={4} sm={6}>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<FontAwesomeSvgIcon icon={DeleteIcon} />}
                  fullWidth
                >
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={9}>
            <Stack
              spacing={1.5}
              sx={{ textAlign: { xs: "center", sm: "unset" } }}
            >
              <Box>
                <Chip
                  label={data.quality}
                  sx={{
                    backgroundColor: data.quality_color,
                    color: contrast(data.quality_color || "#fff"),
                  }}
                />
              </Box>
              <Typography variant="h5">{data.title}</Typography>
              {data.variants && isMobile && (
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  &#10077; {data.variants} &#10078;
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid item xs={12} sm={3}>
            <Stack
              spacing={3}
              sx={{ textAlign: { xs: "center", sm: "unset" } }}
            >
              <Alert
                open={dialog.open}
                onClose={() => setDialog({ open: false })}
              />
              <ImageBox>
                {imageUploading && (
                  <ImageLoader>
                    <CircularProgress />
                  </ImageLoader>
                )}

                {(tempImage || data.image) && (
                  <Image
                    component="img"
                    alt="entry image"
                    src={tempImage || data.image}
                  />
                )}

                {isDesktop && (
                  <ImageBoxEdit component="label" disabled={!!image}>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={handleChangeFile}
                    />
                    <FontAwesomeSvgIcon icon={UploadImageIcon} color="#fff" />
                  </ImageBoxEdit>
                )}

                {image && (
                  <>
                    <ImageBoxSave onClick={handleUploadFile}>
                      <FontAwesomeSvgIcon icon={UploadSaveIcon} color="#fff" />
                    </ImageBoxSave>
                    <ImageBoxRemove onClick={handleRemoveFile}>
                      <FontAwesomeSvgIcon
                        icon={UploadCancelIcon}
                        color="#fff"
                      />
                    </ImageBoxRemove>
                  </>
                )}
              </ImageBox>
              <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                <Button variant="contained" fullWidth>
                  Rewatches
                  <Chip
                    label={data.rewatches?.length || 0}
                    size="small"
                    color="info"
                    sx={{ ml: 2, cursor: "pointer" }}
                  />
                </Button>
              </Box>
              {renderTotalRating()}
              <Box sx={{ display: { xs: "none", sm: "inline-block" } }}>
                {renderIndividualRatings()}
              </Box>
            </Stack>
          </Grid>

          <Grid item xs={12} sm={9}>
            <Stack spacing={3}>
              <Stack
                spacing={1.5}
                sx={{ textAlign: { xs: "center", sm: "unset" } }}
              >
                {data.variants && !isMobile && (
                  <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                    &#10077; {data.variants} &#10078;
                  </Typography>
                )}
                {data.encoder && (
                  <Typography variant="h6">
                    &#12300;{data.encoder}&#12301;
                  </Typography>
                )}
                <Typography variant="body1">{data.filesize}</Typography>
                <Stack
                  direction="row"
                  spacing={1}
                  sx={{ justifyContent: { xs: "center", sm: "start" } }}
                >
                  {data.codecHDR ? (
                    <Chip
                      label="HDR"
                      size="small"
                      sx={{
                        backgroundColor: "#fce257",
                        px: 1,
                        color: contrast("#fce257"),
                      }}
                    />
                  ) : null}
                  {data.codecVideo && (
                    <Chip
                      label={data.codecVideo}
                      size="small"
                      color="error"
                      sx={{ px: 1 }}
                    />
                  )}
                  {data.codecAudio && (
                    <Chip
                      label={data.codecAudio}
                      size="small"
                      color="info"
                      sx={{ px: 1 }}
                    />
                  )}
                </Stack>
              </Stack>

              <Box>
                <Header>Episode Information</Header>
                <Stack spacing={1}>
                  <Typography variant="body1">
                    Episodes: {data.episodes}
                  </Typography>
                  <Typography variant="body1">OVAs: {data.ovas}</Typography>
                  <Typography variant="body1">
                    Specials: {data.specials}
                  </Typography>
                </Stack>
              </Box>

              <Box>
                <Header>Series Information</Header>
                <Stack spacing={2}>
                  <Box>
                    {data.releaseSeason === "Winter" && <IconWinter />}
                    {data.releaseSeason === "Spring" && <IconSpring />}
                    {data.releaseSeason === "Summer" && <IconSummer />}
                    {data.releaseSeason === "Fall" && <IconFall />}
                    <Typography variant="body1" component="span">
                      {data.release}
                    </Typography>
                  </Box>

                  <Stack spacing={1}>
                    {data.prequel?.id && (
                      <Typography variant="body1">
                        <Typography component="span">Prequel: </Typography>
                        <Link href={`/home/view/${data.prequel.id}`}>
                          {data.prequel.title}
                        </Link>
                      </Typography>
                    )}
                    {data.sequel?.id && (
                      <Typography variant="body1">
                        <Typography component="span">Sequel: </Typography>
                        <Link href={`/home/view/${data.sequel.id}`}>
                          {data.sequel.title}
                        </Link>
                      </Typography>
                    )}
                    {data.offquels?.length ? (
                      <>
                        <Typography variant="body1">Offquels:</Typography>
                        <Box sx={{ pl: 2 }}>
                          {data.offquels.map((item) => (
                            <Typography variant="body1" key={item.id}>
                              <Icon icon={BulletIcon} />
                              <Link href={`/home/view/${item.id}`}>
                                {item.title}
                              </Link>
                            </Typography>
                          ))}
                        </Box>
                      </>
                    ) : null}
                  </Stack>

                  <Stack spacing={1}>
                    {data.rewatches?.length ? (
                      <>
                        <Typography variant="body1">
                          Initially Finished on: {data.dateInitFinished}
                        </Typography>
                        <Typography variant="body1">
                          Last Finished on: {data.dateLastFinished}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body1">
                        Finished on: {data.dateLastFinished}
                      </Typography>
                    )}
                    {data.duration && (
                      <Typography variant="body1">
                        Duration: {data.duration}
                      </Typography>
                    )}
                    {data.seasonFirstTitle && (
                      <Typography variant="body1">
                        Season #{data.seasonNumber} of {data.seasonFirstTitle}
                      </Typography>
                    )}
                  </Stack>

                  <Stack spacing={1}>
                    <Typography variant="body1">
                      Rewatches: {data.rewatches?.length || "None"}
                    </Typography>
                    {data.rewatches?.length ? (
                      <Box sx={{ pl: 2 }}>
                        {data.rewatches.map((item, index) => (
                          <Typography variant="body1" key={`rewatch-${index}`}>
                            <Icon icon={BulletIcon} />
                            {item}
                          </Typography>
                        ))}
                      </Box>
                    ) : null}
                    <Box sx={{ display: { xs: "inline-block", sm: "none" } }}>
                      <Button variant="contained">Edit Rewatches</Button>
                    </Box>
                  </Stack>
                </Stack>
              </Box>

              {isMobile && (
                <Box>
                  <Header>Rating Information</Header>
                  <Box sx={{ pt: 2 }}>
                    {renderTotalRating()}
                    {renderIndividualRatings()}
                  </Box>
                </Box>
              )}
            </Stack>
          </Grid>
        </Grid>
      )}
    </ModuleContainer>
  );
};

export default HomeView;
