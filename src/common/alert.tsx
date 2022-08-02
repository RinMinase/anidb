import { Alert as MuiAlert, AlertColor } from "@mui/material";

export type AlertProps = {
  onClose?: () => void;
  open: boolean;
  message: string;
  severity?: AlertColor;
};

const Alert = (props: AlertProps) => {
  return (
    <>
      {props.open && (
        <MuiAlert onClose={props.onClose} severity={props.severity || "success"}>
          {props.message || "Success!"}
        </MuiAlert>
      )}
    </>
  );
};

export default Alert;
