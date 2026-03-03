import { useRef } from "preact/hooks";
import { Box, styled } from "@mui/material";

import {
  Control,
  FieldErrors,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";

import { Button, ControlledField } from "@components";
import { Form } from "../validation";

const HelperButtonBase = styled(Button)({
  fontSize: 16,
  padding: "2px 8px",
});

HelperButtonBase.defaultProps = {
  variant: "outlined",
  size: "small",
};

type Props = {
  isLoading: boolean;
  control: Control<Form>;
  errors: FieldErrors<Form>;
  setValue: UseFormSetValue<Form>;
  getValues: UseFormGetValues<Form>;
};

const InstructionsHelperForm = (props: Props) => {
  const { isLoading, control, errors, setValue, getValues } = props;

  const inputRef = useRef<HTMLInputElement>();

  const handleAutofill = (syntax: string) => {
    const currentValue = getValues("instructions") || "";
    setValue("instructions", `${currentValue}${syntax}`);
    inputRef.current?.focus();
  };

  return (
    <Box sx={{ width: "100%" }}>
      <ControlledField
        multiline
        fullWidth
        inputRef={inputRef}
        name="instructions"
        label="Instructions"
        minRows={15}
        control={control}
        error={!!errors.instructions}
        helperText={errors.instructions?.message}
        disabled={isLoading}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
        <HelperButtonBase onClick={() => handleAutofill("# ")}>
          H1
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("\n## ")}>
          H2
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("\n### ")}>
          H3
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("\n#### ")}>
          H4
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("\n##### ")}>
          H5
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("****")}>
          Bold
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("**")}>
          Italic
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("> ")}>
          Quote
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("\`\`")}>
          Code
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("[Label](URL)")}>
          Link
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("1. ")}>
          1.2.3.
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("- ")}>
          • List
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("- [ ] ")}>
          Checkbox
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("~~~~")}>
          Strike
        </HelperButtonBase>
        <HelperButtonBase
          onClick={() =>
            handleAutofill("| col | col | col |\n| --- | --- | --- |\n")
          }
        >
          Table Head
        </HelperButtonBase>
        <HelperButtonBase onClick={() => handleAutofill("| col | col | col |")}>
          Table Row
        </HelperButtonBase>
      </Box>
    </Box>
  );
};

export default InstructionsHelperForm;
