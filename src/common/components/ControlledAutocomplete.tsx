import { Control, Controller } from "react-hook-form";

import { Autocomplete, TextField } from "@mui/material";

type Props = {
  control: Control<any>;
  options: Array<string>;
  name: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  freeSolo?: boolean;
  loadingContents?: boolean;
  onChange?: (e?: any) => void;
  extraOnChange?: (e?: any) => void;
};

const ControlledAutocomplete = (props: Props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={null}
      render={({ field: { onChange, value } }) => {
        return (
          <Autocomplete
            value={value}
            onChange={(e, data: any) => {
              if (props.extraOnChange) props.extraOnChange();
              return onChange(data);
            }}
            onInputChange={(e, data) => {
              if (data) onChange(data);
            }}
            options={props.options}
            freeSolo={props.freeSolo}
            disabled={props.disabled}
            fullWidth={props.fullWidth}
            loading={props.loadingContents}
            renderInput={(params) => (
              // @ts-expect-error: Unknown error
              <TextField
                {...params}
                onChange={props.onChange}
                label={props.label}
                helperText={props.helperText}
                error={props.error}
              />
            )}
          />
        );
      }}
    />
  );
};

export default ControlledAutocomplete;
