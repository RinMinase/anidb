import { useContext, useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import axios from "axios";

import { Chip, Grid, Paper, styled } from "@mui/material";

import {
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  RewatchIndicator,
  Table,
} from "@components";

import { Data, Stats } from "./types";

type TableRowProps = {
  active: boolean;
};

const CustomTableRow = styled(Table.Row)<TableRowProps>(
  ({ active, theme }) => ({
    cursor: "pointer",
    backgroundColor: active ? "rgba(25, 135, 84, 0.08)" : "",
    ...theme.applyStyles("dark", {
      backgroundColor: active ? "rgba(16, 84, 52, 0.16)" : "",
    }),
  }),
);

const ByGenre = () => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [isTableLoading, setTableLoader] = useState(false);
  const [data, setData] = useState<Data>([]);
  const [stats, setStats] = useState<Stats>([]);
  const [selected, setSelected] = useState<string>("none");

  const handleChangeData = async (genre: string = "none") => {
    setTableLoader(true);

    try {
      setSelected(genre);

      const {
        data: { data },
      } = await axios.get(`/entries/by-genre/${genre}`);

      setData(() => data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoader(false);
    }
  };

  const fetchData = async () => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = await axios.get("/entries/by-genre");

      setStats(() => data);
      toggleLoader(false);

      if (data && data.length) {
        const firstGenre = data[0].genre;

        if (firstGenre) {
          setSelected(firstGenre);

          await handleChangeData(firstGenre);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="Entries by Genre">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <Table.Container component={Paper}>
            <Table.Element>
              <Table.Head>
                <Table.Row>
                  <Table.Cell align="center">Genre</Table.Cell>
                  <Table.Cell align="center">Count</Table.Cell>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {stats.map((item) => (
                  <CustomTableRow
                    hover
                    key={`bygenre-${item.genre}`}
                    onClick={() => handleChangeData(item.genre)}
                    active={`${item.genre}` === selected}
                  >
                    <Table.Cell align="center">{item.genre}</Table.Cell>
                    <Table.Cell align="center">{item.count}</Table.Cell>
                  </CustomTableRow>
                ))}
              </Table.Body>
            </Table.Element>
          </Table.Container>
        </Grid>

        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
          <Table.Container component={Paper}>
            <Table.Element>
              <Table.Head>
                <Table.Row>
                  <Table.Cell sx={{ minWidth: 150 }}>Title</Table.Cell>
                  <Table.Cell sx={{ minWidth: 110 }}>E / O / S</Table.Cell>
                  <Table.Cell sx={{ minWidth: 225 }}>Genres</Table.Cell>
                  <Table.Cell sx={{ minWidth: 205 }}>Date Finished</Table.Cell>
                  <Table.Cell sx={{ minWidth: 130 }}>Release</Table.Cell>
                  <Table.Cell>Encoder</Table.Cell>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {!isTableLoading ? (
                  data.map((item) => (
                    <Table.Row hover key={item.id}>
                      <Table.Cell>
                        <Quality quality={item.quality} />
                        {item.title}
                      </Table.Cell>
                      <Table.Cell>
                        {item.episodes} / {item.ovas} / {item.specials}
                      </Table.Cell>
                      <Table.Cell>
                        <Grid container spacing={1}>
                          {item.genres.map((genre) => (
                            <Chip
                              key={`${item.id}_${genre.id}`}
                              size="small"
                              label={genre.genre}
                            />
                          ))}
                        </Grid>
                      </Table.Cell>
                      <Table.Cell>
                        {item.dateFinished}
                        <RewatchIndicator
                          show={item.rewatched}
                          times={item.rewatchCount}
                        />
                      </Table.Cell>
                      <Table.Cell>{item.release}</Table.Cell>
                      <Table.Cell sx={{ whiteSpace: "nowrap" }}>
                        {item.encoder}
                      </Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Loader />
                )}
              </Table.Body>
            </Table.Element>
          </Table.Container>
        </Grid>
      </Grid>
    </ModuleContainer>
  );
};

export default ByGenre;
