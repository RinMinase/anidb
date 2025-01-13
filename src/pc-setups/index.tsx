import { useContext, useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { format } from "date-fns";
import axios from "axios";

import {
  Box,
  Grid2 as Grid,
  ListItemText,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import {
  Eye,
  EyeOff,
  Plus as AddOwnerIcon,
  PlusCircle as AddSetupIcon,
  Trash2 as DeleteIcon,
} from "react-feather";

import {
  Button,
  DashboardTile,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
  Table,
} from "@components";

import { PCInfo, PCOwnerList } from "./types";

import CpuImageIcon from "@components/icons/images/cpu.png";
import GpuImageIcon from "@components/icons/images/gpu.png";
import HddImageIcon from "@components/icons/images/hdd.png";
import RamImageIcon from "@components/icons/images/ram.png";

type HighlightsTileProps = {
  imageSrc: string;
  value: string;
};

const ShowIcon = <Eye size={20} strokeWidth={1.5} />;
const HideIcon = <EyeOff size={20} strokeWidth={1.5} />;

const PcSetup = () => {
  const theme = useTheme();

  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [dataOwners, setDataOwners] = useState<PCOwnerList>([]);
  const [dataSetup, setDataSetup] = useState<PCInfo>();
  const [showHidden, setShowHidden] = useState(false);
  const [isTableLoading, setTableLoading] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState<string>();

  const fetchDataInfo = async (uuid: string) => {
    setSelectedInfo(uuid);
    setTableLoading(true);

    try {
      const {
        data: { data },
      } = await axios.get(`/pc/infos/${uuid}`);

      setDataSetup(data);
      console.log(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchData = async () => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = (await axios.get("/pc/owners")) as {
        data: { data: PCOwnerList };
      };

      setDataOwners(data);

      if (data.length) {
        let firstId = "";
        data.forEach((item) => {
          if (!firstId && item.infos.length) {
            firstId = item.infos[0].uuid;
          }
        });

        if (firstId) fetchDataInfo(firstId);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleClickInfo = async (uuid: string) => {
    if (selectedInfo !== uuid) {
      await fetchDataInfo(uuid);
    }
  };

  const handleShowHiddenButtonClick = () => {
    setShowHidden((prev) => !prev);
  };

  const handleAddSetupClick = (uuid: string) => {};

  const handleDeleteOwnerClick = (uuid: string) => {};

  const HeaderControls = () => (
    <>
      <IconButton
        children={showHidden ? ShowIcon : HideIcon}
        onClick={handleShowHiddenButtonClick}
      />
      <Button
        variant="contained"
        startIcon={<AddOwnerIcon size={20} strokeWidth={1.5} />}
        sx={{ minWidth: 120, marginLeft: 2 }}
        onClick={() => {}}
      >
        Add Owner
      </Button>
    </>
  );

  const HighlightsTile = (props: HighlightsTileProps) => (
    <Grid
      size={{ xs: 6 }}
      component={Paper}
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ p: 1 }}
    >
      <img
        src={props.imageSrc}
        style={{
          width: 48,
          height: 48,
          filter: theme.palette.mode === "dark" ? "invert(1)" : undefined,
        }}
      />
      <Typography
        display="inline-block"
        fontSize={14}
        fontWeight={700}
        whiteSpace="nowrap"
        overflow="hidden"
        textOverflow="ellipsis"
      >
        {props.value}
      </Typography>
    </Grid>
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="PC Setups" headerControls={<HeaderControls />}>
      <Grid container spacing={2}>
        <Grid container size={{ xs: 12, sm: 5, md: 4, lg: 3 }}>
          <MenuList
            component={Paper}
            sx={{ padding: 0, overflow: "hidden", width: "100%" }}
          >
            {dataOwners.map((item) => (
              <Box key={`pc-owner-${item.uuid}`}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={(theme) => ({
                    py: 2,
                    pl: 3,
                    pr: 2,
                    backgroundColor: theme.palette.primary.main,
                    color: "#fff",
                  })}
                >
                  <Typography>{item.name}</Typography>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteOwnerClick(item.uuid)}
                      children={<DeleteIcon size={21} color="#fff" />}
                      sx={{ marginRight: 0.5 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleAddSetupClick(item.uuid)}
                      children={<AddSetupIcon size={21} color="#fff" />}
                    />
                  </Box>
                </Stack>
                {item.infos.map((info) => (
                  <MenuItem
                    key={`pc-info-${info.uuid}`}
                    selected={selectedInfo === info.uuid}
                    onClick={() => handleClickInfo(info.uuid)}
                  >
                    <ListItemText>{info.label}</ListItemText>
                  </MenuItem>
                ))}
              </Box>
            ))}
          </MenuList>
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 8, lg: 9 }}>
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DashboardTile
                heading="Total Setup Cost"
                value="200,000"
                largeText
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DashboardTile
                heading="Total System Cost"
                value="100,000"
                footerLeft="Peripheral Cost"
                footerRight="100,000"
                footerFontSize={13}
                mediumText
              />
            </Grid>
            <Grid
              size={{ xs: 12, sm: 6 }}
              display="flex"
              alignItems="center"
              sx={{ mt: 3 }}
            >
              <Grid container spacing={1} width="100%">
                <HighlightsTile
                  imageSrc={CpuImageIcon}
                  value={"Ryzen 7 7800X3D"}
                />
                <HighlightsTile imageSrc={GpuImageIcon} value={"RTX 3060TI"} />
                <HighlightsTile
                  imageSrc={RamImageIcon}
                  value={"32GB 6000MHz"}
                />
                <HighlightsTile
                  imageSrc={HddImageIcon}
                  value={"4TB SSD, 8TB HDD"}
                />
              </Grid>
            </Grid>
          </Grid>

          {/*
           * Calculation Description:
           * 48px - navbar
           * 48px - container padding
           * 52.5px - page heading
           * 193px - page tiles
           */}
          <Table.Container
            component={Paper}
            sx={{ maxHeight: "calc(100vh - 48px - 48px - 52.5px - 193px)" }}
          >
            <Table.Element size="small">
              <Table.Head>
                <Table.Row>
                  <Table.Cell>Type</Table.Cell>
                  <Table.Cell sx={{ minWidth: 300 }}>Name</Table.Cell>
                  <Table.Cell sx={{ minWidth: 300 }}>Description</Table.Cell>
                  <Table.Cell sx={{ minWidth: 100, textAlign: "right" }}>
                    Price
                  </Table.Cell>
                  <Table.Cell sx={{ textAlign: "center" }}>Count</Table.Cell>
                  <Table.Cell sx={{ minWidth: 100, textAlign: "right" }}>
                    Price Est.
                  </Table.Cell>
                  <Table.Cell sx={{ minWidth: 140, textAlign: "center" }}>
                    Purchased On
                  </Table.Cell>
                  <Table.Cell sx={{ minWidth: 200 }}>Purchased At</Table.Cell>
                  <Table.Cell sx={{ minWidth: 150 }}>Notes</Table.Cell>
                </Table.Row>
              </Table.Head>

              <Table.Body>
                {!isTableLoading ? (
                  dataSetup &&
                  dataSetup.components.map((component) => (
                    <Table.Row
                      hover
                      key={`setup-${dataSetup.uuid}-${component.id}`}
                    >
                      <Table.Cell>{component.type}</Table.Cell>
                      <Table.Cell>{component.name}</Table.Cell>
                      <Table.Cell>{component.description}</Table.Cell>
                      <Table.Cell sx={{ textAlign: "right" }}>
                        {component.priceFormatted}
                      </Table.Cell>
                      <Table.Cell sx={{ textAlign: "center" }}>
                        {component.count}
                      </Table.Cell>
                      <Table.Cell sx={{ textAlign: "right" }}>
                        {component.priceEstimateFormatted}
                      </Table.Cell>
                      <Table.Cell sx={{ textAlign: "center" }}>
                        {component.purchaseDate
                          ? format(
                              new Date(component.purchaseDate),
                              "MMM dd, yyyy",
                            )
                          : ""}
                      </Table.Cell>
                      <Table.Cell sx={{ whiteSpace: "nowrap" }}>
                        {component.purchaseLocation}
                      </Table.Cell>
                      <Table.Cell>{component.purchaseNotes}</Table.Cell>
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

export default PcSetup;
