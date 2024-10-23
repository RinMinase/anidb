import { Control, FieldErrors } from "react-hook-form";

import {
  FormGroup,
  FormHelperText,
  InputAdornment,
  Stack,
  styled,
} from "@mui/material";

import { ControlledField } from "@components";

import { Form } from "../validation";

type Props = {
  control: Control<any>;
  errors: FieldErrors<Form>;
  disabled: boolean;
};

const DurationContainer = styled(FormGroup)(({ theme }) => ({
  position: "relative",
  border: "1px solid",
  borderColor: theme.palette.action.disabled,
  paddingTop: 15,
  paddingLeft: 4,
  paddingRight: 4,
  paddingBottom: 4,
  borderRadius: 6,

  "& .MuiOutlinedInput-input": {
    paddingTop: 6,
    paddingBottom: 6,
  },

  "& .MuiOutlinedInput-notchedOutline legend": {
    display: "none",
  },
}));

const DurationLabel = styled("span")(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  transform: `translate(6px, -13px) scale(0.75)`,
  /* @ts-expect-error Seems to error on typescript as of now (react-hook-form@7.52.1) */
  backgroundColor: theme.palette.background.default,
  paddingLeft: 4,
  paddingRight: 8,
}));

const AddFormDuration = (props: Props) => {
  return (
    <DurationContainer>
      {/* @ts-expect-error Seems to error on typescript as of now (react-hook-form@7.52.1) */}
      <DurationLabel>Duration</DurationLabel>
      <Stack spacing={2} direction="row">
        <ControlledField
          name="duration_hrs"
          size="small"
          control={props.control}
          error={!!props.errors.duration_hrs}
          disabled={props.disabled}
          maxLength={3}
          endAdornment={<InputAdornment position="end" children="hrs" />}
          outlinedInput
          fullWidth
          numeric
        />
        <ControlledField
          name="duration_mins"
          size="small"
          control={props.control}
          error={!!props.errors.duration_mins}
          disabled={props.disabled}
          maxLength={2}
          endAdornment={<InputAdornment position="end" children="mins" />}
          outlinedInput
          fullWidth
          numeric
        />
        <ControlledField
          name="duration_secs"
          size="small"
          control={props.control}
          error={!!props.errors.duration_secs}
          disabled={props.disabled}
          maxLength={2}
          endAdornment={<InputAdornment position="end" children="secs" />}
          outlinedInput
          fullWidth
          numeric
        />
      </Stack>
      {props.errors.duration_hrs && (
        <FormHelperText error>
          {props.errors.duration_hrs?.message}
        </FormHelperText>
      )}
      {props.errors.duration_mins && (
        <FormHelperText error>
          {props.errors.duration_mins?.message}
        </FormHelperText>
      )}
      {props.errors.duration_secs && (
        <FormHelperText error>
          {props.errors.duration_secs?.message}
        </FormHelperText>
      )}
    </DurationContainer>
  );
};

export default AddFormDuration;
