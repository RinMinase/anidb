import {
  Chip,
  Grid2 as Grid,
  Paper,
  Rating,
  Stack,
  styled,
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
import axios from "axios";

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

  const [tableLoader, setTableLoader] = useState(false);
  const [data, setData] = useState<Data>([]);
  const [codecs, setCodecs] = useState<Codecs>({
    audio: [],
    video: [],
  });

  const handleSearch = async (formData: Form) => {
    setTableLoader(true);

    try {
      const query: any = { ...formData };

      for (const key of Object.keys(query)) {
        if (query[key] === "") {
          delete query[key];
        }
      }

      const {
        data: { data },
      } = await axios.get("/entries/search", {
        params: {
          ...query,
        },
      });

      setData(data);
    } catch {
    } finally {
      setTableLoader(false);
    }
  };

  const fetchData = async () => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = await axios.get("/codecs");

      setCodecs(data);
    } catch {
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer>
      {!isLoading && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <SearchForm codecs={codecs} handleSearch={handleSearch} />
          </Grid>
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <Table.Container
              component={Paper}
              // 100vh - screen
              // 48px - navbar
              // 48px - main container top and bottom padding
              sx={{ maxHeight: "calc(100vh - 48px - 48px)", overflowY: "auto" }}
            >
              <Table.Element size="small">
                <Table.Head>
                  <Table.Row>
                    <Table.Cell sx={{ minWidth: 250 }}>Title</Table.Cell>
                    <Table.Cell sx={{ minWidth: 110 }}>E / O / S</Table.Cell>
                    <Table.Cell sx={{ minWidth: 100 }}>Filesize</Table.Cell>
                    <Table.Cell sx={{ minWidth: 180 }}>
                      Date Finished
                    </Table.Cell>
                    <Table.Cell sx={{ minWidth: 130 }}>Release</Table.Cell>
                    <Table.Cell>Encoder</Table.Cell>
                    <Table.Cell>Rating</Table.Cell>
                  </Table.Row>
                </Table.Head>

                <Table.Body>
                  {!isLoading && !tableLoader ? (
                    data.map((item) => (
                      <CustomTableRow
                        hover
                        key={item.id}
                        onClick={() => route(`/search/view/${item.id}`)}
                      >
                        <Table.Cell>
                          <Quality quality={item.quality} />
                          {item.title}
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
                        <Table.Cell sx={{ whiteSpace: "nowrap" }}>
                          {item.encoder
                            ? item.encoder.replaceAll(" ", "\u00a0")
                            : ""}
                        </Table.Cell>

                        <Table.Cell>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Chip
                              label={item.rating ?? "0"}
                              size="small"
                              sx={{ width: "45px", height: "20px" }}
                            />
                            <StyledRating
                              value={item.rating ? item.rating / 2 : 0}
                              precision={0.25}
                              icon={<RatingIcon icon={faHeart} />}
                              emptyIcon={<RatingIcon icon={faHeartEmpty} />}
                              readOnly
                            />
                          </Stack>
                        </Table.Cell>
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