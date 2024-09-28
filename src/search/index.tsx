import {
  Box,
  Grid2 as Grid,
  Paper,
  Rating,
  styled,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { useContext, useEffect, useState } from "preact/hooks";
import { route } from "preact-router";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartEmpty } from "@fortawesome/free-regular-svg-icons";

import {
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  RewatchIndicator,
  Table,
} from "@components";

import { Codecs, Data } from "./types";
import { Form } from "./validation";
import SearchForm from "./components/SearchForm";

const sampleCodecData: Codecs = {
  audio: [
    {
      id: "35aec409-de76-489f-a48b-284367b4c423",
      codec: "Codec 1",
    },
    {
      id: "ce7e2467-0708-410e-8b9e-75052a6d3733",
      codec: "Codec 2",
    },
    {
      id: "e819f06b-c3a7-426a-a490-11801a5976cf",
      codec: "Codec 3",
    },
  ],
  video: [
    {
      id: "7dc98c43-654c-43aa-a32d-6eefc58c3df0",
      codec: "Vid Codec 1",
    },
    {
      id: "8490fb5a-6be8-462a-9f2d-89d05ca384a6",
      codec: "Vid Codec 2",
    },
  ],
};

const CustomTableRow = styled(Table.Row)({
  cursor: "pointer",
});

const StyledRating = styled(Rating)(({ value }) => ({
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

const RatingIcon = styled(FontAwesomeSvgIcon)({
  marginRight: 2,
  fontSize: 14,
});

const Search = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [data, setData] = useState<Data>([]);
  const [codecs, setCodecs] = useState<Codecs>({
    audio: [],
    video: [],
  });

  const handleSearch = (formData: Form) => {
    console.log(formData);
  };

  useEffect(() => {
    toggleLoader(true);

    setData([]);
    setCodecs(sampleCodecData);

    toggleLoader(false);
  }, []);

  return (
    <ModuleContainer>
      {!isLoading && (
        <Grid container spacing={2}>
          <Grid size={4}>
            <SearchForm codecs={codecs} handleSearch={handleSearch} />
          </Grid>
          <Grid size={8}>
            <Table.Container component={Paper}>
              <Table.Element>
                <Table.Head>
                  <Table.Row>
                    <Table.Cell>Title</Table.Cell>
                    <Table.Cell sx={{ minWidth: 110 }}>E / O / S</Table.Cell>
                    <Table.Cell sx={{ minWidth: 115 }}>Filesize</Table.Cell>
                    <Table.Cell sx={{ minWidth: 190 }}>
                      Date Finished
                    </Table.Cell>
                    <Table.Cell sx={{ minWidth: 130 }}>Release</Table.Cell>
                    <Table.Cell>Encoder</Table.Cell>
                    {!isMobile && <Table.Cell>Rating</Table.Cell>}
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  {!isLoading ? (
                    data.map((item) => (
                      <CustomTableRow
                        hover
                        key={item.id}
                        onClick={() => route(`/search/view/${item.id}`)}
                      >
                        <Table.Cell>
                          <Quality quality={item.quality} />
                          {item.title}
                        </Table.Cell>
                        <Table.Cell>
                          {item.episodes} / {item.ovas} / {item.specials}
                        </Table.Cell>
                        <Table.Cell>{item.filesize}</Table.Cell>
                        <Table.Cell>
                          {item.dateFinished}
                          <RewatchIndicator show={item.rewatched} />
                        </Table.Cell>
                        <Table.Cell>{item.release}</Table.Cell>
                        <Table.Cell>
                          {item.encoder
                            ? item.encoder.replaceAll(" ", "\u00a0")
                            : ""}
                        </Table.Cell>

                        {!isMobile && (
                          <Table.Cell>
                            <Tooltip title={item.rating ?? "0"} placement="top">
                              <Box>
                                <StyledRating
                                  value={item.rating ? item.rating / 2 : 0}
                                  precision={0.25}
                                  icon={<RatingIcon icon={faHeart} />}
                                  emptyIcon={<RatingIcon icon={faHeartEmpty} />}
                                  readOnly
                                />
                              </Box>
                            </Tooltip>
                          </Table.Cell>
                        )}
                      </CustomTableRow>
                    ))
                  ) : (
                    <Table.Loader />
                  )}
                </Table.Body>
              </Table.Element>
            </Table.Container>
          </Grid>
        </Grid>
      )}
    </ModuleContainer>
  );
};

export default Search;
