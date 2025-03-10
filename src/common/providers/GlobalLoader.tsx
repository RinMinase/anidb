import { createContext } from "preact";
import { useMemo, useState } from "preact/hooks";
import { Box, LinearProgress, styled } from "@mui/material";

export const GlobalLoaderContext = createContext({
  isLoading: false,
  // eslint-disable-next-line
  toggleLoader: (value: boolean) => {},
});

type ContainerProps = {
  disableScroll?: boolean;
  id?: string;
};

export const Progress = styled(LinearProgress)(({ theme }) => ({
  position: "fixed",
  width: "100%",
  zIndex: 99999,
  top: 52,

  [theme.breakpoints.up("md")]: {
    top: 48,
  },
}));

const Container = styled(Box)<ContainerProps>(({ theme, disableScroll }) => ({
  position: "relative",
  overflowY: disableScroll ? "unset" : "scroll",
  height: "calc(100vh - 52px)",

  [theme.breakpoints.up("md")]: {
    height: "calc(100vh - 48px)",
  },
}));

const GlobalLoader = (props: any) => {
  const [loader, setLoader] = useState(false);

  const globalLoader = useMemo(
    () => (value: boolean) => {
      setLoader(() => value);
    },
    [],
  );

  return (
    <GlobalLoaderContext.Provider
      value={{
        isLoading: loader,
        toggleLoader: globalLoader,
      }}
    >
      {loader && <Progress />}
      <Container disableScroll={props.disableScroll} id={props.id}>
        {props.children}
      </Container>
    </GlobalLoaderContext.Provider>
  );
};

export default GlobalLoader;
