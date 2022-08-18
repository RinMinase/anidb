import { useContext, useState } from "preact/hooks";
import { route } from "preact-router";
import axios from "axios";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";

import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
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
  faDatabase as ImportMenuIcon,
  faHardDrive as BucketsIcon,
  faListUl as ListIcon,
  faMoon as DarkModeIcon,
  faSun as LightModeIcon,
  faTv as MarathonsIcon,
  faUser as AboutIcon,
} from "@fortawesome/free-solid-svg-icons";

import { ColorModeContext } from "./providers/ColorMode";
import { GlobalLoaderContext } from "./providers/GlobalLoader";

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

  const handleOpenList = (event: any, menu: "nav" | "import" | "list") => {
    if (menu === "nav") setAnchorNav(event.currentTarget);
    if (menu === "list") setAnchorList(event.currentTarget);
  };

  const handleCloseList = (menu: "nav" | "import" | "list") => {
    if (menu === "nav") setAnchorNav(null);
    if (menu === "list") setAnchorList(null);
  };

  const handleLogout = () => {
    toggleLoader(true);
    axios.post("/auth/logout").then(() => {
      toggleLoader(false);
      localStorage.clear();
      route("/");
    });
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar variant="dense" disableGutters>
          <Typography
            variant="h6"
            component="a"
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
              size="large"
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
              <MenuItem
                component="a"
                href="/last-watch"
                onClick={() => handleCloseList("nav")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={LastWatchIcon} />}
                />
                Last Watched
              </MenuItem>
              <Divider />
              <MenuItem
                component="a"
                href="/by-name"
                onClick={() => handleCloseList("nav")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={ByNameIcon} />}
                />
                By Name
              </MenuItem>
              <MenuItem
                component="a"
                href="/by-year"
                onClick={() => handleCloseList("nav")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={ByYearIcon} />}
                />
                By Year
              </MenuItem>
              <Divider />
              <MenuItem
                component="a"
                href="/catalogs"
                onClick={() => handleCloseList("nav")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={CatalogsIcon} />}
                />
                Catalog Lists
              </MenuItem>
              <MenuItem
                component="a"
                href="/marathons"
                onClick={() => handleCloseList("nav")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={MarathonsIcon} />}
                />
                Marathon Lists
              </MenuItem>
              <MenuItem
                component="a"
                href="/buckets"
                onClick={() => handleCloseList("nav")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={BucketsIcon} />}
                />
                Bucket Lists
              </MenuItem>
              <Divider />
              <MenuItem
                component="a"
                href="/about"
                onClick={() => handleCloseList("nav")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={AboutIcon} />}
                />
                About
              </MenuItem>
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
            component="a"
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
              color="inherit"
              onClick={(e) => handleOpenList(e, "list")}
              startIcon={<NavIcon icon={ListIcon} />}
            >
              Special Lists
            </Button>
            <Menu
              anchorEl={anchorList}
              open={!!anchorList}
              onClose={() => handleCloseList("list")}
            >
              <MenuItem
                component="a"
                href="/last-watch"
                onClick={() => handleCloseList("list")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={LastWatchIcon} />}
                />
                Last Watched
              </MenuItem>
              <Divider />
              <MenuItem
                component="a"
                href="/by-name"
                onClick={() => handleCloseList("list")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={ByNameIcon} />}
                />
                By Name
              </MenuItem>
              <MenuItem
                component="a"
                href="/by-year"
                onClick={() => handleCloseList("list")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={ByYearIcon} />}
                />
                By Year
              </MenuItem>
              <Divider />
              <MenuItem
                component="a"
                href="/catalogs"
                onClick={() => handleCloseList("list")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={CatalogsIcon} />}
                />
                Download Lists
              </MenuItem>
              <MenuItem
                component="a"
                href="/marathons"
                onClick={() => handleCloseList("list")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={MarathonsIcon} />}
                />
                Marathon Lists
              </MenuItem>
              <MenuItem
                component="a"
                href="/buckets"
                onClick={() => handleCloseList("list")}
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={BucketsIcon} />}
                />
                Bucket Lists
              </MenuItem>
            </Menu>

            <Button
              color="inherit"
              href="/data-management"
              startIcon={<NavIcon icon={ImportMenuIcon} />}
            >
              Data Management
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
              color="inherit"
              startIcon={<NavIcon icon={AboutIcon} />}
              onClick={() => null}
            >
              About
            </Button>
            <Button
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
