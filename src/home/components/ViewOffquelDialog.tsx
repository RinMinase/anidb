import { useEffect, useState } from "preact/hooks";
import { X as CloseIcon, Trash as DeleteIcon } from "react-feather";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

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
  ButtonLoading,
  Dialog,
  ErrorResponseType,
  IconButton,
} from "@components";

import AddFormAutocomplete from "./AddFormAutocomplete";
import { TitleObject } from "../types";
import { OffquelForm, offquelResolver } from "../validation";

type Props = {
  entry: string;
  open: boolean;
  onClose: () => void;
  onChangeData: () => Promise<void>;
  offquels?: Array<{
    id: string;
    title: string;
  }>;
};

type AutocompleteOptions = Array<{
  id: string;
  label: string;
}>;

const CustomDialog = styled(Paper)({
  position: "fixed",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "100%",
  maxWidth: 400,
  maxHeight: "80vh",
});

const OffquelList = styled(List)({
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

const searchAPI = (id?: string, needle?: string) =>
  axios.get("/entries/titles", {
    params: {
      id: id === "" ? null : id,
      needle: needle === "" ? null : needle,
      id_excluded: true,
    },
  });

const ViewOffquelDialog = (props: Props) => {
  const [isLoading, setLoading] = useState(false);
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selected, setSelected] = useState<string>();
  const [initACOptions, setInitACOptions] = useState<AutocompleteOptions>([]);

  const {
    control,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
  } = useForm<OffquelForm>({
    resolver: offquelResolver,
    mode: "onChange",
  });

  const fetchTitles = async () => {
    const {
      data: { data },
    } = await searchAPI(props.entry);

    const values = data.map((data: TitleObject) => ({
      id: data.id,
      label: data.title,
    }));

    setInitACOptions(structuredClone(values));
  };

  const handleDeleteClick = async (_e: any, uuid: string) => {
    setSelected(uuid);
    setDialogOpen(true);
  };

  const handleDeleteSubmit = async () => {
    try {
      setDialogOpen(false);
      setLoading(true);

      await axios.delete(`/entries/${props.entry}/offquel/${selected}`);
      await props.onChangeData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForm = async (formdata: OffquelForm) => {
    try {
      setSubmitLoading(true);

      await axios.post(
        `/entries/${props.entry}/offquel/${formdata.offquel_id}`,
      );

      await props.onChangeData();
    } catch (err) {
      if (err instanceof AxiosError && err.status === 401) {
        const { data } = err.response?.data as ErrorResponseType;

        setError("offquel", {
          type: "manual",
          message: data.offquel_id[0] ?? "Unknown error.",
        });

        toast.error("Form validation failed");
      } else {
        console.error(err);
        toast.error("Failed");
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    fetchTitles();
  }, []);

  if (!props.open) {
    return null;
  }

  return (
    <Backdrop open={props.open}>
      <CustomDialog>
        {isLoading && <LinearProgress />}
        <DialogTitle display="flex" justifyContent="space-between">
          Offquels List
          <IconButton onClick={props.onClose}>
            <CloseIcon size={22} />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 0 }}>
          <Grid container spacing={2} sx={{ pt: 1, px: 3 }}>
            <Grid size={{ xs: 12, sm: 7, md: 8 }}>
              <AddFormAutocomplete
                entryId={props.entry}
                name="offquel"
                actualIdFieldName="offquel_id"
                label="Offquel Title"
                control={control}
                setValue={setValue}
                error={!!errors.offquel}
                helperText={errors.offquel?.message}
                disabled={isSubmitLoading || isLoading}
                initialOptions={initACOptions}
                shouldExcludeEntry
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 5, md: 4 }}>
              <ButtonLoading
                variant="contained"
                loading={isSubmitLoading}
                disabled={isLoading}
                onClick={handleSubmit(handleSubmitForm)}
                sx={{ height: "100%", maxHeight: "56px" }}
                fullWidth
              >
                Add
              </ButtonLoading>
            </Grid>
          </Grid>

          <OffquelList>
            {props.offquels?.map((item) => (
              <RewatchListItem key={item.id}>
                <ListItemText primary={item.title} />
                <IconButton
                  size="small"
                  disabled={isLoading || isSubmitLoading}
                  onClick={(e) => handleDeleteClick(e, item.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </RewatchListItem>
            ))}
          </OffquelList>
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

export default ViewOffquelDialog;
