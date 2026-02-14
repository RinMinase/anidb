import { Box, Paper, Tooltip, useTheme } from "@mui/material";
import { Trash as DeleteIcon, Edit as EditIcon } from "react-feather";

import { IconButton, Table } from "@components";
import { Data, Item } from "../types";

import AcCoolantIcon from "@components/icons/images/maintenance/ac_coolant.png";
import BatteryIcon from "@components/icons/images/maintenance/battery.png";
import BrakeFluidIcon from "@components/icons/images/maintenance/brake_fluid.png";
import BrakeSandingIcon from "@components/icons/images/maintenance/brake_sanding.png";
import EngineOilIcon from "@components/icons/images/maintenance/engine_oil.png";
import EngineWashIcon from "@components/icons/images/maintenance/engine_wash.png";
import LightsChangeIcon from "@components/icons/images/maintenance/lights_change.png";
import OthersIcon from "@components/icons/images/maintenance/others.png";
import PowerSteeringFluidIcon from "@components/icons/images/maintenance/power_steering_fluid.png";
import RadiatorFluidIcon from "@components/icons/images/maintenance/radiator_fluid.png";
import SparkPlugsIcon from "@components/icons/images/maintenance/spark_plugs.png";
import TiresChangeIcon from "@components/icons/images/maintenance/tires_change.png";
import TiresRotationIcon from "@components/icons/images/maintenance/tires_rotation.png";
import TransmissionIcon from "@components/icons/images/maintenance/transmission.png";
import WiperChangeIcon from "@components/icons/images/maintenance/wiper_change.png";
import { useState } from "preact/hooks";

type MntProps = {
  type: string;
  label: string;
  dark: boolean;
};

const MaintenanceIcon = (props: MntProps) => {
  const { type, label, dark } = props;

  const IconBase = ({ src }: { src: string }) => (
    <Tooltip arrow placement="top" title={label}>
      <img
        src={src}
        style={{
          width: 32,
          height: 32,
          filter: dark ? "invert(1)" : undefined,
        }}
      />
    </Tooltip>
  );

  if (type === "ac_coolant") return <IconBase src={AcCoolantIcon} />;
  if (type === "battery") return <IconBase src={BatteryIcon} />;
  if (type === "brake_fluid") return <IconBase src={BrakeFluidIcon} />;
  if (type === "brake_sanding") return <IconBase src={BrakeSandingIcon} />;
  if (type === "engine_oil") return <IconBase src={EngineOilIcon} />;
  if (type === "engine_wash") return <IconBase src={EngineWashIcon} />;
  if (type === "lights_change") return <IconBase src={LightsChangeIcon} />;
  if (type === "others") return <IconBase src={OthersIcon} />;
  if (type === "radiator_fluid") return <IconBase src={RadiatorFluidIcon} />;
  if (type === "spark_plugs") return <IconBase src={SparkPlugsIcon} />;
  if (type === "tires_change") return <IconBase src={TiresChangeIcon} />;
  if (type === "tires_rotation") return <IconBase src={TiresRotationIcon} />;
  if (type === "transmission") return <IconBase src={TransmissionIcon} />;
  if (type === "wiper_change") return <IconBase src={WiperChangeIcon} />;
  if (type === "power_steering_fluid")
    return <IconBase src={PowerSteeringFluidIcon} />;

  return null;
};

type Props = {
  data: Data;
  loading: boolean;
  handleEditClick: (item: Item) => void;
  handleDeleteClick: (item: Item) => void;
};

const ViewTable = (props: Props) => {
  const { data, loading, handleEditClick, handleDeleteClick } = props;

  const theme = useTheme();

  const [isTextMode, setTextMode] = useState(false);

  return (
    <Table.Container
      component={Paper}
      sx={{
        maxHeight: {
          xs: undefined,
          /*
           * Calculation Description:
           * 48px - navbar
           * 48px - container padding
           * 49px - page heading
           * 48px - tab heading
           * 32px - tab spacing
           */
          md: "calc(100vh - 48px - 48px - 49px - 48px - 32px)",
        },
        overflow: {
          xs: undefined,
          md: "scroll",
        },
      }}
    >
      <Table.Element sx={{ minWidth: 650 }}>
        <Table.Head>
          <Table.Row>
            <Table.Cell sx={{ minWidth: 120 }}>Date</Table.Cell>
            <Table.Cell>Description</Table.Cell>
            <Table.Cell align="center">Odometer</Table.Cell>
            <Table.Cell>Parts</Table.Cell>
            <Table.Cell />
          </Table.Row>
        </Table.Head>

        <Table.Body>
          {!loading ? (
            data.map((item) => (
              <Table.Row hover key={`maintenance-${item.id}`}>
                <Table.Cell>{item.date}</Table.Cell>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell align="center">{item.odometer}</Table.Cell>
                <Table.Cell sx={{ maxWidth: 300 }}>
                  {isTextMode ? (
                    <div
                      style={{ cursor: "pointer" }}
                      onClick={() => setTextMode(false)}
                    >
                      {item.partSummaryLabels.join(", ")}
                    </div>
                  ) : (
                    <Box
                      display="flex"
                      flexWrap="wrap"
                      gap={2}
                      style={{ cursor: "pointer" }}
                      onClick={() => setTextMode(true)}
                    >
                      {item.parts.map(({ type, label }) => (
                        <MaintenanceIcon
                          key={`mnt-${item.id}-${type}`}
                          type={type}
                          label={label}
                          dark={theme.palette.mode === "dark"}
                        />
                      ))}
                    </Box>
                  )}
                </Table.Cell>
                <Table.Cell sx={{ textAlign: "right" }}>
                  <Box display="flex">
                    <IconButton
                      size="small"
                      onClick={() => handleEditClick(item)}
                      children={<EditIcon size={20} />}
                    />
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteClick(item)}
                      sx={{ ml: 1 }}
                      children={<DeleteIcon size={20} />}
                    />
                  </Box>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Loader />
          )}
        </Table.Body>
      </Table.Element>
    </Table.Container>
  );
};

export default ViewTable;
