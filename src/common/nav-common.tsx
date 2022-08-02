import { useContext, useState } from "preact/hooks";

import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  styled,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import B4Icon from "@mui/icons-material/Brightness4"
import B7Icon from "@mui/icons-material/Brightness7"
import MenuIcon from "@mui/icons-material/Menu"
import PersonIcon from "@mui/icons-material/Person"

import { ColorModeContext } from "./providers/ColorMode";

const RightMenuContainer = styled(Box)({
  marginLeft: 8,
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
            Rin's AniDB
          </Typography>

          <Box flexGrow={1} sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              onClick={(e) => handleOpenList(e, "nav")}
              color="inherit"
              children={<MenuIcon />}
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
              <MenuItem onClick={() => handleCloseList("nav")}>
                <ListItemIcon children={<PersonIcon fontSize="small" />} />
                About
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
            {theme.palette.mode === "dark" ? <B7Icon /> : <B4Icon />}
          </IconButton>

          <RightMenuContainer sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              color="inherit"
              startIcon={<PersonIcon />}
              onClick={() => null}
            >
              About
            </Button>
          </RightMenuContainer>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default NavCommon;
