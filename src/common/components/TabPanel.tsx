import { Box, BoxProps } from "@mui/material";
import { JSX } from "preact/jsx-runtime";

export interface TabPanelProps extends BoxProps {
  children?: JSX.Element;
  tabIndex: number;
  currentTab: number;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, currentTab, tabIndex, ...other } = props;

  if (currentTab !== tabIndex) return null;

  return (
    <Box role="tabpanel" p={2} {...other}>
      {children}
    </Box>
  );
};

export default TabPanel;
