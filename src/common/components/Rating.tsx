import { Rating as MuiRating, styled } from "@mui/material";

import RatingFilledIcon from "@components/icons/heart-filled.svg?react";
import RatingEmptyIcon from "@components/icons/heart.svg?react";

type Props = {
  value: number;
};

const StyledRating = styled(MuiRating)(({ value }) => ({
  "& .MuiRating-decimal": {
    marginRight: 2,
  },
  "& .MuiRating-iconFilled": {
    width: 14,
    fill: value
      ? value > 3.75
        ? "#28a745"
        : value > 3
        ? "#1e90ff"
        : "#e57373"
      : "",
  },
}));

const Rating = (props: Props) => (
  <StyledRating
    value={props.value}
    precision={0.25}
    icon={<RatingFilledIcon width={14} />}
    emptyIcon={<RatingEmptyIcon width={14} />}
    readOnly
  />
);

export default Rating;
