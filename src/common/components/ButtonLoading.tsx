import { styled } from "@mui/material";
import { LoadingButton, LoadingButtonProps } from "@mui/lab";

type Props = LoadingButtonProps & {
  iconSize?: number;
};

const CustomButton = styled(LoadingButton)<Props>(({ iconSize }) => ({
  "& .MuiButton-iconSizeMedium svg:first-of-type": {
    fontSize: 16,
  },
  "& .MuiButton-iconSizeSmall svg:first-of-type": {
    fontSize: 12,
  },
  "& svg:first-of-type": {
    fontSize: iconSize,
  },
}));

const ButtonLoading = (props: Props) => {
  return <CustomButton {...props} />;
};

export default ButtonLoading;
