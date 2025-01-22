import { useContext, useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { format } from "date-fns";
import axios from "axios";

import {
  Box,
  Grid2 as Grid,
  MenuItem,
  MenuList,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";

import {
  Copy as DuplicateIcon,
  Edit as EditIcon,
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

import { PCInfo, PCInfoStats, PCOwnerList } from "./types";

import CpuImageIcon from "@components/icons/images/cpu.png";
import GpuImageIcon from "@components/icons/images/gpu.png";
import HddImageIcon from "@components/icons/images/hdd.png";
import RamImageIcon from "@components/icons/images/ram.png";

type HighlightsTileProps = {
  imageSrc: string;
  value: string;
  isLoading: boolean;
};

const ShowIcon = <Eye size={20} strokeWidth={1.5} />;
const HideIcon = <EyeOff size={20} strokeWidth={1.5} />;

const PcSetup = () => {
  const theme = useTheme();

  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [dataOwners, setDataOwners] = useState<PCOwnerList>([]);
  const [dataSetup, setDataSetup] = useState<PCInfo>();
  const [stats, setStats] = useState<PCInfoStats>();
  const [showHidden, setShowHidden] = useState(false);
  const [isTableLoading, setTableLoading] = useState(true);
  const [selectedInfo, setSelectedInfo] = useState<string>();
  const [selectedInfoLabel, setSelectedInfoLabel] = useState<string>();

  const fetchDataInfo = async (uuid: string) => {
    setSelectedInfo(uuid);
    setTableLoading(true);

    try {
      const {
        data: { data, stats },
      } = await axios.get(`/pc/infos/${uuid}`);

      setDataSetup(data);
      setStats(stats);
      setSelectedInfoLabel(data.label);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchData = async (hidden?: boolean) => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = (await axios.get("/pc/owners", {
        params: { show_hidden: hidden ?? false },
      })) as {
        data: { data: PCOwnerList };
      };

      setDataOwners(data);

      if (selectedInfo) {
        let selectedInfoPresent = false;
        data.forEach((item) => {
          item.infos.forEach((info) => {
            if (info.uuid === selectedInfo) {
              selectedInfoPresent = true;
            }
          });
        });

        if (selectedInfoPresent) {
          fetchDataInfo(selectedInfo);
          return;
        }
      }

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
    fetchData(!showHidden);
    setShowHidden((prev) => !prev);
  };

  const handleAddSetupClick = (uuid: string) => {
    console.log(uuid);
  };

  const handleDeleteOwnerClick = (uuid: string) => {
    console.log(uuid);
  };

  const handleHideSetupClick = async (uuid: string) => {
    try {
      toggleLoader(true);

      await axios.put(`/pc/infos/${uuid}/hide`);
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleDuplicateSetupClick = async () => {
    try {
      if (selectedInfo) {
        toggleLoader(true);

        await axios.post(`/pc/infos/${selectedInfo}/duplicate`);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleEditSetupClick = () => {};

  const handleDeleteSetupClick = () => {};

  // const handleDeleteSetupSubmit = () => {};

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

  const HighlightsTile = (highlightsTileProps: HighlightsTileProps) => (
    <Grid
      size={{ xs: 6 }}
      component={Paper}
      display="flex"
      alignItems="center"
      gap={1}
      sx={{ p: 1 }}
    >
      <img
        src={highlightsTileProps.imageSrc}
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
        width="100%"
      >
        {highlightsTileProps.isLoading ? (
          <Skeleton animation="wave" />
        ) : (
          highlightsTileProps.value
        )}
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
            sx={{
              padding: 0,
              overflowY: "auto",
              width: "100%",

              // Calculation Description:
              // 48px - navbar
              // 48px - container padding
              // 52.5px - page heading
              height: "calc(100vh - 48px - 48px - 52.5px)",
            }}
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
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        width: "100%",
                      }}
                    >
                      <Typography
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {info.label}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => handleHideSetupClick(info.uuid)}
                        children={info.isHidden ? ShowIcon : HideIcon}
                      />
                    </Box>
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
                value={stats?.totalSetupCostFormat || ""}
                isLoading={isTableLoading || isLoading}
                mediumText
                noTopMargin
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <DashboardTile
                heading="Total System Cost"
                value={stats?.totalSystemCostFormat || ""}
                footerLeft="Peripheral Cost"
                footerRight={stats?.totalPeripheralCostFormat || ""}
                isLoading={isTableLoading || isLoading}
                isFooterRightLoading={isTableLoading || isLoading}
                footerFontSize={13}
                mediumText
                noTopMargin
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }} display="flex" alignItems="center">
              <Grid container spacing={1} width="100%">
                <HighlightsTile
                  imageSrc={CpuImageIcon}
                  isLoading={isTableLoading || isLoading}
                  value={stats?.highlightCpu || ""}
                />
                <HighlightsTile
                  imageSrc={GpuImageIcon}
                  isLoading={isTableLoading || isLoading}
                  value={stats?.highlightGpu || ""}
                />
                <HighlightsTile
                  imageSrc={RamImageIcon}
                  isLoading={isTableLoading || isLoading}
                  value={stats?.highlightRam || ""}
                />
                <HighlightsTile
                  imageSrc={HddImageIcon}
                  isLoading={isTableLoading || isLoading}
                  value={stats?.highlightStorage || ""}
                />
              </Grid>
            </Grid>
          </Grid>

          <Stack
            direction="row"
            pb={2}
            justifyContent="space-between"
            alignItems="end"
          >
            <Typography variant="h6">{selectedInfoLabel}</Typography>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                color="secondary"
                onClick={() =>
                  selectedInfo ? handleDuplicateSetupClick() : null
                }
              >
                <DuplicateIcon size={18} />
                <Typography variant="button" ml={1}>
                  Duplicate
                </Typography>
              </Button>
              <Button
                variant="contained"
                color="warning"
                onClick={() => (selectedInfo ? handleEditSetupClick() : null)}
              >
                <EditIcon size={18} />
                <Typography variant="button" ml={1}>
                  Edit
                </Typography>
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => (selectedInfo ? handleDeleteSetupClick() : null)}
              >
                <DeleteIcon size={18} />
                <Typography variant="button" ml={1}>
                  Delete
                </Typography>
              </Button>
            </Stack>
          </Stack>

          {/*
           * Calculation Description:
           * 48px - navbar
           * 48px - container padding
           * 52.5px - page heading
           * 169px - page tiles
           * 52.5px - page buttons
           */}
          <Table.Container
            component={Paper}
            sx={{
              height: "100%",
              maxHeight: "calc(100vh - 48px - 48px - 52.5px - 169px - 52.5px)",
            }}
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
