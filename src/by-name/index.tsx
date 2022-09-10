import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import {
  animateScroll,
  Element as ScrollToElement,
  scroller,
} from "react-scroll";

import {
  Box,
  Grid,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { GlobalLoaderContext, Quality, TableLoader } from "@components";
import { Data, Stats } from "./types";

type TableRowProps = {
  active: boolean;
};

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const CustomTableRow = styled(TableRow)<TableRowProps>(({ active, theme }) => ({
  cursor: "pointer",
  backgroundColor: active
    ? theme.palette.mode === "light"
      ? "rgba(25, 135, 84, 0.08)"
      : "rgba(16, 84, 52, 0.16)"
    : "",
}));

const ByName = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const theme = useTheme();
  const nonMobile = useMediaQuery(theme.breakpoints.up("md"));

  const [data, setData] = useState<Data>([]);
  const [stats, setStats] = useState<Stats>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const handleChangeData = (letter: string) => {
    toggleLoader(true);

    if (nonMobile) {
      animateScroll.scrollToTop({
        smooth: true,
        duration: 500,
        containerId: "main",
      });
    }

    const id = letter === "#" ? 0 : letter;

    axios
      .get(`/entries/by-name/${id}`)
      .then(({ data: { data } }) => {
        setData(() => data);
        setSelected(letter);

        if (!nonMobile) {
          scroller.scrollTo("table", {
            smooth: true,
            duration: 500,
            containerId: "main",
          });
        }
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  };

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/entries/by-name")
      .then(({ data: { data } }) => {
        setStats(() => data);

        axios
          .get("/entries/by-name/0")
          .then(({ data: { data } }) => {
            setData(() => data);
            setSelected("#");
          })
          .catch((err) => console.error(err))
          .finally(() => toggleLoader(false));
      })
      .catch((err) => {
        console.error(err);
        toggleLoader(false);
      });
  }, []);

  return (
    <ModuleContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={7} md={3}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell align="center">Titles</TableCell>
                  <TableCell align="center">Filesize</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {stats.map((item) => (
                  <CustomTableRow
                    hover
                    key={`byname-${item.letter}`}
                    onClick={() => handleChangeData(item.letter)}
                    active={`${item.letter}` === selected}
                  >
                    <TableCell>{item.letter}</TableCell>
                    <TableCell align="center">{item.titles}</TableCell>
                    <TableCell align="center">{item.filesize}</TableCell>
                  </CustomTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} sm={5} md={8}>
          <ScrollToElement name="table" />
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Filesize</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {!isLoading ? (
                  data.map((item) => (
                    <TableRow hover key={item.id}>
                      <TableCell>
                        <Quality quality={item.quality} />
                        {item.title}
                      </TableCell>
                      <TableCell>{item.filesize}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableLoader />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </ModuleContainer>
  );
};

export default ByName;
