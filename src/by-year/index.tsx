import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";

import {
  Box,
  Chip,
  Grid,
  MenuItem,
  MenuList,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  faBan as UncategorizedIcon,
  faLeaf as FallIcon,
  faSnowflake as WinterIcon,
  faSun as SummerIcon,
  faTree as SpringIcon,
} from "@fortawesome/free-solid-svg-icons";

import { GlobalLoaderContext, Quality } from "@components";
import { Data, YearData } from "./types";
import { Stack } from "@mui/system";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const CustomMenuList = styled(MenuList)<{ component: any }>({
  padding: 0,
  overflow: "hidden",
});

const Icon = styled(FontAwesomeSvgIcon)({
  marginRight: 8,
});

const DividingSpacer = styled(Box)({});

const DividingBox = styled(Box)({
  borderBottom: `1px solid #ccc`,
  display: "flex",
  flexGrow: 1,
});

const ByYear = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>({});
  const [yearData, setYearData] = useState<YearData>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/entries/by-year")
      .then(({ data: { data } }) => {
        const firstYear = data[0].year;

        setYearData(() => data);
        setSelectedYear(firstYear);

        axios
          .get(`entries/by-year/${firstYear}`)
          .then(({ data: { data } }) => {
            setData(() => data);
          })
          .catch((err) => console.error(err))
          .finally(() => toggleLoader(false));
      })
      .catch((err) => {
        console.error(err);
        toggleLoader(false);
      });
  }, []);

  const handleClickYear = (id: number | null) => {
    toggleLoader(true);
    setSelectedYear(id);

    const yearId = id ?? "null";

    axios
      .get(`/entries/by-year/${yearId}`)
      .then(({ data: { data } }) => {
        setData(() => data);
      })
      .catch((err) => console.error(err))
      .finally(() => toggleLoader(false));
  };

  const IconWinter = () => <Icon icon={WinterIcon} color="#87ceeb" />;
  const IconSpring = () => <Icon icon={SpringIcon} color="#008000" />;
  const IconSummer = () => <Icon icon={SummerIcon} color="#ffa726" />;
  const IconFall = () => <Icon icon={FallIcon} color="#ff5722" />;
  const IconUncategorized = () => (
    <Icon icon={UncategorizedIcon} color="#d32f2f" />
  );

  const renderSubmenu = (label: string, value?: number) => (
    <>
      {value ? (
        <Stack spacing={2} direction="row" alignItems="center">
          <DividingSpacer />
          <Typography component="span" variant="body2">
            {label === "Winter" ? <IconWinter /> : null}
            {label === "Spring" ? <IconSpring /> : null}
            {label === "Summer" ? <IconSummer /> : null}
            {label === "Fall" ? <IconFall /> : null}
            {label}
          </Typography>
          <DividingBox />
          <Typography component="span" variant="body2" children={value} />
        </Stack>
      ) : null}
    </>
  );

  const renderTable = (
    heading: string,
    icon: any,
    values?: Data["Uncategorized"],
  ) => (
    <>
      {values?.length ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            {icon}
            {heading}
          </Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {values.map((item) => (
                  <TableRow hover key={item.uuid}>
                    <TableCell>
                        <Quality quality={item.quality} />
                        {item.title}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : null}
    </>
  );

  return (
    <ModuleContainer>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
          <CustomMenuList component={Paper}>
            {yearData.map((item, index) => (
              <MenuItem
                key={`mara-${index}`}
                onClick={() => handleClickYear(item.year)}
                selected={selectedYear === item.year}
              >
                {item.year ? (
                  <Box width="100%" pb={0.5}>
                    <Typography>{item.year}</Typography>
                    {renderSubmenu("None", item.seasons?.None)}
                    {renderSubmenu("Winter", item.seasons?.Winter)}
                    {renderSubmenu("Spring", item.seasons?.Spring)}
                    {renderSubmenu("Summer", item.seasons?.Summer)}
                    {renderSubmenu("Fall", item.seasons?.Fall)}
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    Uncategorized
                    <Chip label={item.count} size="small" />
                  </Box>
                )}
              </MenuItem>
            ))}
          </CustomMenuList>
        </Grid>

        <Grid item xs={12} sm={7} md={9}>
          <Stack spacing={3}>
            {!isLoading && (
              <>
                {renderTable(
                  "Uncategorized",
                  <IconUncategorized />,
                  data.Uncategorized,
                )}
                {renderTable("Winter", <IconWinter />, data.Winter)}
                {renderTable("Spring", <IconSpring />, data.Spring)}
                {renderTable("Summer", <IconSummer />, data.Summer)}
                {renderTable("Fall", <IconFall />, data.Fall)}
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
    </ModuleContainer>
  );
};

export default ByYear;
