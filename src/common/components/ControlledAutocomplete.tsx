import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { Autocomplete, TextField } from "@mui/material";

type Props<T extends FieldValues, O> = {
  control: Control<T>;
  name: Path<T>;
  options: O[];
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  freeSolo?: boolean;
  size?: "small" | "medium";
  loadingContents?: boolean;
  onChange?: (e?: any) => void;
  extraOnChange?: (e?: any) => void;
  extraOnInputChange?: (e?: any, data?: string) => void;
};

const ControlledAutocomplete = <T extends FieldValues, O>(
  props: Props<T, O>,
) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue={null as any}
      render={({ field: { onChange, value } }) => {
        return (
          <Autocomplete
            value={value}
            onChange={(_e, data: any) => {
              if (props.extraOnChange) props.extraOnChange();
              return onChange(data);
            }}
            onInputChange={(e, data) => {
              if (props.extraOnInputChange) props.extraOnInputChange(e, data);
              if (data) onChange(data);
            }}
            options={props.options}
            freeSolo={props.freeSolo}
            disabled={props.disabled}
            fullWidth={props.fullWidth}
            loading={props.loadingContents}
            size={props.size}
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
