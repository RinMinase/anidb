import { createContext } from "preact";
import { useMemo, useState } from "preact/hooks";

import { Box, LinearProgress, styled } from "@mui/material";

export const GlobalLoaderContext = createContext({
  isLoading: false,
  // eslint-disable-next-line
  toggleLoader: (value: boolean) => {},
});

const Progress = styled(LinearProgress)(({ theme }) => ({
  position: "sticky",
  width: "100%",
  zIndex: 99999,
  top: 52,
  [theme.breakpoints.up("md")]: {
    top: 48,
  },
}));

const Container = styled(Box)({
  position: "relative",
});

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
      <Container>{props.children}</Container>
    </GlobalLoaderContext.Provider>
  );
};

export default GlobalLoader;
