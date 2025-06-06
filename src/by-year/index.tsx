import { useContext, useEffect, useState } from "preact/hooks";
import { Slash as UncategorizedIcon } from "react-feather";
import { toast } from "sonner";
import axios from "axios";

import {
  Box,
  Chip,
  Grid,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import FallIcon from "@components/icons/fall.svg?react";
import SpringIcon from "@components/icons/spring.svg?react";
import SummerIcon from "@components/icons/summer.svg?react";
import WinterIcon from "@components/icons/winter.svg?react";

import {
  GlobalLoaderContext,
  ModuleContainer,
  Quality,
  Table,
} from "@components";

import { Data, YearData } from "./types";

type CustomIconProps = {
  small?: boolean;
};

const IconWinter = ({ small }: CustomIconProps) => (
  <WinterIcon
    style={{ width: small ? "12px" : "22px", marginRight: small ? 6 : 8 }}
  />
);

const IconSpring = ({ small }: CustomIconProps) => (
  <SpringIcon
    style={{ width: small ? "12px" : "22px", marginRight: small ? 6 : 8 }}
  />
);

const IconSummer = ({ small }: CustomIconProps) => (
  <SummerIcon
    style={{ width: small ? "12px" : "22px", marginRight: small ? 6 : 8 }}
  />
);

const IconFall = ({ small }: CustomIconProps) => (
  <FallIcon
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

  const handleClickYear = async (id: number | "uncategorized") => {
    toggleLoader(true);

    try {
      const yearId = id ?? "uncategorized";
      setSelectedYear(yearId);

      const {
        data: { data },
      } = await axios.get(`/entries/by-year/${yearId}`);

      setData(() => data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const fetchData = async () => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = await axios.get("/entries/by-year");

      if (data && data.length) {
        const firstYear = data[0].year ?? "uncategorized";

        setYearData(() => data);
        setSelectedYear(firstYear);

        await handleClickYear(firstYear);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
      setInitLoad(false);
    }
  };

  const renderSubmenu = (label: string, value?: number) => (
    <>
      {value ? (
        <Stack spacing={2} direction="row" alignItems="center">
          <Box /> {/* spacer */}
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
          <Box
            sx={{
              borderBottom: "1px solid #ccc",
              display: "flex",
              flexGrow: 1,
            }}
          />
          <Typography
            component={"span" as any}
            variant="body2"
            children={value}
          />
        </Stack>
      ) : null}
    </>
  );

  useEffect(() => {
    fetchData();
  }, []);

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
          <MenuList component={Paper} sx={{ padding: 0, overflow: "hidden" }}>
            {yearData.map((item, index) => (
              <MenuItem
                key={`mara-${index}`}
                onClick={() => handleClickYear(item.year ?? "uncategorized")}
                selected={
                  (selectedYear === "uncategorized" && !item.year) ||
                  selectedYear === item.year
                }
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
          </MenuList>
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
