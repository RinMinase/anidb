import { useRef, useState } from "preact/hooks";
import { Trash as TrashIcon, X as ClearIcon } from "react-feather";

import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
} from "react-hook-form";

import {
  Box,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Button, IconButton } from "@components";

import { Form } from "../validation";

type HelperButtonProps = {
  value: string | number;
  large?: boolean;
};

type Props = {
  fields: FieldArrayWithId<Form, "ingredients", "id">[];
  append: UseFieldArrayAppend<Form, "ingredients">;
  remove: UseFieldArrayRemove;
};

const IngredientsForm = (props: Props) => {
  const { fields, append, remove } = props;

  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>();

  const handleAutofill = (value: string | number) => {
    setInput(`${input}${value} `);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleAddClick = () => {
    if (input.trim()) {
      append({ value: input });
      setInput("");
      if (inputRef.current) inputRef.current.focus();
    }
  };

  const HelperButton = ({ value, large }: HelperButtonProps) => {
    return (
      <Button
        variant="outlined"
        sx={{
          fontSize: large ? 20 : 16,
          py: large ? 0 : 0.5,
          px: 1,
          minWidth: { xs: 56, sm: 64 },
        }}
        onClick={() => handleAutofill(value)}
      >
        {value}
      </Button>
    );
  };

  return (
    <Box maxWidth={500}>
      <Typography variant="body1">Ingredients</Typography>
      <Box>
        <List>
          {fields.map((field, index) => (
            <ListItem
              key={field.id}
              secondaryAction={
                <IconButton
                  edge="end"
                  onClick={() => remove(index)}
                  children={<TrashIcon size={20} />}
                />
              }
              sx={(theme) => ({
                borderBottom: "1px solid",
                borderColor: theme.palette.divider,
              })}
            >
              <ListItemText primary={field.value} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          inputRef={inputRef}
          fullWidth
          size="small"
          variant="outlined"
          placeholder="Add Ingredient"
          onChange={(e) => setInput(e.currentTarget.value)}
          value={input}
          slotProps={{
            input: {
              endAdornment: input && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setInput("");
                      if (inputRef.current) inputRef.current.focus();
                    }}
                    edge="end"
                    size="small"
                    children={<ClearIcon />}
                  />
                </InputAdornment>
              ),
            },
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddClick();
            }
          }}
        />
        <Button
          variant="contained"
          sx={{ whiteSpace: "nowrap", px: 3 }}
          onClick={handleAddClick}
        >
          Add Ingredient
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <HelperButton value={1} />
        <HelperButton value={2} />
        <HelperButton value={3} />
        <HelperButton value={4} />
        <HelperButton value={5} />
      </Stack>

      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <HelperButton large value={"¼"} />
        <HelperButton large value={"½"} />
        <HelperButton large value={"¾"} />
        <HelperButton large value={"⅓"} />
        <HelperButton large value={"⅔"} />
      </Stack>
    </Box>
  );
};

export default IngredientsForm;
