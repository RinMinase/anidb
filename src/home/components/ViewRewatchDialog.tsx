import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import {
  Backdrop,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  styled,
} from "@mui/material";

import {
  faTrash as DeleteIcon,
  faXmark as CloseIcon,
} from "@fortawesome/free-solid-svg-icons";

import { Button, ControlledDatepicker, IconButton } from "@components";

import {
  rewatchDefaultValues,
  RewatchForm,
  rewatchResolver,
} from "../validation";

type Props = {
  open: boolean;
  onClose: () => void;
  rewatches?: Array<{
    id: string;
    dateIso: string;
    date: string;
  }>;
};

const CustomDialog = styled(Paper)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
});

const ViewRewatchDialogue = (props: Props) => {
  const [isLoading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RewatchForm>({
    defaultValues: rewatchDefaultValues,
    resolver: rewatchResolver,
    mode: "onChange",
  });

  const handleDeleteClick = (e: any, id: string) => {
    setLoading(true);
    console.log(id);
    setLoading(false);
  };

  const handleSubmitForm = (formdata: RewatchForm) => {
    setLoading(true);
    console.log(formdata);
    setLoading(false);
  };

  if (!props.open) {
    return null;
  }

  return (
    <Backdrop open={props.open}>
      <CustomDialog>
        {isLoading && <LinearProgress />}
        <DialogTitle display="flex" justifyContent="space-between">
          Rewatch List
          <IconButton onClick={props.onClose}>
            <FontAwesomeSvgIcon width={22} icon={CloseIcon} />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            <Grid item xs={12} sm={7} md={8}>
              <ControlledDatepicker
                name="dateRewatch"
                label="Add Date Rewatched"
                size="small"
                control={control}
                error={!!errors.dateRewatch}
                helperText={errors.dateRewatch?.message}
                disabled={isLoading}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} sm={5} md={4}>
              <Button
                variant="contained"
                onClick={handleSubmit(handleSubmitForm)}
                fullWidth
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <List>
            {props.rewatches?.map((item) => (
              <ListItem key={item.id}>
                <ListItemText primary={item.date} />
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteClick(e, item.id)}
                >
                  <FontAwesomeSvgIcon color="red" icon={DeleteIcon} />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </CustomDialog>
    </Backdrop>
  );
};

export default ViewRewatchDialogue;
