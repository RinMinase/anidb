import { useState } from "preact/hooks";
import { Trash as DeleteIcon, Edit as EditIcon } from "react-feather";
import { Box, Paper, Tooltip, useTheme } from "@mui/material";

import { IconButton, Table } from "@components";
import { Data, Item } from "../types";

type MntProps = {
  type: string;
  label: string;
  dark: boolean;
};

const Icons = import.meta.glob("/src/common/icons/images/maintenance/*.png", {
  eager: true,
  import: "default",
});

const MaintenanceIcon = (props: MntProps) => {
  const { type, label, dark } = props;

  const path = `/src/common/icons/images/maintenance/${type}.png`;
  const src = Icons[path] as string;

  if (!src) return null;

  return (
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
