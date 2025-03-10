// commit to change to lf
import { useEffect, useState } from "preact/hooks";
import { Grid2 as Grid, Paper } from "@mui/material";
import { Dialog, IconButton, OptionsKeyedProps, Table } from "@components";
import { Trash as DeleteIcon, Edit as EditIcon } from "react-feather";
import { toast } from "sonner";
import axios from "axios";

import { PCComponent, PCComponentList, PCComponentTypeList } from "../types";

import ComponentsListForm from "./ComponentsListForm";
import ComponentsListEditDialog from "./ComponentsListEditDialog";

const ComponentsListTab = () => {
  const [isTableLoading, setTableLoading] = useState(true);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [data, setData] = useState<PCComponentList>([]);
  const [selectedData, setSelectedData] = useState<PCComponent>();
  const [componentTypes, setComponentTypes] = useState<OptionsKeyedProps>([]);

  const fetchComponents = async () => {
    try {
      setTableLoading(true);

      const {
        data: { data },
      } = await axios.get("/pc/components");

      setData(() => data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const fetchComponentTypes = async () => {
    const {
      data: { data },
    } = (await axios.get("/pc/types")) as {
      data: { data: PCComponentTypeList };
    };

    setComponentTypes(
      data.map((type) => ({
        label: type.name,
        key: `type-${type.id}`,
        value: type.id,
      })),
    );
  };

  const fetchData = async () => {
    try {
      setTableLoading(true);
      await Promise.all([fetchComponents(), fetchComponentTypes()]);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const handleEditClick = (item: PCComponent) => {
    setSelectedData(item);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (item: PCComponent) => {
    setDeleteDialogOpen(true);
    setSelectedData(item);
  };

  const handleDeleteSubmit = async () => {
    try {
      setTableLoading(true);
      setDeleteDialogOpen(false);

      await axios.delete(`/pc/components/${selectedData?.id}`);
      toast.success("Success");
      await fetchComponents();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <ComponentsListForm
            isTableLoading={isTableLoading}
            fetchData={fetchComponents}
            types={componentTypes}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
          {/*
           * Calculation Description:
           * 48px - navbar
           * 48px - container padding
           * 49px - page heading
           * 48px - tab heading
           * 32px - tab padding
           */}
          <Table.Container
            component={Paper}
            sx={{
              height: "100%",
              maxHeight: "calc(100vh - 48px - 48px - 49px - 48px - 32px)",
            }}
          >
            <Table.Element size="small" sx={{ minWidth: 650 }}>
              <Table.Head>
                <Table.Row>
                  <Table.Cell sx={{ minWidth: 100 }} />
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
                  data.map((item) => (
                    <Table.Row hover key={`component-${item.id}`}>
                      <Table.Cell>
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
                      </Table.Cell>
                      <Table.Cell>{item.type.name}</Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell>{item.description}</Table.Cell>
                      <Table.Cell sx={{ textAlign: "right" }}>
                        {item.priceFormatted}
                      </Table.Cell>
                      <Table.Cell sx={{ textAlign: "center" }}>
                        {item.count}
                      </Table.Cell>
                      <Table.Cell sx={{ textAlign: "right" }}>
                        {item.priceEstimateFormatted}
                      </Table.Cell>
                      <Table.Cell sx={{ textAlign: "center" }}>
                        {item.purchaseDateFormatted}
                      </Table.Cell>
                      <Table.Cell sx={{ whiteSpace: "nowrap" }}>
                        {item.purchaseLocation}
                      </Table.Cell>
                      <Table.Cell>{item.purchaseNotes}</Table.Cell>
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

      <ComponentsListEditDialog
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        types={componentTypes}
        data={selectedData}
        fetchData={fetchComponents}
      />

      <Dialog
        title="Are you sure?"
        text={`${selectedData?.name} would be deleted.`}
        onSubmit={handleDeleteSubmit}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </>
  );
};

export default ComponentsListTab;
