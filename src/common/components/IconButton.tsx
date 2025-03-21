import {
  IconButton as MuiIconButton,
  IconButtonProps,
  styled,
} from "@mui/material";

type Props = IconButtonProps & {
  iconSize?: number;
};

const CustomIconButton = styled(MuiIconButton)<Props>(({ iconSize }) => ({
  "&.MuiIconButton-sizeMedium svg:first-of-type": {
    fontSize: 22,
  },
  "&.MuiIconButton-sizeSmall svg:first-of-type": {
    fontSize: 18,
  },
  "& svg:first-of-type": {
    fontSize: iconSize,
  },
}));

const IconButton = ({ ...props }: Props) => {
  return <CustomIconButton {...props} />;
};

export default IconButton;
