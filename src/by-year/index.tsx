import { useContext, useEffect, useState } from "preact/hooks";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import { Slash as UncategorizedIcon } from "react-feather";

import {
  Box,
  Chip,
  Grid2 as Grid,
  MenuItem,
  MenuList,
  Paper,
  styled,
  Typography,
} from "@mui/material";

import FallIcon from "@components/icons/fall.svg";
import SpringIcon from "@components/icons/spring.svg";
import SummerIcon from "@components/icons/summer.svg";
import WinterIcon from "@components/icons/winter.svg";

import {
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  Table,
} from "@components";

import { Data, YearData } from "./types";
import { Stack } from "@mui/system";

type CustomIconProps = {
  small?: boolean;
};

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

const IconWinter = ({ small }: CustomIconProps) => (
  <img
    src={WinterIcon}
    style={{ width: small ? "12px" : "22px", marginRight: small ? 6 : 8 }}
  />
);

const IconSpring = ({ small }: CustomIconProps) => (
  <img
    src={SpringIcon}
    style={{ width: small ? "12px" : "22px", marginRight: small ? 6 : 8 }}
  />
);

const IconSummer = ({ small }: CustomIconProps) => (
  <img
    src={SummerIcon}
    style={{ width: small ? "12px" : "22px", marginRight: small ? 6 : 8 }}
  />
);

const IconFall = ({ small }: CustomIconProps) => (
  <img
    src={FallIcon}
    style={{ width: small ? "12px" : "22px", marginRight: small ? 6 : 8 }}
  />
);

const IconUncategorized = ({ small }: CustomIconProps) => (
  <span
    style={{
      marginRight: small ? 6 : 8,
      display: "flex",
      alignItems: "center",
    }}
  >
    <UncategorizedIcon size={small ? 14 : 24} color="#d32f2f" />
  </span>
);

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

  const renderSubmenu = (label: string, value?: number) => (
    <>
      {value ? (
        <Stack spacing={2} direction="row" alignItems="center">
          <DividingSpacer />
          <Typography
            component={"span" as any}
            variant="body2"
            display="flex"
            alignItems="center"
          >
            {label === "Winter" ? <IconWinter small /> : null}
            {label === "Spring" ? <IconSpring small /> : null}
            {label === "Summer" ? <IconSummer small /> : null}
            {label === "Fall" ? <IconFall small /> : null}
            {label === "Uncategorized" ? <IconUncategorized small /> : null}
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
          <Typography
            variant="h5"
            display="flex"
            alignItems="center"
            gutterBottom
          >
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
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
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

        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
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
