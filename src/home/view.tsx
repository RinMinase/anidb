import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import contrast from "font-color-contrast";

import {
  Box,
  Chip,
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
  faHeart as TotalRatingFilledIcon,
  faPen as EditIcon,
  faTrash as DeleteIcon,
} from "@fortawesome/free-solid-svg-icons";

import { faHeart as TotalRatingEmptyIcon } from "@fortawesome/free-regular-svg-icons";

import { Button, GlobalLoaderContext } from "@components";
import { FullData } from "./types";

import {
  ModuleContainer,
  Header,
  Icon,
  TotalStyledRating,
  StyledRating,
  TotalRatingIcon,
  IconWinter,
  IconSpring,
  IconSummer,
  IconFall,
  RatingIconContainer,
} from "./components/ViewComponents";

import ViewEntryImage from "./components/ViewEntryImage";
import ViewRewatchDialogue from "./components/ViewRewatchDialog";

type Props = {
  matches?: {
    id: string;
  };
};

const HomeView = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [rewatchDialog, setRewatchDialog] = useState(false);
  const [data, setData] = useState<FullData>({});
  const [ratings, setRatings] = useState({
    average: 0,
    audio: 0,
    enjoyment: 0,
    graphics: 0,
    plot: 0,
  });

  const handleChangeRating = async (type: string, value: number | null) => {
    const { audio, enjoyment, graphics, plot } = ratings;
    let total = 0;

    if (type === "audio") {
      total = (value || 0) + enjoyment + graphics + plot;
    } else if (type === "enjoyment") {
      total = (value || 0) + audio + graphics + plot;
    } else if (type === "graphics") {
      total = (value || 0) + audio + enjoyment + plot;
    } else if (type === "plot") {
      total = (value || 0) + audio + enjoyment + graphics;
    }

    const average = total / 4;

    setRatings((prev) => ({
      ...prev,
      average,
      [type]: value,
    }));

    await axios.put(`/entries/ratings/${props.matches?.id}`, {
      [type]: value,
    });
  };

  const renderTotalRating = () => (
    <Box textAlign="center">
      <TotalStyledRating
        value={ratings.average ? ratings.average / 2 : 0}
        precision={0.25}
        icon={<TotalRatingIcon icon={TotalRatingFilledIcon} />}
        emptyIcon={<TotalRatingIcon icon={TotalRatingEmptyIcon} />}
        readOnly
      />
      <Typography>Rating: {ratings.average}</Typography>
    </Box>
  );

  const renderIndividualRatings = () => (
    <Stack spacing={1}>
      <Box textAlign="center">
        <Typography variant="subtitle2" gutterBottom>
          Audio
        </Typography>
        <StyledRating
          value={ratings.audio}
          IconContainerComponent={RatingIconContainer}
          max={10}
          onChange={(e: any, value: number | null) => {
            handleChangeRating("audio", value);
          }}
        />
      </Box>
      <Box textAlign="center">
        <Typography variant="subtitle2" gutterBottom>
          Enjoyment
        </Typography>
        <StyledRating
          value={ratings.enjoyment}
          IconContainerComponent={RatingIconContainer}
          max={10}
          onChange={(e: any, value: number | null) => {
            handleChangeRating("enjoyment", value);
          }}
        />
      </Box>
      <Box textAlign="center">
        <Typography variant="subtitle2" gutterBottom>
          Graphics
        </Typography>
        <StyledRating
          value={ratings.graphics}
          IconContainerComponent={RatingIconContainer}
          max={10}
          onChange={(e: any, value: number | null) => {
            handleChangeRating("graphics", value);
          }}
        />
      </Box>
      <Box textAlign="center">
        <Typography variant="subtitle2" gutterBottom>
          Plot
        </Typography>
        <StyledRating
          value={ratings.plot}
          IconContainerComponent={RatingIconContainer}
          max={10}
          onChange={(e: any, value: number | null) => {
            handleChangeRating("plot", value);
          }}
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

          setRatings({
            average: data.ratingAverage || 0,
            audio: data.rating ? data.rating?.audio : 0,
            enjoyment: data.rating ? data.rating?.enjoyment : 0,
            graphics: data.rating ? data.rating?.graphics : 0,
            plot: data.rating ? data.rating?.plot : 0,
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
          <Grid item xs={12} sm={4} md={3}>
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

          <Grid item xs={12} sm={8} md={9}>
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

          <Grid item xs={12} sm={4} md={3}>
            <Stack
              spacing={3}
              sx={{ textAlign: { xs: "center", sm: "unset" } }}
            >
              <ViewEntryImage
                data={data}
                setData={setData}
                id={props.matches?.id}
              />
              <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setRewatchDialog(true)}
                >
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

          <Grid item xs={12} sm={8} md={9}>
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

                  {data.prequel?.id ||
                  data.sequel?.id ||
                  data.offquels?.length ? (
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
                  ) : null}

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
                      <Button
                        variant="contained"
                        onClick={() => setRewatchDialog(true)}
                      >
                        Edit Rewatches
                      </Button>
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
      <ViewRewatchDialogue
        open={rewatchDialog}
        onClose={() => setRewatchDialog(false)}
        rewatches={data.rewatches}
      />
    </ModuleContainer>
  );
};

export default HomeView;
