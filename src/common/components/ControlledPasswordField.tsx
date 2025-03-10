// commit to change to lf
import { Control, Controller } from "react-hook-form";
import { useState } from "preact/hooks";
import { Eye, EyeOff } from "react-feather";
import { InputAdornment, OutlinedInput, TextField } from "@mui/material";

import IconButton from "./IconButton";

type Props = {
  control: Control<any>;
  name: string;
  variant?: "outlined" | "standard" | "filled";
  size?: "small" | "medium";
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  maxLength?: number;
  outlinedInput?: boolean;
  maxHeight?: number;
};

const ControlledPasswordField = (props: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue=""
      render={({ field: { onChange, value } }) => {
        if (!props.outlinedInput) {
          return (
            <TextField
              variant={props.variant ?? "outlined"}
              type={showPassword ? "text" : "password"}
              size={props.size}
              label={props.label}
              helperText={props.helperText}
              error={props.error}
              disabled={props.disabled}
              fullWidth={props.fullWidth}
              value={value}
              sx={{ maxHeight: props.maxHeight }}
              onChange={onChange}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((show) => !show)}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseUp={(e) => e.preventDefault()}
                      >
                        {showPassword ? (
                          <EyeOff size={props.size === "small" ? 18 : 24} />
                        ) : (
                          <Eye size={props.size === "small" ? 18 : 24} />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />
          );
        }

        return (
          <OutlinedInput
            label={props.label}
            size={props.size}
            error={props.error}
            disabled={props.disabled}
            fullWidth={props.fullWidth}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((show) => !show)}
                  onMouseDown={(e) => e.preventDefault()}
                  onMouseUp={(e) => e.preventDefault()}
                  edge="end"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </IconButton>
              </InputAdornment>
            }
            value={value}
            onChange={onChange}
          />
        );
      }}
    />
  );
};

export default ControlledPasswordField;
