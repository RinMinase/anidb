import { useContext, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-slim";

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
  faArrowDownAZ as ByNameIcon,
  faArrowRightFromBracket as LogoutIcon,
  faBars as MenuIcon,
  faBook as CatalogsIcon,
  faCalendarDays as ByYearIcon,
  faClockRotateLeft as LastWatchIcon,
  faDatabase as DataManagementIcon,
  faFileLines as LogsIcon,
  faFlaskVial as BucketSimIcon,
  faHardDrive as BucketsIcon,
  faListUl as ListIcon,
  faMoon as DarkModeIcon,
  faMusic as AudioCodecIcon,
  faRss as RssIcon,
  faSun as LightModeIcon,
  faTv as MarathonsIcon,
  faUserGroup as GroupIcon,
  faUserTie as ManagementIcon,
  faVideo as VideoCodecIcon,
} from "@fortawesome/free-solid-svg-icons";

import { ColorModeContext } from "../providers/ColorMode";
import { GlobalLoaderContext } from "../providers/GlobalLoader";
import { Button, IconButton } from "@components";

const RightMenuContainer = styled(Box)({
  marginLeft: 8,
});

const NavIcon = styled(FontAwesomeSvgIcon)({
  marginLeft: 8,
});

const Nav = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [anchorNav, setAnchorNav] = useState<null | HTMLElement>(null);
  const [anchorList, setAnchorList] = useState<null | HTMLElement>(null);
  const [anchorManagement, setAnchorManagement] = useState<null | HTMLElement>(
    null,
  );

  const handleOpenList = (
    event: any,
    menu: "nav" | "import" | "list" | "mgmt",
  ) => {
    if (menu === "nav") setAnchorNav(event.currentTarget);
    if (menu === "list") setAnchorList(event.currentTarget);
    if (menu === "mgmt") setAnchorManagement(event.currentTarget);
  };

  const handleCloseList = (menu: "nav" | "import" | "list" | "mgmt") => {
    if (menu === "nav") setAnchorNav(null);
    if (menu === "list") setAnchorList(null);
    if (menu === "mgmt") setAnchorManagement(null);
  };

  const handleLogout = () => {
    toggleLoader(true);
    axios.post("/auth/logout").then(() => {
      toggleLoader(false);
      localStorage.clear();
      route("/");
    });
  };

  const MenuItemList = (props: { onClick: () => void }) => (
    <>
      <MenuItem
        component={"a" as any}
        href="/last-watch"
        onClick={props.onClick}
      >
        <ListItemIcon children={<FontAwesomeSvgIcon icon={LastWatchIcon} />} />
        Last Watched
      </MenuItem>
      <Divider />
      <MenuItem component={"a" as any} href="/by-name" onClick={props.onClick}>
        <ListItemIcon children={<FontAwesomeSvgIcon icon={ByNameIcon} />} />
        By Name
      </MenuItem>
      <MenuItem component={"a" as any} href="/by-year" onClick={props.onClick}>
        <ListItemIcon children={<FontAwesomeSvgIcon icon={ByYearIcon} />} />
        By Year
      </MenuItem>
      <Divider />
      <MenuItem component={"a" as any} href="/catalogs" onClick={props.onClick}>
        <ListItemIcon children={<FontAwesomeSvgIcon icon={CatalogsIcon} />} />
        Download Lists
      </MenuItem>
      <MenuItem
        component={"a" as any}
        href="/marathons"
        onClick={props.onClick}
      >
        <ListItemIcon children={<FontAwesomeSvgIcon icon={MarathonsIcon} />} />
        Marathon Lists
      </MenuItem>
      <MenuItem component={"a" as any} href="/buckets" onClick={props.onClick}>
        <ListItemIcon children={<FontAwesomeSvgIcon icon={BucketsIcon} />} />
        Bucket Lists
      </MenuItem>
      <MenuItem
        component={"a" as any}
        href="/bucket-sims"
        onClick={props.onClick}
      >
        <ListItemIcon children={<FontAwesomeSvgIcon icon={BucketSimIcon} />} />
        Bucket Simulator
      </MenuItem>
    </>
  );

  const MenuItemManagement = (props: { onClick: () => void }) => (
    <>
      <MenuItem
        component={"a" as any}
        href="/data-management"
        onClick={props.onClick}
      >
        <ListItemIcon
          children={<FontAwesomeSvgIcon icon={DataManagementIcon} />}
        />
        Data Management
      </MenuItem>
      <MenuItem component={"a" as any} href="/logs" onClick={props.onClick}>
        <ListItemIcon children={<FontAwesomeSvgIcon icon={LogsIcon} />} />
        Logs
      </MenuItem>
      <Divider />
      <MenuItem
        component={"a" as any}
        href="/audio-codecs"
        onClick={props.onClick}
      >
        <ListItemIcon children={<FontAwesomeSvgIcon icon={AudioCodecIcon} />} />
        Audio Codecs
      </MenuItem>
      <MenuItem
        component={"a" as any}
        href="/video-codecs"
        onClick={props.onClick}
      >
        <ListItemIcon children={<FontAwesomeSvgIcon icon={VideoCodecIcon} />} />
        Video Codecs
      </MenuItem>
      <MenuItem component={"a" as any} href="/groups" onClick={props.onClick}>
        <ListItemIcon children={<FontAwesomeSvgIcon icon={GroupIcon} />} />
        Groups
      </MenuItem>
    </>
  );

  return (
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
              children={<FontAwesomeSvgIcon icon={MenuIcon} />}
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
              <MenuItem
                onClick={() => {
                  handleCloseList("nav");
                  handleLogout();
                }}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={LogoutIcon} />}
                />
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
              startIcon={<NavIcon icon={ListIcon} />}
            >
              Special Lists
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
              startIcon={<NavIcon icon={ManagementIcon} />}
            >
              Management
            </Button>
            <Menu
              anchorEl={anchorManagement}
              open={!!anchorManagement}
              onClose={() => handleCloseList("mgmt")}
            >
              <MenuItemManagement onClick={() => handleCloseList("mgmt")} />
            </Menu>

            <Button
              iconSize={18}
              color="inherit"
              href="/rss"
              startIcon={<NavIcon icon={RssIcon} />}
            >
              RSS
            </Button>
          </Box>

          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? (
              <FontAwesomeSvgIcon icon={LightModeIcon} />
            ) : (
              <FontAwesomeSvgIcon icon={DarkModeIcon} />
            )}
          </IconButton>

          <RightMenuContainer sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              iconSize={18}
              color="inherit"
              startIcon={<NavIcon icon={LogoutIcon} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </RightMenuContainer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Nav;
