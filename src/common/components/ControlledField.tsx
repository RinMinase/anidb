import { MutableRef } from "preact/hooks";
import { Control, Controller } from "react-hook-form";
import { OutlinedInput, SxProps, TextField, Theme } from "@mui/material";

type Props = {
  inputRef?: MutableRef<HTMLInputElement | undefined>;
  control: Control<any>;
  name: string;
  numeric?: boolean;
  allowPeriod?: boolean;
  variant?: "outlined" | "standard" | "filled";
  size?: "small" | "medium";
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  minRows?: number;
  maxRows?: number;
  fullWidth?: boolean;
  maxLength?: number;
  outlinedInput?: boolean;
  endAdornment?: any;
  maxHeight?: number;
  decimalPlaces?: number;
  sx?: SxProps<Theme>;
  slotProps?: any;
};

export const disableNonNumeric = (
  e: any,
  allowPeriod?: boolean,
  decimalPlaces?: number,
) => {
  const el = e.target as HTMLInputElement;
  let value = el.value;

  if (allowPeriod) {
    value = value.replace(/[^0-9.]/g, "");

    const parts = value.split(".");
    if (parts.length > 2) {
      // remove other instance of periods
      value = `${parts[0]}.${parts.slice(1).join("")}`;
    }

    if (decimalPlaces !== undefined && value.includes(".")) {
      const [integer, fraction] = value.split(".");
      value = `${integer}.${fraction.slice(0, decimalPlaces)}`;
    }
  } else {
    value = value.replace(/\D/g, "");
  }

  el.value = value;
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
              maxLength: props.maxLength,
            },
          };
        }

        if (!props.outlinedInput) {
          return (
            <TextField
              {...numericProps}
              inputRef={props.inputRef}
              variant={props.variant ?? "outlined"}
              size={props.size}
              label={props.label}
              helperText={props.helperText}
              error={props.error}
              disabled={props.disabled}
              multiline={props.multiline}
              minRows={props.minRows}
              maxRows={props.maxRows}
              fullWidth={props.fullWidth}
              value={value}
              sx={{ maxHeight: props.maxHeight, ...props.sx }}
              onChange={(e) => {
                if (props.numeric) {
                  disableNonNumeric(e, props.allowPeriod, props.decimalPlaces);
                }

                onChange(e);
              }}
              slotProps={{
                input: {
                  endAdornment: props.endAdornment,
                },
                ...props.slotProps,
              }}
            />
          );
        }

        return (
          <OutlinedInput
            {...numericProps}
            inputRef={props.inputRef}
            label={props.label}
            size={props.size}
            error={props.error}
            disabled={props.disabled}
            fullWidth={props.fullWidth}
            endAdornment={props.endAdornment}
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
