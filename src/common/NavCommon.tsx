import { useContext, useState } from "preact/hooks";
import { FontAwesomeSvgIcon } from "react-fontawesome-svg-icon";

import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Link,
  ListItemIcon,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  faBars as MenuIcon,
  faCode as DeveloperIcon,
  faMoon as DarkModeIcon,
  faSun as LightModeIcon,
} from "@fortawesome/free-solid-svg-icons";

import { ColorModeContext } from "./providers/ColorMode";

const RightMenuContainer = styled(Box)({
  marginLeft: 8,
});

const NavIcon = styled(FontAwesomeSvgIcon)({
  marginLeft: 8
});

const NavCommon = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [anchorNav, setAnchorNav] = useState<null | HTMLElement>(null);

  const handleOpenList = (event: any, menu: "nav" | "import" | "list") => {
    if (menu === "nav") setAnchorNav(event.currentTarget);
  };

  const handleCloseList = (menu: "nav" | "import" | "list") => {
    if (menu === "nav") setAnchorNav(null);
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
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              userSelect: "none",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Rin's Anime Database
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
              keepMounted
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={!!anchorNav}
              onClose={() => handleCloseList("nav")}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              <MenuItem
                component={Link}
                onClick={() => handleCloseList("nav")}
                href="https://rin.anidb.moe"
                target="_blank"
              >
                <ListItemIcon
                  children={<FontAwesomeSvgIcon icon={DeveloperIcon} />}
                />
                Developer
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
            Rin's AniDB
          </Typography>

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
              startIcon={<NavIcon icon={DeveloperIcon} />}
              href="https://rin.anidb.moe"
            >
              Developer
            </Button>
          </RightMenuContainer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavCommon;
