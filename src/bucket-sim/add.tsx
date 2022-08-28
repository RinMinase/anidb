import { useEffect } from "preact/hooks";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";

import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  OutlinedInput,
  Paper,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import {
  faAdd as AddIcon,
  faArrowLeftLong as BackIcon,
  faAngleDown as DownIcon,
  faAngleUp as UpIcon,
  faFloppyDisk as SaveIcon,
  faTrash as RemoveIcon,
} from "@fortawesome/free-solid-svg-icons";

import { Buckets } from "./types";
import { useFieldArray, useForm } from "react-hook-form";

const ModuleContainer = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Header = styled(Box)({
  display: "flex",
  marginBottom: 32,
});

const ControlButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
    alignItems: "unset",
  },
}));

const ControlButtions = styled(Button)(({ theme }) => ({
  minWidth: 120,
  marginLeft: 16,
  [theme.breakpoints.down("sm")]: {
    marginTop: 8,
  },
}));

const CustomIconButton = styled(IconButton)({
  width: 32,
  height: 32,
});

const CustomCell = styled(TableCell)(({ theme }) => ({
  [theme.breakpoints.down("sm")]: {
    padding: 4,
  },
}));

const CellContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "unset",
  },
}));

const CellLabel = styled(Typography)(({ theme }) => ({
  display: "inline-block",
  marginRight: 8,
  [theme.breakpoints.down("sm")]: {
    textAlign: "center",
    marginRight: 0,
  },
}));

const CellField = styled(TextField)(({ theme }) => ({
  minWidth: 40,
  [theme.breakpoints.down("sm")]: {
    maxWidth: 70,
  },
}));

const CellField2 = styled(OutlinedInput)({
  minWidth: 40,
});

const BucketSimAdd = () => {
  const { control, register, handleSubmit } = useForm<Buckets>();
  const { fields, append, remove, swap } = useFieldArray({
    control,
    name: "buckets",
  });

  const handleSubmitForm = (formdata: Buckets) => {
    console.log("form", formdata.buckets);
  };

  useEffect(() => {
    append({});
  }, []);

  return (
    <ModuleContainer>
      <Header>
        <Box display="flex" flexDirection="column" flexGrow={1}>
          <Button
            variant="contained"
            color="error"
            startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
            sx={{
              display: { xs: "inline-flex", sm: "none" },
              width: 120,
              marginBottom: 2,
            }}
          >
            Back
          </Button>
          <Typography variant="h5" alignItems="center">
            Add Bucket Simulation
          </Typography>
        </Box>
        <ControlButtonsContainer>
          <ControlButtions
            variant="contained"
            color="error"
            startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
            sx={{ display: { xs: "none", sm: "inline-flex" } }}
          >
            Back
          </ControlButtions>
          <ControlButtions
            variant="contained"
            startIcon={<FontAwesomeSvgIcon icon={AddIcon} />}
            onClick={() => {
              append({});
            }}
          >
            Add
          </ControlButtions>
          <ControlButtions
            variant="contained"
            startIcon={<FontAwesomeSvgIcon icon={SaveIcon} />}
            onClick={handleSubmit(handleSubmitForm)}
          >
            Save
          </ControlButtions>
        </ControlButtonsContainer>
      </Header>

      <TableContainer component={Paper}>
        <Table>
          <TableBody>
            {fields.map((field, index) => (
              <TableRow key={field.id}>
                <CustomCell>
                  <CellContainer>
                    <CellLabel>From:</CellLabel>
                    <CellField
                      variant="outlined"
                      size="small"
                      {...register(`buckets.${index}.from`)}
                    />
                  </CellContainer>
                </CustomCell>
                <CustomCell>
                  <CellContainer>
                    <CellLabel>To:</CellLabel>
                    <CellField
                      variant="outlined"
                      size="small"
                      {...register(`buckets.${index}.to`)}
                    />
                  </CellContainer>
                </CustomCell>
                <CustomCell>
                  <CellContainer>
                    <CellLabel>Size:</CellLabel>
                    <CellField2
                      size="small"
                      endAdornment={
                        <InputAdornment position="end">TB</InputAdornment>
                      }
                      {...register(`buckets.${index}.size`)}
                    />
                  </CellContainer>
                </CustomCell>

                {index !== 0 ? (
                  <CustomCell>
                    <CustomIconButton
                      size="small"
                      onClick={() => swap(index, index - 1)}
                    >
                      <FontAwesomeSvgIcon icon={UpIcon} />
                    </CustomIconButton>
                  </CustomCell>
                ) : (
                  <CustomCell />
                )}

                {index !== fields.length - 1 ? (
                  <CustomCell>
                    <CustomIconButton
                      size="small"
                      onClick={() => swap(index, index + 1)}
                    >
                      <FontAwesomeSvgIcon icon={DownIcon} />
                    </CustomIconButton>
                  </CustomCell>
                ) : (
                  <CustomCell />
                )}

                <CustomCell>
                  <CustomIconButton
                    size="small"
                    color="error"
                    onClick={() => remove(index)}
                  >
                    <FontAwesomeSvgIcon icon={RemoveIcon} />
                  </CustomIconButton>
                </CustomCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ModuleContainer>
  );
};

export default BucketSimAdd;
