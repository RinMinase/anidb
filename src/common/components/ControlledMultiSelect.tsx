import { Control, Controller } from "react-hook-form";

import {
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
} from "@mui/material";

import { randomAlphaString } from "@components";

type Props = {
  control: Control<any>;
  name: string;
  options?: Array<{
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

const ControlledMultiSelect = (props: Props) => {
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
            renderValue={(selected: Array<string>) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip
                    key={value}
                    size="small"
                    label={props.options?.find((i) => i.value === value)?.label}
                  />
                ))}
              </Box>
            )}
            label={props.label}
            error={props.error}
            disabled={props.disabled}
            displayEmpty={props.displayEmpty}
            multiple
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
                      <Checkbox checked={field.value.includes(item.value)} />
                      <ListItemText primary={item.label} />
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

export default ControlledMultiSelect;
