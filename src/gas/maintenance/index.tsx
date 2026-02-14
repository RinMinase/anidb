import { useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { Grid } from "@mui/material";
import axios from "axios";

import { Dialog } from "@components";

import { Data, Item } from "./types";
import AddForm from "./components/AddForm";
import ViewTable from "./components/ViewTable";
import EditDialog from "./components/EditDialog";

const ViewMaintenanceTab = () => {
  const [isTableLoading, setTableLoading] = useState(true);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [data, setData] = useState<Data>([]);
  const [selectedData, setSelectedData] = useState<Item>();

  const fetchData = async () => {
    setTableLoading(true);

    try {
      const {
        data: { data },
      } = await axios.get("/gas/maintenance");

      setData(() => data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setTableLoading(false);
    }
  };

  const handleEditClick = (item: Item) => {
    setSelectedData(item);
    setEditDialogOpen(true);
  };

  const handleDeleteClick = (item: Item) => {
    setSelectedData(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      setDeleteDialogOpen(false);
      setTableLoading(true);

      await axios.delete(`/gas/maintenance/${selectedData?.id}`);
      toast.success("Success");

      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 5, md: 3 }}>
          <AddForm refreshData={fetchData} isRefreshLoading={isTableLoading} />
        </Grid>
        <Grid size={{ xs: 12, sm: 7, md: 9 }}>
          <ViewTable
            data={data}
            loading={isTableLoading}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
        </Grid>
      </Grid>

      {selectedData && (
        <EditDialog
          id={selectedData.id}
          open={isEditDialogOpen}
          refreshData={fetchData}
          handleClose={() => setEditDialogOpen(false)}
        />
      )}

      <Dialog
        title="Are you sure?"
        text="This content would be deleted."
        onSubmit={handleDeleteSubmit}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </>
  );
};

export default ViewMaintenanceTab;
