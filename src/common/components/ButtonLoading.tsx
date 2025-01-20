import { styled } from "@mui/material";
import { LoadingButton, ButtonProps as LoadingButtonProps } from "@mui/lab";

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
  "& .MuiButton-iconSizeMedium": {
    marginLeft: 0,
    marginRight: 6,
  },
  "& svg:first-of-type": {
    fontSize: iconSize,
  },
}));

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ButtonLoading = ({ ...props }: Props) => {
  return <CustomButton {...props} />;
};

export default ButtonLoading;
