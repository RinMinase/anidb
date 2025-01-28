import { Paper, Stack, Typography } from "@mui/material";
import { useContext, useState } from "preact/hooks";
import { toast } from "sonner";
import { format } from "date-fns";
import { route } from "preact-router";
import axios from "axios";

import {
  Copy as DuplicateIcon,
  Edit as EditIcon,
  Trash2 as DeleteIcon,
} from "react-feather";

import {
  Button,
  ButtonLoading,
  Dialog,
  GlobalLoaderContext,
  Table,
} from "@components";

import { PCInfo } from "../types";

type Props = {
  isTableLoading: boolean;
  fetchData: () => Promise<void>;
  data?: PCInfo;
};

const SetupTable = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleteLoading, setDeleteLoading] = useState(false);

  const handleDuplicateClick = async () => {
    try {
      if (props.data) {
        toggleLoader(true);

        await axios.post(`/pc/infos/${props.data.uuid}/duplicate`);
        await props.fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleEditClick = () => {
    if (props.data) {
      route(`/pc-setups/${props.data.owner.uuid}/edit/${props.data.uuid}`);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      if (props.data) {
        setDeleteLoading(true);
        setDeleteDialogOpen(false);
        await axios.delete(`/pc/infos/${props.data.uuid}`);
        toast.success("Success");

        props.fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Stack
        direction="row"
        pb={2}
        justifyContent="space-between"
        alignItems="end"
      >
        <Typography
          variant="h6"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {props.data?.label || ""}
        </Typography>

        <Stack direction="row" spacing={1.5} sx={{ pl: { xs: 0, lg: 2 } }}>
          <Button
            variant="contained"
            color="secondary"
            disabled={isLoading || isDeleteLoading || props.isTableLoading}
            onClick={() => (props.data ? handleDuplicateClick() : null)}
          >
            <DuplicateIcon size={18} />
            <Typography variant="button" ml={1}>
              Duplicate
            </Typography>
          </Button>
          <Button
            variant="contained"
            color="warning"
            disabled={isLoading || isDeleteLoading || props.isTableLoading}
            onClick={() => (props.data ? handleEditClick() : null)}
          >
            <EditIcon size={18} />
            <Typography variant="button" ml={1}>
              Edit
            </Typography>
          </Button>
          <ButtonLoading
            variant="contained"
            color="error"
            loading={isDeleteLoading}
            disabled={isLoading || isDeleteLoading || props.isTableLoading}
            onClick={() => (props.data ? setDeleteDialogOpen(true) : null)}
          >
            <DeleteIcon size={18} />
            <Typography variant="button" ml={1}>
              Delete
            </Typography>
          </ButtonLoading>
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
            {!props.isTableLoading ? (
              props.data &&
              props.data.components.map((component) => (
                <Table.Row
                  hover
                  key={`setup-${props.data!.uuid}-${component.id}`}
                >
                  <Table.Cell>{component.type.name ?? ""}</Table.Cell>
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
                      ? format(new Date(component.purchaseDate), "MMM dd, yyyy")
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

      <Dialog
        title="Are you sure?"
        text="This PC setup would be deleted."
        onSubmit={handleDeleteSubmit}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </>
  );
};

export default SetupTable;
