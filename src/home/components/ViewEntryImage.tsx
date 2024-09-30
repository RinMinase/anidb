import { Dispatch, StateUpdater, useState } from "preact/hooks";
import axios from "axios";
import { CircularProgress, useMediaQuery, useTheme } from "@mui/material";

import {
  X as UploadCancelIcon,
  Trash as UploadDeleteIcon,
  UploadCloud as UploadImageIcon,
  Check as UploadSaveIcon,
} from "react-feather";

import {
  ImageBox,
  Image,
  ImageLoader,
  ImageBoxEdit,
  ImageBoxSave,
  ImageBoxRemove,
  ImageBoxDelete,
} from "./ViewComponents";

import { Alert, AlertProps } from "@components";
import { FullData } from "../types";

type Props = {
  id?: string;
  data: FullData;
  setData: Dispatch<StateUpdater<FullData>>;
};

const BlankImage = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

const ViewEntryImage = (props: Props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [dialog, setDialog] = useState<AlertProps>({ open: false });
  const [deleteIcon, setDeleteIcon] = useState(!!props.data.image);

  const handleChangeFile = (e: any) => {
    const element = e.target as HTMLInputElement;
    const { files } = element;

    if (files) {
      setImageFile(() => files[0]);

      const url = URL.createObjectURL(files[0]);
      setTempImage(url);
    }
  };

  const handleDeleteFile = async () => {
    try {
      setImageUploading(true);

      await axios.delete(`/entries/img-upload/${props.id}`);

      setTempImage(() => BlankImage);
      setImageUploading(false);
      setDeleteIcon(false);
      setDialog({
        open: true,
        message: "Success!",
        severity: "success",
      });
    } catch (err) {
      console.error(err);

      setImageUploading(false);
      setDialog({
        open: true,
        message: "Failed",
        severity: "error",
      });
    }
  };

  const handleRemoveFile = () => {
    setImageFile(() => null);

    URL.revokeObjectURL(tempImage);
    setTempImage("");
  };

  const handleUploadFile = async () => {
    if (imageFile) {
      try {
        setImageUploading(true);

        const body = new FormData();
        body.append("_method", "PUT");
        body.append("image", imageFile);

        await axios.post(`/entries/img-upload/${props.id}`, body, {
          headers: {
            "Content-Type": "image/*",
          },
        });

        setImageUploading(false);

        const {
          data: { data },
        } = await axios.get(`/entries/${props.id}`);

        handleRemoveFile();

        props.setData((prev) => ({
          ...prev,
          image: data.image,
        }));

        setDeleteIcon(true);
        setDialog({
          open: true,
          message: "Success!",
          severity: "success",
        });
      } catch (err) {
        console.error(err);

        setDialog({
          open: true,
          message: "Failed",
          severity: "error",
        });
      }
    }
  };

  return (
    <>
      <Alert open={dialog.open} onClose={() => setDialog({ open: false })} />
      <ImageBox>
        {imageUploading && (
          <ImageLoader>
            <CircularProgress />
          </ImageLoader>
        )}

        {(tempImage || props.data?.image) && (
          <Image
            component="img"
            alt="entry image"
            src={tempImage || props.data?.image}
          />
        )}

        {isDesktop && !imageFile && (
          <ImageBoxEdit component="label" disabled={!!imageFile}>
            <UploadImageIcon color="#fff" />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleChangeFile}
            />
          </ImageBoxEdit>
        )}

        {isDesktop && !imageFile && deleteIcon && (
          <ImageBoxDelete onClick={handleDeleteFile}>
            <UploadDeleteIcon color="#fff" />
          </ImageBoxDelete>
        )}

        {imageFile && (
          <>
            <ImageBoxSave onClick={handleUploadFile}>
              <UploadSaveIcon color="#fff" />
            </ImageBoxSave>
            <ImageBoxRemove onClick={handleRemoveFile}>
              <UploadCancelIcon color="#fff" />
            </ImageBoxRemove>
          </>
        )}
      </ImageBox>
    </>
  );
};

export default ViewEntryImage;
