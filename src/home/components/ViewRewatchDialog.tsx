import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import axios from "axios";
import { format } from "date-fns";

import {
  Backdrop,
  DialogContent,
  DialogTitle,
  Grid2 as Grid,
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

import { Button, ControlledDatepicker, IconButton, Swal } from "@components";

import {
  rewatchDefaultValues,
  RewatchForm,
  rewatchResolver,
} from "../validation";

type Props = {
  entry: string;
  open: boolean;
  onClose: () => void;
  onChangeData: () => Promise<void>;
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
  maxHeight: "80vh",
});

const RewatchList = styled(List)({
  maxHeight: "calc(80vh - 70px - 64px)",
  overflowY: "auto",
  paddingLeft: 24,
  paddingRight: 24,
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

  const handleDeleteClick = async (e: any, id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This item will be deleted",
      icon: "error",
      showCancelButton: true,
    });

    if (result.isConfirmed) {
      setLoading(true);

      await axios.delete(`/entries/rewatch/${id}`);
      await props.onChangeData();

      setLoading(false);
    }
  };

  const handleSubmitForm = async (formdata: RewatchForm) => {
    setLoading(true);

    await axios.post(`/entries/rewatch/${props.entry}`, {
      date_rewatched: format(formdata.dateRewatch, "yyyy-MM-dd"),
    });

    await props.onChangeData();

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
        <DialogContent sx={{ px: 0 }}>
          <Grid container spacing={2} sx={{ pt: 1, px: 3 }}>
            <Grid size={{ xs: 12, sm: 7, md: 8 }}>
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
            <Grid size={{ xs: 12, sm: 5, md: 4 }}>
              <Button
                variant="contained"
                onClick={handleSubmit(handleSubmitForm)}
                fullWidth
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <RewatchList>
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
          </RewatchList>
        </DialogContent>
      </CustomDialog>
    </Backdrop>
  );
};

export default ViewRewatchDialogue;
