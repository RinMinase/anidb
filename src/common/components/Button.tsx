import { Button as MuiButton, ButtonProps, styled } from "@mui/material";

type Props = ButtonProps & {
  iconSize?: number;
};

const CustomButton = styled(MuiButton)<Props>(({ iconSize }) => ({
  "& .MuiButton-iconSizeMedium": {
    marginLeft: 0,
    marginRight: 6,
  },
  "& .MuiButton-iconSizeMedium.MuiButton-endIcon": {
    marginLeft: 6,
    marginRight: 0,
  },
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Button = ({ ...props }: Props) => {
  return <CustomButton {...props} />;
};

export default Button;
