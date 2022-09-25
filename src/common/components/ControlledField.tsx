import { Control, Controller } from "react-hook-form";

import { TextField } from "@mui/material";

type Props = {
  control: Control<any>;
  name: string;
  variant?: "outlined" | "standard" | "filled";
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  fullWidth?: boolean;
};

const ControlledField = (props: Props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value } }) => (
        <TextField
          variant={props.variant ?? "outlined"}
          onChange={onChange}
          label={props.label}
          helperText={props.helperText}
          error={props.error}
          disabled={props.disabled}
          multiline={props.multiline}
          minRows={props.minRows}
          maxRows={props.maxRows}
          fullWidth={props.fullWidth}
          value={value}
        />
      )}
    />
  );
};

export default ControlledField;