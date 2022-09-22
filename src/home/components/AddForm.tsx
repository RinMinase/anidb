import { useContext } from "preact/hooks";
import { Control, FieldErrorsImpl } from "react-hook-form";

import { Box } from "@mui/material";

import { ControlledField, GlobalLoaderContext } from "@components";
import { Form } from "../validation";

type Props = {
  control: Control<Form>;
  errors: FieldErrorsImpl<Form>;
};

const AddForm = (props: Props) => {
  const { control, errors } = props;

  const { isLoading } = useContext(GlobalLoaderContext);

  return (
    <Box>
      <ControlledField
        name="title"
        label="Title"
        control={control}
        error={!!errors.title}
        helperText={errors.title?.message}
        disabled={isLoading}
        fullWidth
      />
    </Box>
  );
};

export default AddForm;
