import { Control, Controller } from "react-hook-form";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import { randomAlphaString } from "@components";

export type OptionsProps =
  | string[]
  | Array<{
      label: string;
      key?: any;
      value?: number | string;
    }>;

export type OptionsKeyedProps = Array<{
  label: string;
  key?: any;
  value?: number | string;
}>;

type Props = {
  control: Control<any>;
  name: string;
  options?:
    | string[]
    | Array<{
        label: string;
        key?: any;
        value?: number | string;
      }>;
  variant?: "outlined" | "standard" | "filled";
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  displayEmpty?: boolean;
  fullWidth?: boolean;
  size?: "small" | "medium";
};

const id = randomAlphaString();

const ControlledSelect = (props: Props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field }) => (
        <FormControl fullWidth={props.fullWidth} size={props.size}>
          <InputLabel id={id}>{props.label}</InputLabel>
          <Select
            id={id}
            variant={props.variant ?? "outlined"}
            label={props.label}
            error={props.error}
            disabled={props.disabled}
            displayEmpty={props.displayEmpty}
            {...field}
          >
            {props.options &&
              props.options.map((item) => {
                if (typeof item === "object") {
                  return (
                    <MenuItem
                      value={item.value ?? item.label}
                      key={item.key ?? item.label}
                    >
                      {item.label}
                    </MenuItem>
                  );
                }

                return (
                  <MenuItem value={item} key={`dropdown-${item}`}>
                    {item}
                  </MenuItem>
                );
              })}
          </Select>
          {props.error && (
            <FormHelperText error>{props.helperText}</FormHelperText>
          )}
        </FormControl>
      )}
    />
  );
};

export default ControlledSelect;
