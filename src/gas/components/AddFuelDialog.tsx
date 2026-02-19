import { useState } from "preact/hooks";
import { X as CloseIcon } from "react-feather";

import {
  DialogContent,
  DialogTitle,
  Modal,
  Paper,
  styled,
} from "@mui/material";

import { IconButton } from "@components";

import AddFuelForm from "./AddFuelForm";

const CustomDialog = styled(Paper)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
});

type Props = {
  open: boolean;
  onClose: () => void;
  refreshData: () => void;
};

const AddFuelDialog = (props: Props) => {
  const { open, onClose, refreshData } = props;

  const [loading, setLoading] = useState(false);

  return (
    <Modal
      open={open}
      onClose={onClose}
      disableRestoreFocus
      disableEnforceFocus
    >
      <CustomDialog>
        <DialogTitle display="flex" justifyContent="space-between">
          Add Fuel Data
          <IconButton
            disabled={loading}
            onClick={onClose}
            children={<CloseIcon size={20} />}
          />
        </DialogTitle>
        <DialogContent>
          <AddFuelForm
            loading={loading}
            setLoading={setLoading}
            refreshData={refreshData}
            onClose={onClose}
          />
        </DialogContent>
      </CustomDialog>
    </Modal>
  );
};

export default AddFuelDialog;
