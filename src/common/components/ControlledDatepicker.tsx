import { Control, Controller } from "react-hook-form";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { TextField } from "@mui/material";

type Props = {
  control: Control<any>;
  name: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  disableFuture?: boolean;
  size?: "medium" | "small";
  fullWidth?: boolean;
};

const ControlledDatepicker = (props: Props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value } }) => (
        <LocalizationProvider dateAdapter={AdapterDateFns as any}>
          <DesktopDatePicker
            inputFormat="MM/dd/yyyy"
            onChange={onChange}
            label={props.label}
            disabled={props.disabled}
            disableFuture={props.disableFuture}
            value={value}
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth={props.fullWidth}
                size={props.size || "medium"}
                helperText={props.helperText}
                error={props.error}
              />
            )}
          />
        </LocalizationProvider>
      )}
    />
  );
};

export default ControlledDatepicker;
