import { Control, Controller } from "react-hook-form";

import { TextField } from "@mui/material";

type Props = {
  control: Control<any>;
  name: string;
  numeric?: boolean;
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

const disableNonNumeric = (e: any) => {
  const el = e.target as HTMLInputElement;
  const value = el.value;

  el.value = value.replaceAll(/\D/g, "");
};

const ControlledField = (props: Props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        let numericProps = {};

        if (props.numeric) {
          numericProps = {
            type: "tel",
            inputProps: {
              pattern: "[0-9]*",
              inputMode: "numeric",
            }
          };
        }

        return (
          <TextField
            {...numericProps}
            variant={props.variant ?? "outlined"}
            label={props.label}
            helperText={props.helperText}
            error={props.error}
            disabled={props.disabled}
            multiline={props.multiline}
            minRows={props.minRows}
            maxRows={props.maxRows}
            fullWidth={props.fullWidth}
            value={value}
            onChange={(e) => {
              if (props.numeric) disableNonNumeric(e);
              onChange(e);
            }}
          />
        );
      }}
    />
  );
};

export default ControlledField;
