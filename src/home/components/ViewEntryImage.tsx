import { StateUpdater, useState } from "preact/hooks";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import { CircularProgress, useMediaQuery, useTheme } from "@mui/material";

import {
  faCheck as UploadSaveIcon,
  faCloudArrowUp as UploadImageIcon,
  faXmark as UploadCancelIcon,
} from "@fortawesome/free-solid-svg-icons";

import { Alert, AlertProps } from "@components";

import {
  ImageBox,
  Image,
  ImageLoader,
  ImageBoxEdit,
  ImageBoxSave,
  ImageBoxRemove,
} from "./ViewComponents";

import { FullData } from "../types";

type Props = {
  id?: string;
  data: FullData;
  setData: StateUpdater<FullData>;
};

const ViewEntryImage = (props: Props) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"));

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tempImage, setTempImage] = useState<string>("");
  const [imageUploading, setImageUploading] = useState<boolean>(false);
  const [dialog, setDialog] = useState<AlertProps>({ open: false });

  const handleChangeFile = (e: any) => {
    const element = e.target as HTMLInputElement;
    const { files } = element;

    if (files) {
      setImageFile(() => files[0]);

      const url = URL.createObjectURL(files[0]);
      setTempImage(url);
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

        console.log(imageFile);

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

        {isDesktop && (
          <ImageBoxEdit component="label" disabled={!!imageFile}>
            <FontAwesomeSvgIcon icon={UploadImageIcon} color="#fff" />
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleChangeFile}
            />
          </ImageBoxEdit>
        )}

        {imageFile && (
          <>
            <ImageBoxSave onClick={handleUploadFile}>
              <FontAwesomeSvgIcon icon={UploadSaveIcon} color="#fff" />
            </ImageBoxSave>
            <ImageBoxRemove onClick={handleRemoveFile}>
              <FontAwesomeSvgIcon icon={UploadCancelIcon} color="#fff" />
            </ImageBoxRemove>
          </>
        )}
      </ImageBox>
    </>
  );
};

export default ViewEntryImage;
