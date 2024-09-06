import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import {
  Box,
  Chip,
  Grid,
  MenuItem,
  MenuList,
  Paper,
  styled,
  Typography,
} from "@mui/material";

import {
  faBan as UncategorizedIcon,
  faLeaf as FallIcon,
  faSnowflake as WinterIcon,
  faSun as SummerIcon,
  faTree as SpringIcon,
} from "@fortawesome/free-solid-svg-icons";

import {
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  Table,
} from "@components";
import { Data, YearData } from "./types";
import { Stack } from "@mui/system";

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

  const [initLoad, setInitLoad] = useState(true);
  const [data, setData] = useState<Data>({});
  const [yearData, setYearData] = useState<YearData>([]);
  const [selectedYear, setSelectedYear] = useState<number | "uncategorized">(
    "uncategorized",
  );

  useEffect(() => {
    toggleLoader(true);

    axios
      .get("/entries/by-year")
      .then(({ data: { data } }) => {
        if (data && data.length) {
          const firstYear = data[0].year ?? "uncategorized";

          setYearData(() => data);
          setSelectedYear(firstYear);

          axios
            .get(`entries/by-year/${firstYear}`)
            .then(({ data: { data } }) => {
              setData(() => data);
            })
            .catch((err) => console.error(err))
            .finally(() => {
              toggleLoader(false);
              setInitLoad(false);
            });
        } else {
          toggleLoader(false);
          setInitLoad(false);
        }
      })
      .catch((err) => {
        console.error(err);
        toggleLoader(false);
        setInitLoad(false);
      });
  }, []);

  const handleClickYear = (id: number | "uncategorized") => {
    toggleLoader(true);
    setSelectedYear(id);

    const yearId = id ?? "uncategorized";

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
          <Typography component={"span" as any} variant="body2">
            {label === "Winter" ? <IconWinter /> : null}
            {label === "Spring" ? <IconSpring /> : null}
            {label === "Summer" ? <IconSummer /> : null}
            {label === "Fall" ? <IconFall /> : null}
            {label === "Uncategorized" ? <IconUncategorized /> : null}
            {label}
          </Typography>
          <DividingBox />
          <Typography
            component={"span" as any}
            variant="body2"
            children={value}
          />
        </Stack>
      ) : null}
    </>
  );

  const renderTable = (
    heading: string,
    icon: any,
    values?: Data["uncategorized"],
  ) => (
    <>
      {values?.length ? (
        <Box>
          <Typography variant="h5" gutterBottom>
            {icon}
            {heading}
          </Typography>
          <Table.Container component={Paper}>
            <Table.Element>
              <Table.Head>
                <Table.Row>
                  <Table.Cell>Title</Table.Cell>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {values.map((item) => (
                  <Table.Row hover key={item.uuid}>
                    <Table.Cell>
                      <Quality quality={item.quality} />
                      {item.title}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Element>
          </Table.Container>
        </Box>
      ) : null}
    </>
  );

  return (
    <ModuleContainer headerText="Entries by Year">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={5} md={3}>
          <CustomMenuList component={Paper}>
            {yearData.map((item, index) => (
              <MenuItem
                key={`mara-${index}`}
                onClick={() => handleClickYear(item.year ?? "uncategorized")}
                selected={selectedYear === item.year}
              >
                {item.year ? (
                  <Box width="100%" pb={0.5}>
                    <Typography>{item.year}</Typography>
                    {renderSubmenu(
                      "Uncategorized",
                      item.seasons?.uncategorized,
                    )}
                    {renderSubmenu("Winter", item.seasons?.winter)}
                    {renderSubmenu("Spring", item.seasons?.spring)}
                    {renderSubmenu("Summer", item.seasons?.summer)}
                    {renderSubmenu("Fall", item.seasons?.fall)}
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
                  data.uncategorized,
                )}
                {renderTable("Winter", <IconWinter />, data.winter)}
                {renderTable("Spring", <IconSpring />, data.spring)}
                {renderTable("Summer", <IconSummer />, data.summer)}
                {renderTable("Fall", <IconFall />, data.fall)}
              </>
            )}
          </Stack>
        </Grid>
      </Grid>
      {!initLoad && !isLoading && !yearData.length ? (
        <Typography textAlign="center">Empty Dataset</Typography>
      ) : null}
    </ModuleContainer>
  );
};

export default ByYear;
