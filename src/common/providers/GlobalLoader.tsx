import { createContext } from "preact";
import { useMemo, useState } from "preact/hooks";

import { Box, LinearProgress, styled } from "@mui/material";

export const GlobalLoaderContext = createContext({
  isLoading: false,
  // eslint-disable-next-line
  toggleLoader: (value: boolean) => {},
});

const Container = styled(Box)({
  position: "relative",
});

const Progress = styled(LinearProgress)({
  position: "absolute",
  width: "100%",
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
      <Container>
        {loader && <Progress color="secondary" />}
        {props.children}
      </Container>
    </GlobalLoaderContext.Provider>
  );
};

export default GlobalLoader;
