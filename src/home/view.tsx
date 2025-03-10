import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { debounce } from "lodash-es";
import { toast } from "sonner";
import axios from "axios";
import contrast from "font-color-contrast";

import {
  Box,
  Chip,
  Grid2 as Grid,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft as BackIcon,
  ChevronRight as BulletIcon,
  Edit as EditIcon,
  Trash as DeleteIcon,
} from "react-feather";

import TotalRatingIcon from "@components/icons/heart.svg?react";

import { roundHalfDown } from "@components/functions";

import {
  AuthenticatedUserContext,
  Button,
  ButtonLoading,
  Dialog,
  GlobalLoaderContext,
  ModuleContainer,
} from "@components";

import { FullData } from "./types";
import ViewEntryImage from "./components/ViewEntryImage";
import ViewRewatchDialog from "./components/ViewRewatchDialog";
import ViewOffquelDialog from "./components/ViewOffquelDialog";

import {
  Header,
  TotalStyledRating,
  StyledRating,
  IconWinter,
  IconSpring,
  IconSummer,
  IconFall,
  RatingIconContainer,
} from "./components/ViewComponents";

type Props = {
  matches: {
    id: string;
  };
};

type RatingType = "audio" | "enjoyment" | "graphics" | "plot";

const HomeView = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);
  const isAdmin = useContext(AuthenticatedUserContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [rewatchDialog, setRewatchDialog] = useState(false);
  const [offquelDialog, setOffquelDialog] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);

  const [data, setData] = useState<FullData>({});
  const [ratings, setRatings] = useState({
    average: 0,
    audio: 0,
    enjoyment: 0,
    graphics: 0,
    plot: 0,
  });

  // Temporary handlers due to MUI6 Rating issue
  const handleHover = (type: RatingType, value: number | null) => {
    setHoverRatings((prev) => ({
      ...prev,
      [type]: value && value !== -1 ? value : 0,
    }));
  };

  const debouncedOnHover = debounce(handleHover, 200);

  const [hoverRatings, setHoverRatings] = useState({
    audio: 0,
    enjoyment: 0,
    graphics: 0,
    plot: 0,
  });
  // Temporary handlers end here

  const handleChangeRating = async (type: RatingType, value: number | null) => {
    const { audio, enjoyment, graphics, plot } = ratings;

    // Proceed with API call
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

    // Handle clearing of data on clicking the same position
    const clearCurrValue = ratings[type] === value;

    if (clearCurrValue) {
      total -= value ?? 0;
    }

    const average = roundHalfDown(total / 4);

    setRatings((prev) => ({
      ...prev,
      average,
      [type]: clearCurrValue ? 0 : value,
    }));

    await axios.put(`/entries/ratings/${props.matches?.id}`, {
      ...ratings,
      [type]: clearCurrValue ? 0 : value,
    });
  };

  const debouncedChangeRating = debounce(handleChangeRating, 25);

  const renderTotalRating = () => (
    <Box textAlign="center">
      <TotalStyledRating
        value={ratings.average ?? 0}
        icon={<TotalRatingIcon width={28} />}
        emptyIcon={<TotalRatingIcon width={28} />}
        readOnly
      />
      <Typography>Rating: {ratings.average}</Typography>
    </Box>
  );

  const renderIndividualRatings = () => (
    <Stack spacing={1} textAlign="center">
      <Stack direction="row" spacing={2} justifyContent="center">
        <Typography variant="subtitle2" width="75px">
          Audio
        </Typography>
        <StyledRating
          value={ratings.audio}
          IconContainerComponent={RatingIconContainer}
          max={5}
          disabled={!isAdmin}
          onChangeActive={(e: any, value: number | null) =>
            debouncedOnHover("audio", value)
          }
          onClick={() => debouncedChangeRating("audio", hoverRatings.audio)}
        />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Typography variant="subtitle2" width="75px">
          Enjoyment
        </Typography>
        <StyledRating
          value={ratings.enjoyment}
          IconContainerComponent={RatingIconContainer}
          max={5}
          disabled={!isAdmin}
          onChangeActive={(e: any, value: number | null) =>
            debouncedOnHover("enjoyment", value)
          }
          onClick={() =>
            debouncedChangeRating("enjoyment", hoverRatings.enjoyment)
          }
        />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Typography variant="subtitle2" width="75px">
          Graphics
        </Typography>
        <StyledRating
          value={ratings.graphics}
          IconContainerComponent={RatingIconContainer}
          max={5}
          disabled={!isAdmin}
          onChangeActive={(e: any, value: number | null) =>
            debouncedOnHover("graphics", value)
          }
          onClick={() =>
            debouncedChangeRating("graphics", hoverRatings.graphics)
          }
        />
      </Stack>
      <Stack direction="row" spacing={2} justifyContent="center">
        <Typography variant="subtitle2" width="75px">
          Plot
        </Typography>
        <StyledRating
          value={ratings.plot}
          IconContainerComponent={RatingIconContainer}
          max={5}
          disabled={!isAdmin}
          onChangeActive={(e: any, value: number | null) =>
            debouncedOnHover("plot", value)
          }
          onClick={() => debouncedChangeRating("plot", hoverRatings.plot)}
        />
      </Stack>
    </Stack>
  );

  const handleChangeData = async () => {
    try {
      const { id } = props.matches;
      const getColor = (id?: number) => {
        if (id === 1) return "#f9c";
        if (id === 2) return "#9f9";
        if (id === 3) return "#9cf";
        if (id === 4) return "#fc6";
        return "#777";
      };

      const {
        data: { data },
      } = await axios.get(`/entries/${id}`);

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

      setHoverRatings({
        audio: data.rating ? data.rating?.audio : 0,
        enjoyment: data.rating ? data.rating?.enjoyment : 0,
        graphics: data.rating ? data.rating?.graphics : 0,
        plot: data.rating ? data.rating?.plot : 0,
      });
    } catch (err: any) {
      console.error(err);
      toast.error("Failed");

      if (err.response?.data?.message?.includes("ID is invalid")) {
        route("/home");
      }
    } finally {
      toggleLoader(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setDeleteDialogOpen(false);
      setDeleteLoading(true);

      await axios.delete(`/entries/${props.matches.id}`);
      toast.success("Success");

      route("/home");
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  useEffect(() => {
    toggleLoader(true);
    handleChangeData();
  }, [props.matches]);

  return (
    <ModuleContainer>
      {!isLoading && data.title && (
        <Grid container spacing={2.5}>
          <Grid container size={{ xs: 12, sm: 4, lg: 3 }} spacing={1.25}>
            <Grid size={{ xs: 4, sm: 12 }}>
              <Button
                variant="contained"
                color="info"
                startIcon={<BackIcon size={16} />}
                onClick={() => route("/home")}
                fullWidth
              >
                Back
              </Button>
            </Grid>
            <Grid size={{ xs: 4, sm: 6 }}>
              <Button
                variant="contained"
                color="warning"
                disabled={!isAdmin}
                startIcon={<EditIcon size={16} />}
                onClick={() => route(`/home/edit/${props.matches.id}`)}
                fullWidth
              >
                Edit
              </Button>
            </Grid>
            <Grid size={{ xs: 4, sm: 6 }}>
              <ButtonLoading
                variant="contained"
                color="error"
                disabled={!isAdmin}
                loading={isDeleteLoading}
                startIcon={<DeleteIcon size={16} />}
                onClick={() => setDeleteDialogOpen(true)}
                fullWidth
              >
                Delete
              </ButtonLoading>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, sm: 8, lg: 9 }}>
            <Stack
              spacing={2}
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
                {data.watcher ? (
                  <Chip
                    label={
                      data.watcher.label === "Together"
                        ? `Watched ${data.watcher.label}`
                        : `Watched by ${data.watcher.label}`
                    }
                    sx={{
                      ml: 1,
                      backgroundColor: data.watcher.color,
                      color: contrast(data.watcher.color || "#fff"),
                    }}
                  />
                ) : null}
              </Box>
              <Typography variant="h5">{data.title}</Typography>
              {data.variants && isMobile && (
                <Typography variant="body1" sx={{ fontStyle: "italic" }}>
                  &#10077; {data.variants} &#10078;
                </Typography>
              )}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
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
                  disabled={!isAdmin}
                  onClick={() => setOffquelDialog(true)}
                >
                  Edit Offquels
                </Button>
              </Box>
              <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!isAdmin}
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

          <Grid size={{ xs: 12, sm: 8, lg: 9 }}>
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
                {data.filesize && (
                  <Typography variant="body1">{data.filesize}</Typography>
                )}
                {(data.codecHDR || data.codecVideo || data.codecAudio) && (
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
                )}
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
                    <Typography variant="body1" component={"span" as any}>
                      {data.release}
                    </Typography>
                  </Box>

                  {data.prequel?.id ||
                  data.sequel?.id ||
                  data.offquels?.length ? (
                    <Stack spacing={1}>
                      {data.prequel?.id && (
                        <Typography variant="body1">
                          <Typography component={"span" as any}>
                            Prequel:{" "}
                          </Typography>
                          <Link href={`/home/view/${data.prequel.id}`}>
                            {data.prequel.title}
                          </Link>
                        </Typography>
                      )}
                      {data.sequel?.id && (
                        <Typography variant="body1">
                          <Typography component={"span" as any}>
                            Sequel:{" "}
                          </Typography>
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
                              <Typography
                                variant="body1"
                                key={item.id}
                                display="flex"
                                alignItems="center"
                              >
                                <BulletIcon size={18} />
                                <Link href={`/home/view/${item.id}`}>
                                  {item.title}
                                </Link>
                              </Typography>
                            ))}
                          </Box>
                        </>
                      ) : null}
                      <Box sx={{ display: { xs: "inline-block", sm: "none" } }}>
                        <Button
                          variant="contained"
                          onClick={() => setOffquelDialog(true)}
                        >
                          Edit Offquels
                        </Button>
                      </Box>
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
                    {data.seasonFirstTitle?.title && (
                      <Typography variant="body1">
                        Season #{data.seasonNumber} of{" "}
                        {data.seasonFirstTitle.title}
                      </Typography>
                    )}
                  </Stack>

                  {data.genres && data.genres.length ? (
                    <Stack direction="row" spacing={1}>
                      <Typography variant="body1">Genres:</Typography>
                      {data.genres.map((item) => (
                        <Chip
                          key={`genre-${data.id}-${item.id}`}
                          label={item.genre}
                          size="small"
                          sx={{
                            backgroundColor: "#777",
                            px: 1,
                            color: contrast("#fce257"),
                          }}
                        />
                      ))}
                    </Stack>
                  ) : null}

                  <Stack spacing={1}>
                    <Typography variant="body1">
                      Rewatches: {data.rewatches?.length || "None"}
                    </Typography>
                    {data.rewatches?.length ? (
                      <Box sx={{ pl: 2 }}>
                        {data.rewatches.map((item) => (
                          <Typography variant="body1" key={item.id}>
                            <BulletIcon size={14} />
                            {item.date}
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

                  {data.remarks && (
                    <Box>
                      <Typography variant="body1">Remarks:</Typography>
                      <Typography variant="body1">{data.remarks}</Typography>
                    </Box>
                  )}
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

      <ViewRewatchDialog
        entry={props.matches?.id || ""}
        open={rewatchDialog}
        onChangeData={handleChangeData}
        onClose={() => setRewatchDialog(false)}
        rewatches={data.rewatches}
      />

      <ViewOffquelDialog
        entry={props.matches?.id || ""}
        open={offquelDialog}
        onChangeData={handleChangeData}
        onClose={() => setOffquelDialog(false)}
        offquels={data.offquels}
      />

      <Dialog
        title="Are you sure?"
        text="This content would be deleted."
        onSubmit={handleDeleteSubmit}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </ModuleContainer>
  );
};

export default HomeView;
