import { FontAwesomeSvgIcon } from "react-fontawesome-slim";
import { Box, styled, Typography } from "@mui/material";

import { faArrowLeftLong as BackIcon } from "@fortawesome/free-solid-svg-icons";

import { Button } from "@components";

type Props = {
  headerText?: string;
  headerControls?: any;
  handleBack?: () => void;
  largeGutter?: boolean;
  children: any;
};

type HeaderProps = {
  largeGutter?: boolean;
};

const Container = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const Header = styled(Box)<HeaderProps>(({ largeGutter }) => ({
  display: "flex",
  marginBottom: largeGutter ? 32 : 16,
}));

const ControlButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
    alignItems: "unset",
  },
}));

const ModuleContainer = (props: Props) => (
  <Container>
    {props.headerText && (
      <Header largeGutter={props.largeGutter}>
        <Box display="flex" flexDirection="column" flexGrow={1}>
          {!!props.handleBack && props.headerControls ? (
            <Button
              variant="contained"
              color="error"
              startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
              sx={{
                display: { xs: "inline-flex", sm: "none" },
                width: 120,
                marginBottom: 2,
              }}
              onClick={props.handleBack}
            >
              Back
            </Button>
          ) : null}

          <Typography variant="h5" alignItems="center">
            {props.headerText}
          </Typography>
        </Box>

        {props.headerControls ? (
          <ControlButtonsContainer>
            {props.headerControls}
          </ControlButtonsContainer>
        ) : null}

        {!props.headerControls && !!props.handleBack ? (
          <ControlButtonsContainer>
            <Button
              variant="contained"
              color="error"
              startIcon={<FontAwesomeSvgIcon icon={BackIcon} />}
              sx={{
                width: 120,
                marginBottom: 2,
              }}
              onClick={props.handleBack}
            >
              Back
            </Button>
          </ControlButtonsContainer>
        ) : null}
      </Header>
    )}

    {props.children}
  </Container>
);

export default ModuleContainer;
