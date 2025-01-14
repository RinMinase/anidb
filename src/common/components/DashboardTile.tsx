import {
  Box,
  Divider,
  Grid2 as Grid,
  Paper,
  Skeleton,
  styled,
  Typography,
} from "@mui/material";

type Props = {
  onClick?: any;
  icon?: any;
  iconColor?: string;
  heading: string;
  mediumText?: boolean;
  largeText?: boolean;
  subHeading?: string;
  value: string | number | null | undefined;
  CustomDivider?: any;
  footer?: string;
  footers?: string[];
  footerLeft?: string;
  footerRight?: string;
  footerFontSize?: number;
  isLoading?: boolean;
  isFooterRightLoading?: boolean;
};

type DashboardItemProps = {
  hasOnclick?: boolean;
};

type DashboardIconProps = {
  iconColor?: string;
};

const DashboardItem = styled(Paper)<DashboardItemProps>(({ hasOnclick }) => ({
  cursor: hasOnclick ? "pointer" : "",

  marginTop: 24,
  minHeight: 145,
  height: "calc(100% - 24px)",

  display: "flex",
  flexDirection: "column",

  textAlign: "right",
  position: "relative",
}));

const DashboardIcon = styled(Box)<DashboardIconProps>(({ iconColor }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: iconColor || "#cecece",
  color: "#fff",
  borderRadius: 4,

  position: "absolute",
  top: -15,
  left: 20,

  width: 56,
  height: 56,
}));

const DashboardFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const DashboardTile = (props: Props) => {
  const hasFooter = () => {
    return (
      props.footer ||
      props.footerLeft ||
      props.footerRight ||
      props.footers?.length
    );
  };

  return (
    <DashboardItem onClick={props.onClick} hasOnclick={!!props.onClick}>
      <Box sx={{ padding: 2, flexGrow: 1 }}>
        {props.icon && (
          <DashboardIcon
            iconColor={props.iconColor || "#cecece"}
            children={props.icon}
          />
        )}

        <Typography variant="body2">{props.heading}</Typography>
        {props.largeText ? (
          <Typography variant="h3">
            {props.isLoading ? <Skeleton animation="wave" /> : props.value}
          </Typography>
        ) : props.mediumText ? (
          <Typography variant="h3" fontSize={42}>
            {props.isLoading ? <Skeleton animation="wave" /> : props.value}
          </Typography>
        ) : (
          <Typography variant="h4">
            {props.isLoading ? <Skeleton animation="wave" /> : props.value}
          </Typography>
        )}

        {props.subHeading && (
          <Typography variant="caption">{props.subHeading}</Typography>
        )}
      </Box>
      {props.CustomDivider ? (
        props.CustomDivider
      ) : hasFooter() ? (
        <Divider />
      ) : null}
      {(props.footerLeft || props.footerRight) && (
        <DashboardFooter sx={{ fontSize: props.footerFontSize ?? undefined }}>
          <Grid container justifyContent="space-between">
            <Grid>{props.footerLeft}</Grid>
            <Grid sx={{ textAlign: "right" }}>
              {props.isFooterRightLoading ? (
                <Skeleton animation="wave" sx={{ minWidth: "30px" }} />
              ) : (
                props.footerRight
              )}
            </Grid>
          </Grid>
          <Typography variant="caption">{props.footer}</Typography>
        </DashboardFooter>
      )}
      {props.footer && (
        <DashboardFooter sx={{ fontSize: props.footerFontSize ?? undefined }}>
          <Typography variant="caption">{props.footer}</Typography>
        </DashboardFooter>
      )}
      {props.footers &&
        props.footers.map((item, index) => (
          <DashboardFooter
            key={`dash-${index}`}
            sx={{ fontSize: props.footerFontSize ?? undefined }}
          >
            <Typography variant="caption">{item}</Typography>
          </DashboardFooter>
        ))}
    </DashboardItem>
  );
};

export default DashboardTile;
