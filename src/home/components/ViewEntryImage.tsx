import { Dispatch, StateUpdater, useContext, useState } from "preact/hooks";
import axios from "axios";
import { CircularProgress, useMediaQuery, useTheme } from "@mui/material";
import { toast } from "sonner";

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

import { FullData } from "../types";
import { AuthenticatedUserContext } from "@components";

type Props = {
  id?: string;
  data: FullData;
  setData: Dispatch<StateUpdater<FullData>>;
};

const BlankImage = "data:image/gif;base64,R0lGODlhAQABAAAAACwAAAAAAQABAAA=";

const ViewEntryImage = (props: Props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const isAdmin = useContext(AuthenticatedUserContext);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);
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
      toast.success("Success");
    } catch (err) {
      console.error(err);
      toast.error("Failed");
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

        const {
          data: { data },
        } = await axios.get(`/entries/${props.id}`);

        handleRemoveFile();

        props.setData((prev) => ({
          ...prev,
          image: data.image,
        }));

        setDeleteIcon(true);
        toast.success("Success");
      } catch (err) {
        console.error(err);
        toast.error("Failed");
      } finally {
        setImageUploading(false);
      }
    }
  };

  return (
    <>
      <ImageBox>
        {imageUploading && (
          <ImageLoader>
            <CircularProgress />
          </ImageLoader>
        )}

        {(tempImage || props.data?.image) && (
          <Image component="img" alt="" src={tempImage || props.data?.image} />
        )}

        {isDesktop && !imageFile && (
          <ImageBoxEdit component="label" disabled={!!imageFile || !isAdmin}>
            <UploadImageIcon color="#fff" />
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={!isAdmin}
              onChange={handleChangeFile}
            />
          </ImageBoxEdit>
        )}

        {isDesktop && !imageFile && deleteIcon && (
          <ImageBoxDelete disabled={!isAdmin} onClick={handleDeleteFile}>
            <UploadDeleteIcon color="#fff" />
          </ImageBoxDelete>
        )}

        {imageFile && (
          <>
            <ImageBoxSave disabled={!isAdmin} onClick={handleUploadFile}>
              <UploadSaveIcon color="#fff" />
            </ImageBoxSave>
            <ImageBoxRemove disabled={!isAdmin} onClick={handleRemoveFile}>
              <UploadCancelIcon color="#fff" />
            </ImageBoxRemove>
          </>
        )}
      </ImageBox>
    </>
  );
};

export default ViewEntryImage;
