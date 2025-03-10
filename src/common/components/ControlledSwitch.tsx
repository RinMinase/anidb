// commit to change to lf
import { Control, Controller } from "react-hook-form";

import {
  FormControlLabel,
  FormGroup,
  FormHelperText,
  styled,
  Switch,
} from "@mui/material";

type Props = {
  control: Control<any>;
  name: string;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
};

const Container = styled(FormGroup)(({ theme }) => ({
  height: "100%",
  justifyContent: "center",
  border: "1px solid",
  borderColor: theme.palette.action.disabled,
  borderRadius: 4,
}));

const ControlledSwitch = (props: Props) => {
  return (
    <Controller
      name={props.name}
      control={props.control}
      render={({ field: { onChange, value } }) => (
        <Container>
          <FormControlLabel
            sx={{ justifyContent: "center" }}
            control={
              <Switch
                onChange={onChange}
                disabled={props.disabled}
                value={value}
              />
            }
            label={props.label}
          />
          {props.error && (
            <FormHelperText error>{props.helperText}</FormHelperText>
          )}
        </Container>
      )}
    />
  );
};

export default ControlledSwitch;
