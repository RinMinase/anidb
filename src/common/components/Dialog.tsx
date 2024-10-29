import { Dispatch, StateUpdater } from "preact/hooks";
import { forwardRef } from "preact/compat";

import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Dialog as MuiDialog,
  Grow,
} from "@mui/material";

type Props = {
  type?: "error" | "warning" | "info";
  open: boolean;
  setOpen: Dispatch<StateUpdater<boolean>>;
  title?: string;
  text: string;
  onSubmit: (evt?: any) => void;
  hideCancel?: boolean;
};

const Transition = forwardRef((props: any, ref) => {
  return <Grow ref={ref} {...props} />;
});

const Dialog = (props: Props) => {
  return (
    <MuiDialog open={props.open} TransitionComponent={Transition}>
      {props.title && (
        <DialogTitle textAlign="center">{props.title}</DialogTitle>
      )}
      <DialogContent sx={{ pb: 2, textAlign: "center", maxWidth: 400 }}>
        {props.text}
      </DialogContent>
      <DialogActions
        sx={{ justifyContent: "center", gap: 2, pb: 2 }}
        disableSpacing
      >
        <Button
          variant="contained"
          color={props.type ?? "error"}
          sx={{ width: 90 }}
          onClick={props.onSubmit}
        >
          OK
        </Button>
        <Button
          variant="contained"
          color="secondary"
          sx={{ width: 90 }}
          onClick={() => props.setOpen(false)}
        >
          Cancel
        </Button>
      </DialogActions>
    </MuiDialog>
  );
};

export default Dialog;
