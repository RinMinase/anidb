// commit to change to lf
import { useEffect, useState } from "preact/hooks";
import { Grid2 as Grid, Paper } from "@mui/material";
import { toast } from "sonner";
import { Trash as DeleteIcon, Edit as EditIcon } from "react-feather";
import axios from "axios";

import { Dialog, IconButton, Table } from "@components";

import { PCComponentType, PCComponentTypeList } from "../types";

import ComponentTypesEditDialog from "./ComponentTypesEditDialog";
import ComponentTypesForm from "./ComponentTypesForm";

const ComponentsTypesTab = () => {
  const [isTableLoading, setTableLoading] = useState(true);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [data, setData] = useState<PCComponentTypeList>([]);
  const [selectedData, setSelectedData] = useState<PCComponentType>();

  const fetchData = async () => {
    try {
      setTableLoading(true);

      const {
        data: { data },
      } = await axios.get("/pc/types");

      setData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const handleEditClick = (item: PCComponentType) => {
    setSelectedData(item);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (item: PCComponentType) => {
    setDeleteDialogOpen(true);
    setSelectedData(item);
  };

  const handleDeleteSubmit = async () => {
    try {
      setTableLoading(true);
      setDeleteDialogOpen(false);

      await axios.delete(`/pc/types/${selectedData?.id}`);
      toast.success("Success");
      await fetchData();
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
          <ComponentTypesForm
            isTableLoading={isTableLoading}
            fetchData={fetchData}
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
                  <Table.Cell sx={{ minWidth: 150, textAlign: "center" }}>
                    Is Peripheral
                  </Table.Cell>
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
                      <Table.Cell>{item.type}</Table.Cell>
                      <Table.Cell>{item.name}</Table.Cell>
                      <Table.Cell sx={{ textAlign: "center" }}>
                        {`${item.isPeripheral}`.toUpperCase()}
                      </Table.Cell>
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

      <ComponentTypesEditDialog
        isEditDialogOpen={isEditDialogOpen}
        setEditDialogOpen={setEditDialogOpen}
        data={selectedData}
        fetchData={fetchData}
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

export default ComponentsTypesTab;
