import { Control, Controller } from "react-hook-form";

import { Autocomplete, TextField } from "@mui/material";

type Props = {
  control: Control<any>;
  options: Array<{
    value: string;
    label: string;
  }>;
  name: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  freeSolo?: boolean;
  loadingContents?: boolean;
  onChange?: (e?: any) => void;
};

const ControlledAutocomplete = (props: Props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field: { onChange } }) => (
        <Autocomplete
          onChange={(e, data: any) => onChange(data.value)}
          onInputChange={
            !props.freeSolo
              ? undefined
              : (e, data) => {
                  if (data) onChange(data);
                }
          }
          options={props.options}
          freeSolo={props.freeSolo}
          disabled={props.disabled}
          fullWidth={props.fullWidth}
          loading={props.loadingContents}
          getOptionLabel={(option: any) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={props.onChange}
              label={props.label}
              helperText={props.helperText}
              error={props.error}
            />
          )}
        />
      )}
    />
  );
};

export default ControlledAutocomplete;
