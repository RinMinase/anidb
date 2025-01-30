import { Box } from "@mui/material";
import { JSX } from "preact/jsx-runtime";

export interface TabPanelProps {
  children?: JSX.Element;
  tabIndex: number;
  currentTab: number;
}

export const TabPanel = (props: TabPanelProps) => {
  const { children, currentTab, tabIndex, ...other } = props;

  if (currentTab !== tabIndex) return null;

  return (
    <Box role="tabpanel" sx={{ p: 2 }} {...other}>
      {children}
    </Box>
  );
};

export default TabPanel;
