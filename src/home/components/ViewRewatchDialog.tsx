import axios, { AxiosError } from "axios";
import { useState } from "preact/hooks";
import { useForm } from "react-hook-form";
import { format } from "date-fns";
import { Trash as DeleteIcon, X as CloseIcon } from "react-feather";
import { toast } from "sonner";

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
  Button,
  ControlledDatepicker,
  Dialog,
  ErrorResponseType,
  IconButton,
} from "@components";

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
  paddingTop: 16,
});

const RewatchListItem = styled(ListItem)(({ theme }) => ({
  borderRadius: 4,
  ":hover": {
    backgroundColor: theme.palette.grey[800],
  },
}));

const ViewRewatchDialog = (props: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<string>();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RewatchForm>({
    defaultValues: rewatchDefaultValues,
    resolver: rewatchResolver,
    mode: "onChange",
  });

  const handleDeleteClick = async (e: any, uuid: string) => {
    setSelected(uuid);
    setDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      setDialogOpen(false);
      setLoading(true);

      await axios.delete(`/entries/rewatch/${selected}`);
      await props.onChangeData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (formdata: RewatchForm) => {
    try {
      setLoading(true);

      await axios.post(`/entries/rewatch/${props.entry}`, {
        date_rewatched: format(formdata.date_rewatched, "yyyy-MM-dd"),
      });

      await props.onChangeData();
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponseType;

        for (const key in data) {
          setError(key as any, {
            type: "manual",
            message: data[key].length ? data[key][0] : "Unknown error.",
          });
        }

        toast.error("Form validation failed");
      } else {
        console.error(err);
        toast.error("Failed");
      }
    } finally {
      setLoading(false);
    }
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
            <CloseIcon size={22} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 0 }}>
          <Grid container spacing={2} sx={{ pt: 1, px: 3 }}>
            <Grid size={{ xs: 12, sm: 7, md: 8 }}>
              <ControlledDatepicker
                name="date_rewatched"
                label="Add Date Rewatched"
                size="small"
                control={control}
                error={!!errors.date_rewatched}
                helperText={errors.date_rewatched?.message}
                disabled={isLoading}
                fullWidth
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5, md: 4 }}>
              <Button
                variant="contained"
                disabled={isLoading}
                onClick={handleSubmit(handleSubmitForm)}
                fullWidth
              >
                Add
              </Button>
            </Grid>
          </Grid>

          <RewatchList>
            {props.rewatches?.map((item) => (
              <RewatchListItem key={item.id}>
                <ListItemText primary={item.date} />
                <IconButton
                  size="small"
                  disabled={isLoading}
                  onClick={(e) => handleDeleteClick(e, item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </RewatchListItem>
            ))}
          </RewatchList>
        </DialogContent>
      </CustomDialog>

      <Dialog
        title="Are you sure?"
        text="This content would be deleted."
        onSubmit={handleDeleteSubmit}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />
    </Backdrop>
  );
};

export default ViewRewatchDialog;
