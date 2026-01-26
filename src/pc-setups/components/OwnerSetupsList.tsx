import { Dispatch, StateUpdater, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { toast } from "sonner";
import axios from "axios";

import {
  Eye,
  EyeOff,
  PlusCircle as AddSetupIcon,
  Trash2 as DeleteIcon,
} from "react-feather";

import {
  Box,
  LinearProgress,
  MenuItem,
  MenuList,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { Dialog, IconButton } from "@components";

import { PCOwnerList } from "../types";

type Props = {
  isOwnersLoading: boolean;
  setOwnersLoading: Dispatch<StateUpdater<boolean>>;
  selectedInfo?: string;
  setSelectedInfo: Dispatch<StateUpdater<string | undefined>>;
  data: PCOwnerList;
  fetchData: () => Promise<void>;
  fetchDataInfo: (uuid: string) => Promise<void>;
};

const ShowIcon = <Eye size={20} strokeWidth={1.5} />;
const HideIcon = <EyeOff size={20} strokeWidth={1.5} />;

const OwnerSetupsList = (props: Props) => {
  const location = useLocation();

  const theme = useTheme();
  const isMobileAndTablet = useMediaQuery(theme.breakpoints.down("md"));

  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ownerIdForDelete, setOwnerIdForDelete] = useState<string>();

  const handleDeleteOwnerSubmit = async () => {
    try {
      if (ownerIdForDelete) {
        props.setOwnersLoading(true);
        setDeleteDialogOpen(false);
        await axios.delete(`/pc/owners/${ownerIdForDelete}`);
        toast.success("Success");

        await props.fetchData();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      props.setOwnersLoading(false);
    }
  };

  const handleHideClick = async (uuid: string) => {
    try {
      props.setOwnersLoading(true);

      await axios.put(`/pc/infos/${uuid}/hide`);
      await props.fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      props.setOwnersLoading(false);
    }
  };

  const handleClickInfo = async (uuid: string) => {
    if (props.selectedInfo !== uuid) {
      props.setSelectedInfo(uuid);
      await props.fetchDataInfo(uuid);
    }
  };

  return (
    <>
      <MenuList
        component={Paper}
        sx={{
          padding: 0,
          overflowY: "auto",
          width: "100%",

          // Calculation Description:
          // 48px - navbar
          // 48px - container padding
          // 52.5px - page heading
          height: isMobileAndTablet
            ? undefined
            : "calc(100vh - 48px - 48px - 52.5px)",
          minHeight: isMobileAndTablet ? "150px" : undefined,
        }}
      >
        {props.isOwnersLoading ? (
          <LinearProgress />
        ) : !props.isOwnersLoading && !props.data.length ? (
          <Box
            sx={{
              p: 2,
              textAlign: "center",
              color: theme.palette.action.disabled,
            }}
          >
            No Setups Present
          </Box>
        ) : (
          props.data.map((item) => (
            <Box key={`pc-owner-${item.uuid}`}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={(theme) => ({
                  py: 2,
                  pl: 3,
                  pr: 2,
                  backgroundColor: theme.palette.primary.main,
                  color: "#fff",
                })}
              >
                <Typography>{item.name}</Typography>
                <Box>
                  <IconButton
                    size="small"
                    onClick={() => {
                      setOwnerIdForDelete(item.uuid);
                      setDeleteDialogOpen(true);
                    }}
                    children={<DeleteIcon size={21} color="#fff" />}
                    sx={{ marginRight: 0.5 }}
                  />
                  <IconButton
                    size="small"
                    onClick={() =>
                      location.route(`/pc-setups/${item.uuid}/add`)
                    }
                    children={<AddSetupIcon size={21} color="#fff" />}
                  />
                </Box>
              </Stack>
              {item.infos.map((info) => (
                <MenuItem
                  key={`pc-info-${info.uuid}`}
                  selected={props.selectedInfo === info.uuid}
                  onClick={() => handleClickInfo(info.uuid)}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <Typography
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {info.label}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleHideClick(info.uuid)}
                      children={info.isHidden ? ShowIcon : HideIcon}
                    />
                  </Box>
                </MenuItem>
              ))}
            </Box>
          ))
        )}
      </MenuList>

      <Dialog
        title="Are you sure?"
        text="This PC owner would be deleted."
        onSubmit={handleDeleteOwnerSubmit}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </>
  );
};

export default OwnerSetupsList;
