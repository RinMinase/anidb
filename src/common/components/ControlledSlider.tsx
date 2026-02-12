import { Control, Controller } from "react-hook-form";
import type { Mark } from "node_modules/@mui/material/esm/Slider/useSlider.types";

import {
  FormGroup,
  FormHelperText,
  Slider,
  styled,
  Typography,
} from "@mui/material";

type Props = {
  control: Control<any>;
  name: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  defaultValue?: number;
  shiftStep?: number;
  step: number;
  marks?: boolean | readonly Mark[];
  min: number;
  max: number;
  bordered?: boolean;
};

const Container = styled(FormGroup)(({ bordered, theme }) => ({
  height: "100%",
  justifyContent: "center",
  border: bordered ? "1px solid" : "",
  borderColor: theme.palette.action.disabled,
  borderRadius: 4,
  paddingTop: bordered ? 4 : 0,
  paddingBottom: bordered ? 4 : 0,
  paddingLeft: bordered ? 16 : 8,
  paddingRight: bordered ? 16 : 8,
}));

const ControlledSlider = (props: Props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value } }) => (
        <Container bordered={props.bordered}>
          {props.label && <Typography mb={1}>{props.label}</Typography>}
          <Slider
            aria-label={props.label || "No Label Range"}
            defaultValue={props.defaultValue}
            shiftStep={props.shiftStep}
            step={props.step}
            marks={props.marks}
            min={props.min}
            max={props.max}
            onChange={onChange}
            value={value}
            disabled={props.disabled}
            slotProps={{
              markLabel: {
                style: {
                  color: "rgba(0, 0, 0, 0.87)",
                },
              },
            }}
          />
          {props.error && (
            <FormHelperText error sx={{ width: "100%", textAlign: "center" }}>
              {props.helperText}
            </FormHelperText>
          )}
        </Container>
      )}
    />
  );
};

export default ControlledSlider;
