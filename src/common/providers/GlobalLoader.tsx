import { ComponentChildren, createContext } from "preact";
import { useMemo, useState } from "preact/hooks";

import { LinearProgress } from "@mui/material";

export const GlobalLoaderContext = createContext({
  isLoading: false,
  toggleLoader: (value: boolean) => {},
});

type Props = {
  children: JSX.Element;
};

const GlobalLoader = (props: Props) => {
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
      {loader && <LinearProgress color="secondary" />}
      {props.children}
    </GlobalLoaderContext.Provider>
  );
};

export default GlobalLoader;
