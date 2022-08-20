import { styled, Typography } from "@mui/material";

type Props = {
  show?: boolean;
};

type Ext = {
  component: any;
};

const CustomTypography = styled(Typography)<Ext>({
  marginLeft: 4,
  color: "gray",
  fontSize: 11,
});

const RewatchIndicator = (props: Props) => {
  return props.show ? (
    <CustomTypography component="span">(Rewatch)</CustomTypography>
  ) : null;
};

export default RewatchIndicator;
