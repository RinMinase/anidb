import { Alert as MuiAlert, AlertColor, styled } from "@mui/material";

export type AlertProps = {
  onClose?: () => void;
  open: boolean;
  message?: string;
  severity?: AlertColor;
};

const CustomAlert = styled(MuiAlert)({
  alignItems: "center",
});

const Alert = (props: AlertProps) => {
  return (
    <>
      {props.open && (
        <CustomAlert
          onClose={props.onClose}
          severity={props.severity || "success"}
        >
          {props.message || "Success!"}
        </CustomAlert>
      )}
    </>
  );
};

export default Alert;
