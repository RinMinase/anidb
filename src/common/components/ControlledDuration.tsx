import { useState } from "preact/hooks";
import { Control, Controller } from "react-hook-form";

import {
  FormGroup,
  FormHelperText,
  InputAdornment,
  OutlinedInput,
  Stack,
  styled,
} from "@mui/material";

type Props = {
  control: Control<any>;
  name: string;
  numeric?: boolean;
  label?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
};

const disableNonNumeric = (e: any) => {
  const el = e.target as HTMLInputElement;
  const value = el.value;

  el.value = value.replaceAll(/\D/g, "");
};

const Container = styled(FormGroup)(({ theme }) => ({
  position: "relative",
  border: "1px solid",
  borderColor: theme.palette.action.disabled,
  paddingTop: 10,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: 4,
  borderRadius: 6,

  "& .MuiOutlinedInput-notchedOutline legend": {
    display: 'none',
  },
}));

const Label = styled("span")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  transform: `translate(6px, -13px) scale(0.75)`,
  backgroundColor: theme.palette.background.default,
  paddingLeft: 4,
  paddingRight: 8,
}));

const ControlledDuration = (props: Props) => {
  const [hours, setHours] = useState(0);
  const [mins, setMins] = useState(0);
  const [secs, setSecs] = useState(0);

  const handleChangeHour = (e: any) => {
    const el = e.target as HTMLInputElement;
    const value = el.value;

    setHours(parseInt(value) || 0);
  };

  const handleChangeMin = (e: any) => {
    const el = e.target as HTMLInputElement;
    const value = el.value;

    setMins(parseInt(value) || 0);
  };

  const handleChangeSec = (e: any) => {
    const el = e.target as HTMLInputElement;
    const value = el.value;

    setSecs(parseInt(value) || 0);
  };

  return (
    <Controller
      name={props.name}
      control={props.control}
      defaultValue=""
      render={({ field: { onChange } }) => {
        return (
          <Container>
            <Label>{props.label}</Label>
            <Stack spacing={2} direction="row">
              <OutlinedInput
                type="tel"
                inputProps={{
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  maxLength: 3,
                }}
                endAdornment={
                  <InputAdornment position="end">hrs</InputAdornment>
                }
                size="small"
                error={props.error}
                disabled={props.disabled}
                fullWidth={props.fullWidth}
                value={hours}
                onChange={(e) => {
                  disableNonNumeric(e);
                  handleChangeHour(e);

                  const el = e.target as HTMLInputElement;
                  const hr = parseInt(el.value) || 0;

                  const total = hr * 3600 + mins * 60 + secs;
                  el.value = `${total}`;

                  onChange(e);
                  el.value = `${hr}`;
                }}
              />
              <OutlinedInput
                type="tel"
                inputProps={{
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  maxLength: 2,
                }}
                endAdornment={
                  <InputAdornment position="end">mins</InputAdornment>
                }
                size="small"
                error={props.error}
                disabled={props.disabled}
                fullWidth={props.fullWidth}
                value={mins}
                onChange={(e) => {
                  disableNonNumeric(e);
                  handleChangeMin(e);

                  const el = e.target as HTMLInputElement;
                  const min = parseInt(el.value) || 0;

                  const total = hours * 3600 + min * 60 + secs;
                  el.value = `${total}`;

                  onChange(e);
                  el.value = `${min}`;
                }}
              />
              <OutlinedInput
                type="tel"
                inputProps={{
                  pattern: "[0-9]*",
                  inputMode: "numeric",
                  maxLength: 2,
                }}
                endAdornment={
                  <InputAdornment position="end">secs</InputAdornment>
                }
                size="small"
                error={props.error}
                disabled={props.disabled}
                fullWidth={props.fullWidth}
                value={secs}
                onChange={(e) => {
                  disableNonNumeric(e);
                  handleChangeSec(e);

                  const el = e.target as HTMLInputElement;
                  const sec = parseInt(el.value) || 0;

                  const total = hours * 3600 + mins * 60 + sec;
                  el.value = `${total}`;

                  onChange(e);
                  el.value = `${sec}`;
                }}
              />
            </Stack>
            {props.error && (
              <FormHelperText error>{props.helperText}</FormHelperText>
            )}
          </Container>
        );
      }}
    />
  );
};

export default ControlledDuration;
