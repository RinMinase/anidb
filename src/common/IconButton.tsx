import {
  IconButton as MuiIconButton,
  IconButtonProps,
  styled,
} from "@mui/material";

type Props = IconButtonProps & {
  iconSize?: number;
};

const CustomIconButton = styled(MuiIconButton)<Props>(({ iconSize }) => ({
  "& svg:first-of-type": {
    fontSize: iconSize || 22,
  },
}));

const IconButton = (props: Props) => {
  return <CustomIconButton {...props} />;
};

export default IconButton;
