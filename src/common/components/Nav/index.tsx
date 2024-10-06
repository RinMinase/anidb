import { useContext, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";

import {
  AppBar,
  Box,
  Container,
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  Menu as MenuIcon,
  List as ListIcon,
  User as ManagementIcon,
  Box as OtherIcon,
  Sun as LightModeIcon,
  Moon as DarkModeIcon,
  LogOut as LogoutIcon,
} from "react-feather";

import {
  Button,
  IconButton,
  ColorModeContext,
  ButtonLoading,
  GlobalLoader,
} from "@components";

import { MenuItemList, MenuItemManagement, MenuItemOther } from "./components";

type NavMenu = "nav" | "import" | "list" | "mgmt" | "other";

const RightMenuContainer = styled(Box)({
  marginLeft: 8,
});

const Nav = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [isLogoutLoading, setLogoutLoading] = useState(false);

  const [anchorNav, setAnchorNav] = useState<HTMLButtonElement>();
  const [anchorList, setAnchorList] = useState<HTMLButtonElement>();
  const [anchorMgmt, setAnchorMgmt] = useState<HTMLButtonElement>();
  const [anchorOther, setAnchorOther] = useState<HTMLButtonElement>();

  const handleOpenList = (event: any, menu: NavMenu) => {
    if (menu === "nav") setAnchorNav(event.currentTarget);
    if (menu === "list") setAnchorList(event.currentTarget);
    if (menu === "mgmt") setAnchorMgmt(event.currentTarget);
    if (menu === "other") setAnchorOther(event.currentTarget);
  };

  const handleCloseList = (menu: NavMenu) => {
    if (menu === "nav") setAnchorNav(undefined);
    if (menu === "list") setAnchorList(undefined);
    if (menu === "mgmt") setAnchorMgmt(undefined);
    if (menu === "other") setAnchorOther(undefined);
  };

  const handleLogout = async () => {
    setLogoutLoading(true);

    await axios.post("/auth/logout");

    setLogoutLoading(false);
    localStorage.clear();
    route("/");
  };

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar variant="dense" disableGutters>
            <Typography
              variant="h6"
              component={"a" as any}
              href="/"
              sx={{
                mr: 2,
                display: { xs: "none", md: "flex" },
                userSelect: "none",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {import.meta.env.VITE_CUSTOM_TITLE || "Rin's Anime Database"}
            </Typography>

            <Box flexGrow={1} sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                onClick={(e) => handleOpenList(e, "nav")}
                color="inherit"
                children={<MenuIcon size={24} />}
              />
              <Menu
                anchorEl={anchorNav}
                open={!!anchorNav}
                keepMounted
                onClose={() => handleCloseList("nav")}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                sx={{
                  display: { xs: "block", md: "none" },
                }}
              >
                <MenuItemList onClick={() => handleCloseList("nav")} />
                <Divider />
                <MenuItemManagement onClick={() => handleCloseList("nav")} />
                <Divider />
                <MenuItemOther onClick={() => handleCloseList("nav")} />
                <Divider />
                <MenuItem
                  onClick={() => {
                    handleCloseList("nav");
                    handleLogout();
                  }}
                >
                  <ListItemIcon children={<LogoutIcon size={20} />} />
                  Logout
                </MenuItem>
              </Menu>
            </Box>

            <Typography
              variant="h6"
              noWrap
              component={"a" as any}
              href="/"
              sx={{
                display: { xs: "flex", md: "none" },
                mr: 2,
                flexGrow: 1,
                color: "inherit",
                textDecoration: "none",
              }}
            >
              {import.meta.env.VITE_CUSTOM_TITLE || "Rin's AniDB"}
            </Typography>

            <Box flexGrow={1} sx={{ display: { xs: "none", md: "flex" } }}>
              <Button
                iconSize={18}
                color="inherit"
                onClick={(e: any) => handleOpenList(e, "list")}
                startIcon={<ListIcon size={18} />}
              >
                Lists
              </Button>
              <Menu
                anchorEl={anchorList}
                open={!!anchorList}
                onClose={() => handleCloseList("list")}
              >
                <MenuItemList onClick={() => handleCloseList("list")} />
              </Menu>

              <Button
                iconSize={18}
                color="inherit"
                onClick={(e: any) => handleOpenList(e, "mgmt")}
                startIcon={<ManagementIcon size={18} />}
              >
                Management
              </Button>
              <Menu
                anchorEl={anchorMgmt}
                open={!!anchorMgmt}
                onClose={() => handleCloseList("mgmt")}
              >
                <MenuItemManagement onClick={() => handleCloseList("mgmt")} />
              </Menu>

              <Button
                iconSize={18}
                color="inherit"
                onClick={(e: any) => handleOpenList(e, "other")}
                startIcon={<OtherIcon size={18} />}
              >
                Other
              </Button>
              <Menu
                anchorEl={anchorOther}
                open={!!anchorOther}
                onClose={() => handleCloseList("other")}
              >
                <MenuItemOther onClick={() => handleCloseList("other")} />
              </Menu>
            </Box>

            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
              {theme.palette.mode === "dark" ? (
                <LightModeIcon size={20} />
              ) : (
                <DarkModeIcon size={20} />
              )}
            </IconButton>

            <RightMenuContainer sx={{ display: { xs: "none", md: "flex" } }}>
              <ButtonLoading
                iconSize={18}
                color="inherit"
                startIcon={<LogoutIcon size={16} />}
                loading={isLogoutLoading}
                onClick={handleLogout}
              >
                Logout
              </ButtonLoading>
            </RightMenuContainer>
          </Toolbar>
        </Container>
      </AppBar>
      {isLogoutLoading && <GlobalLoader />}
    </>
  );
};

export default Nav;
