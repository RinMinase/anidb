import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import {
  Box,
  InputAdornment,
  OutlinedInput,
  Paper,
  Stack,
  styled,
  TextField,
  useTheme,
} from "@mui/material";
import { Trash2 as RemoveIcon } from "react-feather";

import {
  FieldArrayWithId,
  FieldErrors,
  UseFieldArrayMove,
  UseFieldArrayRemove,
  UseFormRegister,
  UseFormTrigger,
} from "react-hook-form";

import { disableNonNumeric } from "@components/components/ControlledField";
import { IconButton } from "@components";
import DragHandleIcon from "@components/icons/drag.svg?react";

import { Form } from "../validation";

type Props = {
  register: UseFormRegister<Form>;
  trigger: UseFormTrigger<Form>;
  errors: FieldErrors<Form>;
  fields: FieldArrayWithId<Form, "buckets", "id">[];
  move: UseFieldArrayMove;
  remove: UseFieldArrayRemove;
  isSaveLoading: boolean;
};

const CustomTextField = styled(TextField)(({ theme }) => ({
  minWidth: "40px",
  width: "220px",

  [theme.breakpoints.down("md")]: {
    maxWidth: "200px",
  },

  [theme.breakpoints.down("sm")]: {
    maxWidth: "70px",
  },
}));

const CustomNumericField = styled(OutlinedInput)(({ theme }) => ({
  height: "40px",
  width: "180px",
  textAlign: "right",

  [theme.breakpoints.down("md")]: {
    maxWidth: "130px",
  },

  [theme.breakpoints.down("sm")]: {
    maxWidth: "75px",
  },

  "& input::-webkit-outer-spin-button": {
    display: "none",
  },

  "& input::-webkit-inner-spin-button": {
    display: "none",
  },

  "& input[type=number]": {
    MozAppearance: "textfield",
  },
}));

const BucketListDragArea = (props: Props) => {
  const theme = useTheme();

  const handleDrag = ({ source, destination }: any) => {
    if (destination) props.move(source.index, destination.index);
  };

  return (
    <DragDropContext onDragEnd={handleDrag}>
      <Droppable droppableId="bucket-list-wrapper">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {props.fields.map((field, index) => (
              <Draggable key={field.id} draggableId={field.id} index={index}>
                {(_provided) => (
                  <div
                    ref={_provided.innerRef}
                    {..._provided.draggableProps}
                    style={{
                      ..._provided.draggableProps.style,
                      marginBottom: "12px",
                    }}
                  >
                    <Paper
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 1,
                      }}
                    >
                      {/** @ts-expect-error type error */}
                      <div {..._provided.dragHandleProps}>
                        <DragHandleIcon
                          style={{
                            boxSizing: "content-box",
                            width: "18px",
                            fill: theme.palette.action.disabled,
                            cursor: "grab",
                            margin: "0 18px 0 18px",
                          }}
                        />
                      </div>

                      {/* Fields */}
                      <Stack
                        direction="row"
                        spacing={{ xs: 1, sm: 1.5, md: 2 }}
                        flexGrow={1}
                        justifyContent="space-between"
                      >
                        <CustomTextField
                          variant="outlined"
                          label="From"
                          size="small"
                          disabled={props.isSaveLoading}
                          error={
                            props.errors.buckets &&
                            !!props.errors.buckets[index]?.from
                          }
                          helperText={
                            props.errors.buckets &&
                            props.errors.buckets[index]?.from?.message
                          }
                          onInput={() => props.trigger(`buckets.${index}.to`)}
                          {...props.register(`buckets.${index}.from`)}
                        />

                        <CustomTextField
                          variant="outlined"
                          label="To"
                          size="small"
                          disabled={props.isSaveLoading}
                          error={
                            props.errors.buckets &&
                            !!props.errors.buckets[index]?.to
                          }
                          helperText={
                            props.errors.buckets &&
                            props.errors.buckets[index]?.to?.message
                          }
                          onInput={() => props.trigger(`buckets.${index}.from`)}
                          {...props.register(`buckets.${index}.to`)}
                        />

                        <CustomNumericField
                          type="tel"
                          inputProps={{
                            pattern: "[0-9]*",
                            inputMode: "numeric",
                            maxLength: 2,
                            style: {
                              textAlign: "right",
                            },
                          }}
                          size="small"
                          disabled={props.isSaveLoading}
                          endAdornment={
                            <InputAdornment
                              position="end"
                              onClick={({
                                currentTarget: { previousSibling: input },
                              }: any) => {
                                input.focus();
                              }}
                            >
                              TB
                            </InputAdornment>
                          }
                          error={
                            props.errors.buckets &&
                            !!props.errors.buckets[index]?.size
                          }
                          helperText={
                            props.errors.buckets &&
                            props.errors.buckets[index]?.size?.message
                          }
                          {...props.register(`buckets.${index}.size`)}
                          onChange={(e: any) => {
                            disableNonNumeric(e);
                            props.register(`buckets.${index}.size`).onChange(e);
                          }}
                        />

                        <Box
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          sx={{
                            pr: { xs: 1, sm: 2 },
                          }}
                          pr={1}
                        >
                          <IconButton
                            size="small"
                            color="error"
                            iconSize={32}
                            disabled={props.isSaveLoading}
                            onClick={() => props.remove(index)}
                            children={<RemoveIcon size={20} />}
                          />
                        </Box>
                      </Stack>
                    </Paper>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default BucketListDragArea;
