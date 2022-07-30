import { useContext, useState } from "preact/hooks";

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
  Brightness4 as B4Icon,
  Brightness7 as B7Icon,
  CalendarMonth as CalendarIcon,
  CloudDownload as DownloadIcon,
  FormatListBulleted as ListMenuIcon,
  FileUpload as ImportIcon,
  FileDownload as ExportIcon,
  ImportExport as ImportMenuIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  SortByAlpha as SortIcon,
  Storage as StorageIcon,
  Tv as TvIcon,
} from "@mui/icons-material";

import { ColorModeContext } from "src/main";

const RightMenuContainer = styled(Box)({
  marginLeft: 8,
});

const Nav = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);

  const [anchorNav, setAnchorNav] = useState<null | HTMLElement>(null);
  const [anchorList, setAnchorList] = useState<null | HTMLElement>(null);
  const [anchorImport, setAnchorImport] = useState<null | HTMLElement>(null);

  const handleOpenList = (event: any, menu: "nav" | "import" | "list") => {
    if (menu === "nav") setAnchorNav(event.currentTarget);
    if (menu === "list") setAnchorList(event.currentTarget);
    if (menu === "import") setAnchorImport(event.currentTarget);
  };

  const handleCloseList = (menu: "nav" | "import" | "list") => {
    if (menu === "nav") setAnchorNav(null);
    if (menu === "list") setAnchorList(null);
    if (menu === "import") setAnchorImport(null);
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
                onClick={() => handleCloseList("nav")}
                href="/"
              >
                <ListItemIcon children={<PlayIcon fontSize="small" />} />
                Last Watched
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleCloseList("nav")}>
                <ListItemIcon children={<SortIcon fontSize="small" />} />
                By Name
              </MenuItem>
              <MenuItem onClick={() => handleCloseList("nav")}>
                <ListItemIcon children={<CalendarIcon fontSize="small" />} />
                By Year
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleCloseList("nav")}>
                <ListItemIcon children={<DownloadIcon fontSize="small" />} />
                Download Lists
              </MenuItem>
              <MenuItem onClick={() => handleCloseList("nav")}>
                <ListItemIcon children={<TvIcon fontSize="small" />} />
                Marathon Lists
              </MenuItem>
              <MenuItem onClick={() => handleCloseList("nav")}>
                <ListItemIcon children={<StorageIcon fontSize="small" />} />
                Bucket Lists
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleCloseList("nav")}>
                <ListItemIcon children={<PersonIcon fontSize="small" />} />
                About
              </MenuItem>
              <MenuItem onClick={() => handleCloseList("nav")}>
                <ListItemIcon children={<LogoutIcon fontSize="small" />} />
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
            Rin's AniDB
          </Typography>

          <Box flexGrow={1} sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              color="inherit"
              onClick={(e) => handleOpenList(e, "list")}
              startIcon={<ListMenuIcon />}
            >
              Special Lists
            </Button>
            <Menu
              anchorEl={anchorList}
              open={!!anchorList}
              onClose={() => handleCloseList("list")}
            >
              <MenuItem onClick={() => handleCloseList("list")}>
                <ListItemIcon children={<PlayIcon fontSize="small" />} />
                Last Watched
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleCloseList("list")}>
                <ListItemIcon children={<SortIcon fontSize="small" />} />
                By Name
              </MenuItem>
              <MenuItem onClick={() => handleCloseList("list")}>
                <ListItemIcon children={<CalendarIcon fontSize="small" />} />
                By Year
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => handleCloseList("list")}>
                <ListItemIcon children={<DownloadIcon fontSize="small" />} />
                Download Lists
              </MenuItem>
              <MenuItem onClick={() => handleCloseList("list")}>
                <ListItemIcon children={<TvIcon fontSize="small" />} />
                Marathon Lists
              </MenuItem>
              <MenuItem onClick={() => handleCloseList("list")}>
                <ListItemIcon children={<StorageIcon fontSize="small" />} />
                Bucket Lists
              </MenuItem>
            </Menu>

            <Button
              color="inherit"
              onClick={(e) => handleOpenList(e, "import")}
              startIcon={<ImportMenuIcon />}
            >
              Import / Export
            </Button>
            <Menu
              anchorEl={anchorImport}
              open={!!anchorImport}
              onClose={() => handleCloseList("import")}
            >
              <MenuItem onClick={() => handleCloseList("import")}>
                <ListItemIcon children={<ImportIcon fontSize="small" />} />
                Import Data
              </MenuItem>
              <MenuItem onClick={() => handleCloseList("import")}>
                <ListItemIcon children={<ExportIcon fontSize="small" />} />
                Export Data
              </MenuItem>
            </Menu>
          </Box>

          <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === "dark" ? <B7Icon /> : <B4Icon />}
          </IconButton>

          <RightMenuContainer sx={{ display: { xs: "none", md: "flex" } }}>
            <Button
              color="inherit"
              startIcon={<PersonIcon />}
              onClick={() => {}}
            >
              About
            </Button>
            <Button
              color="inherit"
              startIcon={<LogoutIcon />}
              onClick={() => {}}
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
