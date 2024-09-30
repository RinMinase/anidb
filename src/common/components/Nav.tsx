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
  List as ListIcon,
  Rss as RssIcon,
  User as ManagementIcon,
  Sun as LightModeIcon,
  Moon as DarkModeIcon,
  LogOut as LogoutIcon,
  Search as SearchIcon,
  RotateCcw as LastWatchIcon,
  Type as ByNameIcon,
  Calendar as ByYearIcon,
  Tv as MarathonsIcon,
  HardDrive as BucketsIcon,
  Cpu as BucketSimIcon,
  Bookmark as CatalogsIcon,
  Database as DataManagementIcon,
  FileText as LogsIcon,
  Headphones as AudioCodecIcon,
  Video as VideoCodecIcon,
  Users as GroupIcon,
  Menu as MenuIcon,
} from "react-feather";

import { ColorModeContext } from "../providers/ColorMode";
import { GlobalLoaderContext } from "../providers/GlobalLoader";
import { Button, IconButton } from "@components";

const RightMenuContainer = styled(Box)({
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
      <MenuItem component={"a" as any} href="/search" onClick={props.onClick}>
        <ListItemIcon children={<SearchIcon size={18} />} />
        Advanced Seearch
      </MenuItem>
      <MenuItem
        component={"a" as any}
        href="/last-watch"
        onClick={props.onClick}
      >
        <ListItemIcon children={<LastWatchIcon size={18} />} />
        Last Watched
      </MenuItem>
      <Divider />
      <MenuItem component={"a" as any} href="/by-name" onClick={props.onClick}>
        <ListItemIcon children={<ByNameIcon size={18} />} />
        By Name
      </MenuItem>
      <MenuItem component={"a" as any} href="/by-year" onClick={props.onClick}>
        <ListItemIcon children={<ByYearIcon size={18} />} />
        By Year
      </MenuItem>
      <Divider />
      <MenuItem component={"a" as any} href="/catalogs" onClick={props.onClick}>
        <ListItemIcon children={<CatalogsIcon size={18} />} />
        Download Lists
      </MenuItem>
      <MenuItem
        component={"a" as any}
        href="/marathons"
        onClick={props.onClick}
      >
        <ListItemIcon children={<MarathonsIcon size={18} />} />
        Marathon Lists
      </MenuItem>
      <MenuItem component={"a" as any} href="/buckets" onClick={props.onClick}>
        <ListItemIcon children={<BucketsIcon size={18} />} />
        Bucket Lists
      </MenuItem>
      <MenuItem
        component={"a" as any}
        href="/bucket-sims"
        onClick={props.onClick}
      >
        <ListItemIcon children={<BucketSimIcon size={18} />} />
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
        <ListItemIcon children={<DataManagementIcon size={18} />} />
        Data Management
      </MenuItem>
      <MenuItem component={"a" as any} href="/logs" onClick={props.onClick}>
        <ListItemIcon children={<LogsIcon size={18} />} />
        Logs
      </MenuItem>
      <Divider />
      <MenuItem
        component={"a" as any}
        href="/audio-codecs"
        onClick={props.onClick}
      >
        <ListItemIcon children={<AudioCodecIcon size={18} />} />
        Audio Codecs
      </MenuItem>
      <MenuItem
        component={"a" as any}
        href="/video-codecs"
        onClick={props.onClick}
      >
        <ListItemIcon children={<VideoCodecIcon size={18} />} />
        Video Codecs
      </MenuItem>
      <MenuItem component={"a" as any} href="/groups" onClick={props.onClick}>
        <ListItemIcon children={<GroupIcon size={18} />} />
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
              startIcon={<ManagementIcon size={18} />}
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
              startIcon={<RssIcon size={18} />}
            >
              RSS
            </Button>
          </Box>

          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? (
              <LightModeIcon size={20} />
            ) : (
              <DarkModeIcon size={20} />
            )}
          </IconButton>

          <RightMenuContainer sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              iconSize={18}
              color="inherit"
              startIcon={<LogoutIcon size={16} />}
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
