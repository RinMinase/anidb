import { Alert, Snackbar as MuiSnackbar, styled } from "@mui/material";

type Props = {
  onClose: () => void;
  open: boolean;
  message: string;
  duration?: number;
  severity?: "error" | "warning" | "info" | "success";
};

const StyledAlert = styled(Alert)({
  width: "100%",
});

const Snackbar = (props: Props) => {
  return (
    <MuiSnackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      onClose={props.onClose}
      autoHideDuration={props.duration || 5000}
      open={props.open}
    >
      <StyledAlert onClose={props.onClose} severity={props.severity}>
        {props.message || "Success!"}
      </StyledAlert>
    </MuiSnackbar>
  );
};

export default Snackbar;
