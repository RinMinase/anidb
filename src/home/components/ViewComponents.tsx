import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

import {
  Box,
  IconContainerProps,
  Rating,
  styled,
  Typography,
} from "@mui/material";

import {
  faLeaf as FallIcon,
  faSnowflake as WinterIcon,
  faStar as RatingFilledIcon,
  faSun as SummerIcon,
  faTree as SpringIcon,
} from "@fortawesome/free-solid-svg-icons";

import { Button, IconButton } from "@components";

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

const Icon = styled(FontAwesomeSvgIcon)({
  marginRight: 8,
});

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

const ImageBoxSave = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.success.main,
  position: "absolute",
  top: 12,
  right: 12,

  height: 46,
  width: 46,

  "&:hover": {
    backgroundColor: theme.palette.success.main,
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
    backgroundColor: theme.palette.error.main,
  },
}));

const TotalStyledRating = styled(Rating)(({ value }) => ({
  "& .MuiRating-iconFilled": {
    color: value
      ? value > 3.75
        ? "#28a745"
        : value > 3
        ? "#1e90ff"
        : "#e57373"
      : "",
  },
}));

const StyledRating = styled(Rating)(({ theme, value }) => ({
  "& .MuiRating-iconFilled:not(.MuiRating-iconHover) svg": {
    color: value
      ? value >= 8
        ? "#28a745 !important"
        : value >= 6
        ? "#1e90ff !important"
        : "#e57373 !important"
      : "",
  },
  "& .MuiRating-iconEmpty svg": {
    color: theme.palette.action.disabled,
  },
}));

const TotalRatingIcon = styled(FontAwesomeSvgIcon)({
  marginRight: 2,
  fontSize: 28,
});

const RatingIcon = styled(FontAwesomeSvgIcon)({
  marginRight: 2,
  fontSize: 18,
});

const IconWinter = () => <Icon icon={WinterIcon} color="#87ceeb" />;
const IconSpring = () => <Icon icon={SpringIcon} color="#008000" />;
const IconSummer = () => <Icon icon={SummerIcon} color="#ffa726" />;
const IconFall = () => <Icon icon={FallIcon} color="#ff5722" />;

const IconRateLow = () => (
  <RatingIcon icon={RatingFilledIcon} color="#e57373" />
);
const IconRateNormal = () => (
  <RatingIcon icon={RatingFilledIcon} color="#1e90ff" />
);
const IconRateHigh = () => (
  <RatingIcon icon={RatingFilledIcon} color="#28a745" />
);

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
  Icon,
  ImageBox,
  Image,
  ImageLoader,
  ImageBoxEdit,
  ImageBoxSave,
  ImageBoxRemove,
  TotalStyledRating,
  StyledRating,
  TotalRatingIcon,
  IconWinter,
  IconSpring,
  IconSummer,
  IconFall,
  RatingIconContainer,
};
