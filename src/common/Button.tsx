import { Button as MuiButton, ButtonProps, styled } from "@mui/material";

type Props = ButtonProps & {
  iconSize?: number;
};

const CustomButton = styled(MuiButton)<Props>(({ iconSize }) => ({
  "& svg:first-of-type": {
    fontSize: iconSize || 16,
  },
}));

const Button = (props: Props) => {
  return <CustomButton {...props} />;
};

export default Button;
