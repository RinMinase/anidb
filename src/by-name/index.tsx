import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";

import {
  animateScroll,
  Element as ScrollToElement,
  scroller,
} from "react-scroll";

import {
  Grid2 as Grid,
  Paper,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  Table,
} from "@components";
import { Data, Stats } from "./types";

type TableRowProps = {
  active: boolean;
};

const CustomTableRow = styled(Table.Row)<TableRowProps>(
  ({ active, theme }) => ({
    cursor: "pointer",
    backgroundColor: active
      ? theme.palette.mode === "light"
        ? "rgba(25, 135, 84, 0.08)"
        : "rgba(16, 84, 52, 0.16)"
      : "",
  }),
);

const ByName = () => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const nonMobile = useMediaQuery(theme.breakpoints.up("md"));

  const [isTableLoading, setTableLoader] = useState(false);
  const [data, setData] = useState<Data>([]);
  const [stats, setStats] = useState<Stats>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleChangeData = async (letter: string, init?: boolean) => {
    setTableLoader(true);

    if (nonMobile && !init) {
      animateScroll.scrollToTop({
        smooth: true,
        duration: 500,
        containerId: "main",
      });
    }

    const id = letter === "#" ? 0 : letter;

    try {
      const {
        data: { data },
      } = await axios.get(`/entries/by-name/${id}`);

      setData(() => data);
      setSelected(letter);

      if (!nonMobile) {
        scroller.scrollTo("table", {
          smooth: true,
          duration: 500,
          containerId: "main",
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTableLoader(false);
    }
  };

  const fetchData = async () => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = await axios.get("/entries/by-name");

      setStats(() => data);
      toggleLoader(false);
      setTableLoader(true);

      await handleChangeData("#", true);
    } catch (err) {
      console.error(err);
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="Entries by Name">
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <Table.Container component={Paper}>
            <Table.Element>
              <Table.Head>
                <Table.Row>
                  <Table.Cell />
                  <Table.Cell align="center">Titles</Table.Cell>
                  <Table.Cell align="center">Filesize</Table.Cell>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {stats.map((item) => (
                  <CustomTableRow
                    hover
                    key={`byname-${item.letter}`}
                    onClick={() => handleChangeData(item.letter)}
                    active={`${item.letter}` === selected}
                  >
                    <Table.Cell>{item.letter}</Table.Cell>
                    <Table.Cell align="center">{item.titles}</Table.Cell>
                    <Table.Cell align="center">{item.filesize}</Table.Cell>
                  </CustomTableRow>
                ))}
              </Table.Body>
            </Table.Element>
          </Table.Container>
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
          <ScrollToElement name="table" />
          <Table.Container component={Paper}>
            <Table.Element>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>Title</Table.Cell>
                  <Table.Cell>Filesize</Table.Cell>
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
                      <Table.Cell>{item.filesize}</Table.Cell>
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

export default ByName;
