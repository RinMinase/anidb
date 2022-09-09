import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import contrast from "font-color-contrast";

import {
  Box,
  Chip,
  Grid,
  IconContainerProps,
  Link,
  Rating,
  Stack,
  styled,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  faAngleRight as BulletIcon,
  faArrowLeftLong as BackIcon,
  faCloudArrowUp as UploadImageIcon,
  faHeart as TotalRatingFilledIcon,
  faLeaf as FallIcon,
  faPen as EditIcon,
  faSnowflake as WinterIcon,
  faStar as RatingFilledIcon,
  faSun as SummerIcon,
  faTrash as DeleteIcon,
  faTree as SpringIcon,
} from "@fortawesome/free-solid-svg-icons";

import { faHeart as TotalRatingEmptyIcon } from "@fortawesome/free-regular-svg-icons";

import { Button, GlobalLoaderContext, IconButton } from "@components";
import { FullData } from "./types";
import { route } from "preact-router";

type Props = {
  matches?: {
    id: string;
  };
};

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Header = styled(Typography)(({ theme }) => ({
  fontSize: 22,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  marginBottom: 8,
}));

const Icon = styled(FontAwesomeSvgIcon)({
  marginRight: 8,
});

const ImageBox = styled(Box)({
  position: "relative",
  height: 300,
  width: "100%",
  background: "#ccc",
});

const ImageBoxEdit = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 12,
  right: 12,

  height: 46,
  width: 46,

  "&:hover": {
    backgroundColor: theme.palette.warning.main,
  },
}));

const TotalStyledRating = styled(Rating)(({ value }) => ({
  "& .MuiRating-iconFilled": {
    color: value
      ? value > 3.75
        ? "#28a745"
        : value > 3
        ? "#1e90ff"
        : "#e57373"
      : "",
  },
}));

const StyledRating = styled(Rating)(({ theme, value }) => ({
  "& .MuiRating-iconFilled:not(.MuiRating-iconHover) svg": {
    color: value
      ? value >= 8
        ? "#28a745 !important"
        : value >= 6
        ? "#1e90ff !important"
        : "#e57373 !important"
      : "",
  },
  "& .MuiRating-iconEmpty svg": {
    color: theme.palette.action.disabled,
  },
}));

const TotalRatingIcon = styled(FontAwesomeSvgIcon)({
  marginRight: 2,
  fontSize: 28,
});

const RatingIcon = styled(FontAwesomeSvgIcon)({
  marginRight: 2,
  fontSize: 18,
});

const IconWinter = () => <Icon icon={WinterIcon} color="#87ceeb" />;
const IconSpring = () => <Icon icon={SpringIcon} color="#008000" />;
const IconSummer = () => <Icon icon={SummerIcon} color="#ffa726" />;
const IconFall = () => <Icon icon={FallIcon} color="#ff5722" />;

const IconRateLow = () => (
  <RatingIcon icon={RatingFilledIcon} color="#e57373" />
);
const IconRateNormal = () => (
  <RatingIcon icon={RatingFilledIcon} color="#1e90ff" />
);
const IconRateHigh = () => (
  <RatingIcon icon={RatingFilledIcon} color="#28a745" />
);

const RatingIconContainer = (props: IconContainerProps) => {
  const { value, ...other } = props;

  return (
    <span {...other}>
      {value >= 8 ? (
        <IconRateHigh />
      ) : value >= 6 ? (
        <IconRateNormal />
      ) : (
        <IconRateLow />
      )}
    </span>
  );
};

const HomeView = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState<FullData>({});

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
        .catch((err) => console.error(err))
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
              <ImageBox>
                <ImageBoxEdit>
                  <FontAwesomeSvgIcon icon={UploadImageIcon} color="#fff" />
                </ImageBoxEdit>
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
