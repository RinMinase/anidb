import { Box, Divider, Grid, Paper, styled, Typography } from "@mui/material";

type Props = {
  onClick?: any;
  icon?: any;
  iconColor?: string;
  heading: string;
  largeText?: boolean;
  subHeading?: string;
  value: string | number | null | undefined;
  CustomDivider?: any;
  footer?: string;
  footers?: string[];
  footerLeft?: string;
  footerRight?: string;
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

const DashboardContainer = styled(Box)({
  padding: 16,
  flexGrow: 1,
});

const DashboardIcon = styled(Box)<DashboardIconProps>(({ iconColor }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: iconColor || "#cecece",
  color: "#fff",

  position: "absolute",
  top: -15,
  left: 20,

  width: 56,
  height: 56,
}));

const DashboardFooter = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1, 2),
}));

const FooterRight = styled(Grid)({
  textAlign: "right",
});

const DashboardTile = (props: Props) => {
  return (
    <DashboardItem onClick={props.onClick} hasOnclick={!!props.onClick}>
      <DashboardContainer>
        {props.icon && (
          <DashboardIcon
            iconColor={props.iconColor || "#cecece"}
            children={props.icon}
          />
        )}

        <Typography variant="body2">{props.heading}</Typography>
        {props.largeText ? (
          <Typography variant="h3">{props.value}</Typography>
        ) : (
          <Typography variant="h4">{props.value}</Typography>
        )}

        {props.subHeading && (
          <Typography variant="caption">{props.subHeading}</Typography>
        )}
      </DashboardContainer>
      {props.CustomDivider ? props.CustomDivider : <Divider />}
      {(props.footerLeft || props.footerRight) && (
        <DashboardFooter>
          <Grid container justifyContent="space-between">
            <Grid item>{props.footerLeft}</Grid>
            <FooterRight item>{props.footerRight}</FooterRight>
          </Grid>
          <Typography variant="caption">{props.footer}</Typography>
        </DashboardFooter>
      )}
      {props.footer && (
        <DashboardFooter>
          <Typography variant="caption">{props.footer}</Typography>
        </DashboardFooter>
      )}
      {props.footers &&
        props.footers.map((item, index) => (
          <DashboardFooter key={`dash-${index}`}>
            <Typography variant="caption">{item}</Typography>
          </DashboardFooter>
        ))}
    </DashboardItem>
  );
};

export default DashboardTile;