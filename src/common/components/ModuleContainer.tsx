// commit to change to lf
import { Box, styled, Typography } from "@mui/material";
import { ArrowLeft as BackIcon } from "react-feather";

import { Button } from "@components";

type Props = {
  headerText?: string;
  headerControls?: any;
  handleBack?: () => void;
  largeGutter?: boolean;
  dashboard?: any;
  children: any;
  loading?: boolean;
  stackedHeaderControls?: boolean;
};

const Container = styled(Box)({
  paddingTop: 24,
  paddingBottom: 24,
});

const ControlButtonsContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",

  [theme.breakpoints.down("sm")]: {
    flexDirection: "column-reverse",
    alignItems: "unset",
  },
}));

const ModuleContainer = (props: Props) => {
  if (props.loading) return null;

  return (
    <Container>
      {props.dashboard}

      {props.headerText && (
        <Box
          sx={{
            mb: props.largeGutter ? "32px" : "16px",
            display: "flex",
            flexDirection: {
              xs: props.stackedHeaderControls ? "column" : "row",
              sm: "row",
            },
            gap: 2,
          }}
        >
          <Box display="flex" flexDirection="column" flexGrow={1}>
            {!!props.handleBack && props.headerControls ? (
              <Button
                variant="contained"
                color="error"
                startIcon={<BackIcon size={18} />}
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
                startIcon={<BackIcon size={18} />}
                sx={{ width: 120 }}
                onClick={props.handleBack}
              >
                Back
              </Button>
            </ControlButtonsContainer>
          ) : null}
        </Box>
      )}

      {props.children}
    </Container>
  );
};

export default ModuleContainer;
