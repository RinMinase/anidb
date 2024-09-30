import {
  Box,
  IconContainerProps,
  Rating,
  styled,
  Typography,
} from "@mui/material";

import { Button, IconButton } from "@components";

import RatingFilledIcon from "@components/icons/star-filled.svg?react";
import FallIcon from "@components/icons/fall.svg?react";
import SpringIcon from "@components/icons/spring.svg?react";
import SummerIcon from "@components/icons/summer.svg?react";
import WinterIcon from "@components/icons/winter.svg?react";

type ImageProps = {
  src?: string;
  alt: string;
  component?: string;
};

const Header = styled(Typography)(({ theme }) => ({
  fontSize: 22,
  borderBottom: `2px solid ${theme.palette.primary.light}`,
  marginBottom: 8,
}));

const ImageBox = styled(Box)({
  position: "relative",
  height: 300,
  width: "100%",
  background: "#ccc",
  overflow: "hidden",
});

const Image = styled(Box)<ImageProps>({
  width: "100%",
  height: "100%",
  objectFit: "cover",
});

const ImageLoader = styled(Box)({
  position: "absolute",
  top: 12,
  left: 12,
});

const ImageBoxEdit = styled(Button)(({ theme }) => ({
  position: "absolute",
  top: 12,
  right: 12,

  height: 46,
  width: 46,
  minWidth: 46,
  borderRadius: "100%",

  "&:hover": {
    backgroundColor: theme.palette.warning.main,
  },

  "&> svg": {
    width: "100%",
    height: "100%",
  },
}));

const ImageBoxDelete = styled(IconButton)(({ theme }) => ({
  position: "absolute",
  top: 64,
  right: 12,

  height: 46,
  width: 46,

  "&:hover": {
    backgroundColor: theme.palette.error.main,
  },
}));

const ImageBoxSave = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  position: "absolute",
  top: 12,
  right: 12,

  height: 46,
  width: 46,

  "&:hover": {
    backgroundColor: theme.palette.success.dark,
  },
}));

const ImageBoxRemove = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  position: "absolute",
  top: 64,
  right: 12,

  height: 46,
  width: 46,

  "&:hover": {
    backgroundColor: theme.palette.error.dark,
  },
}));

const TotalStyledRating = styled(Rating)(({ value }) => ({
  "& .MuiRating-decimal": {
    marginRight: 2,
  },
  "& .MuiRating-iconFilled": {
    width: 28,
    fill: value
      ? value > 3.75
        ? "#28a745"
        : value > 3
        ? "#1e90ff"
        : "#e57373"
      : "",
  },
}));

const StyledRating = styled(Rating)(({ theme, value }) => ({
  "& .MuiRating-iconFilled": {
    width: 18,
    marginRight: 2,
    fill: value
      ? value >= 8
        ? "#28a745 !important"
        : value >= 6
        ? "#1e90ff !important"
        : "#e57373 !important"
      : "",
  },
  "& .MuiRating-iconEmpty svg": {
    width: 18,
    fill: theme.palette.action.disabled,
  },
}));

const RatingIcon = styled(RatingFilledIcon)({
  marginRight: 2,
});

const IconWinter = () => <WinterIcon width={16} style={{ marginRight: 6 }} />;
const IconSpring = () => <SpringIcon width={16} style={{ marginRight: 6 }} />;
const IconSummer = () => <SummerIcon width={16} style={{ marginRight: 6 }} />;
const IconFall = () => <FallIcon width={16} style={{ marginRight: 6 }} />;

const IconRateLow = () => <RatingIcon fill="#e57373" />;
const IconRateNormal = () => <RatingIcon fill="#1e90ff" />;
const IconRateHigh = () => <RatingIcon fill="#28a745" />;

const RatingIconContainer = (props: IconContainerProps) => {
  const { value, ...other } = props;

  return (
    <span {...other}>
      {value >= 8 ? (
        <IconRateHigh />
      ) : value >= 6 ? (
        <IconRateNormal />
      ) : (
        <IconRateLow />
      )}
    </span>
  );
};

export {
  Header,
  ImageBox,
  Image,
  ImageLoader,
  ImageBoxEdit,
  ImageBoxDelete,
  ImageBoxSave,
  ImageBoxRemove,
  TotalStyledRating,
  StyledRating,
  IconWinter,
  IconSpring,
  IconSummer,
  IconFall,
  RatingIconContainer,
};
