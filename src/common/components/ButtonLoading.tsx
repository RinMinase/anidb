import { Button, ButtonProps, styled } from "@mui/material";

type Props = ButtonProps & {
  iconSize?: number;
};

const CustomButton = styled(Button)<Props>(({ iconSize }) => ({
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

const ButtonLoading = ({ loading, endIcon, startIcon, ...props }: Props) => {
  return (
    <CustomButton
      {...props}
      loading={loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
    />
  );
};

export default ButtonLoading;
