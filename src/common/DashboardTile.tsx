import { Fragment } from "preact";
import { Box, Divider, Paper, styled, Typography } from "@mui/material";

type Props = {
  icon?: any;
  iconColor?: string;
  heading: string;
  value: string | number | null | undefined;
  footer?: string;
  footers?: string[];
};

type DashboardIconProps = {
  iconColor?: string;
};

const DashboardItem = styled(Paper)({
  marginTop: 24,
  textAlign: "right",
  position: "relative",
  minHeight: 145,
});

const DashboardContainer = styled(Box)({
  padding: 16,
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

const DashboardTile = (props: Props) => {
  return (
    <DashboardItem>
      <DashboardContainer>
        {props.icon && (
          <DashboardIcon
            iconColor={props.iconColor || "#cecece"}
            children={props.icon}
          />
        )}

        <Typography variant="body2">{props.heading}</Typography>
        <Typography variant="h4">{props.value}</Typography>
      </DashboardContainer>
      {props.footer && (
        <>
          <Divider />
          <DashboardFooter>
            <Typography variant="caption">{props.footer}</Typography>
          </DashboardFooter>
        </>
      )}
      {props.footers &&
        props.footers.map((item, index) => (
          <Fragment key={`dash-${index}`}>
            <Divider />
            <DashboardFooter>
              <Typography variant="caption">{item}</Typography>
            </DashboardFooter>
          </Fragment>
        ))}
    </DashboardItem>
  );
};

export default DashboardTile;
