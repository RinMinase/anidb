import { Button as MuiButton, ButtonProps, styled } from "@mui/material";

type Props = ButtonProps & {
  iconSize?: number;
};

const CustomButton = styled(MuiButton)<Props>(({ iconSize }) => ({
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

const Button = (props: Props) => {
  return <CustomButton {...props} />;
};

export default Button;
