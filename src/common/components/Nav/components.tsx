import { Divider, ListItemIcon, MenuItem } from "@mui/material";

import {
  Rss as RssIcon,
  Search as SearchIcon,
  RotateCcw as LastWatchIcon,
  Server as AllEntryDataIcon,
  Type as ByNameIcon,
  Calendar as ByYearIcon,
  Tag as ByGenreIcon,
  Tv as MarathonsIcon,
  HardDrive as BucketsIcon,
  Cpu as BucketSimIcon,
  Bookmark as CatalogsIcon,
  Database as DataManagementIcon,
  FileText as LogsIcon,
  Headphones as AudioCodecIcon,
  Video as VideoCodecIcon,
  Users as GroupIcon,
  Monitor as PCSetupsIcon,
} from "react-feather";

const PCOwnersIcon = GroupIcon;
const PCComponentsIcon = BucketSimIcon;

export const MenuItemList = (props: { onClick: () => void }) => (
  <>
    <MenuItem component={"a" as any} href="/search" onClick={props.onClick}>
      <ListItemIcon children={<SearchIcon size={18} strokeWidth={1.5} />} />
      Advanced Search
    </MenuItem>
    <MenuItem component={"a" as any} href="/last-watch" onClick={props.onClick}>
      <ListItemIcon children={<LastWatchIcon size={18} strokeWidth={1.5} />} />
      Last Watched
    </MenuItem>
    <MenuItem component={"a" as any} href="/entries" onClick={props.onClick}>
      <ListItemIcon
        children={<AllEntryDataIcon size={18} strokeWidth={1.5} />}
      />
      All Entry Data
    </MenuItem>
    <Divider />
    <MenuItem component={"a" as any} href="/by-name" onClick={props.onClick}>
      <ListItemIcon children={<ByNameIcon size={18} strokeWidth={1.5} />} />
      By Name
    </MenuItem>
    <MenuItem component={"a" as any} href="/by-year" onClick={props.onClick}>
      <ListItemIcon children={<ByYearIcon size={18} strokeWidth={1.5} />} />
      By Year
    </MenuItem>
    <MenuItem component={"a" as any} href="/by-genre" onClick={props.onClick}>
      <ListItemIcon children={<ByGenreIcon size={18} strokeWidth={1.5} />} />
      By Genre
    </MenuItem>
    <Divider />
    <MenuItem component={"a" as any} href="/catalogs" onClick={props.onClick}>
      <ListItemIcon children={<CatalogsIcon size={18} strokeWidth={1.5} />} />
      Download Lists
    </MenuItem>
    <MenuItem component={"a" as any} href="/marathons" onClick={props.onClick}>
      <ListItemIcon children={<MarathonsIcon size={18} strokeWidth={1.5} />} />
      Marathon Lists
    </MenuItem>
    <MenuItem component={"a" as any} href="/buckets" onClick={props.onClick}>
      <ListItemIcon children={<BucketsIcon size={18} strokeWidth={1.5} />} />
      Bucket Lists
    </MenuItem>
    <MenuItem
      component={"a" as any}
      href="/bucket-sims"
      onClick={props.onClick}
    >
      <ListItemIcon children={<BucketSimIcon size={18} strokeWidth={1.5} />} />
      Bucket Simulator
    </MenuItem>
  </>
);

export const MenuItemManagement = (props: { onClick: () => void }) => (
  <>
    <MenuItem
      component={"a" as any}
      href="/data-management"
      onClick={props.onClick}
    >
      <ListItemIcon
        children={<DataManagementIcon size={18} strokeWidth={1.5} />}
      />
      Data Management
    </MenuItem>
    <MenuItem component={"a" as any} href="/logs" onClick={props.onClick}>
      <ListItemIcon children={<LogsIcon size={18} strokeWidth={1.5} />} />
      Logs
    </MenuItem>
    <Divider />
    <MenuItem
      component={"a" as any}
      href="/audio-codecs"
      onClick={props.onClick}
    >
      <ListItemIcon children={<AudioCodecIcon size={18} strokeWidth={1.5} />} />
      Audio Codecs
    </MenuItem>
    <MenuItem
      component={"a" as any}
      href="/video-codecs"
      onClick={props.onClick}
    >
      <ListItemIcon children={<VideoCodecIcon size={18} strokeWidth={1.5} />} />
      Video Codecs
    </MenuItem>
    <MenuItem component={"a" as any} href="/groups" onClick={props.onClick}>
      <ListItemIcon children={<GroupIcon size={18} strokeWidth={1.5} />} />
      Groups
    </MenuItem>
  </>
);

export const MenuItemOther = (props: { onClick: () => void }) => (
  <>
    <MenuItem component={"a" as any} href="/rss" onClick={props.onClick}>
      <ListItemIcon children={<RssIcon size={18} strokeWidth={1.5} />} />
      RSS
    </MenuItem>
    <Divider />
    <MenuItem component={"a" as any} href="/pc-setups" onClick={props.onClick}>
      <ListItemIcon children={<PCSetupsIcon size={18} strokeWidth={1.5} />} />
      PC Setups
    </MenuItem>
    <MenuItem component={"a" as any} href="/pc-owners" onClick={props.onClick}>
      <ListItemIcon children={<PCOwnersIcon size={18} strokeWidth={1.5} />} />
      PC Owners
    </MenuItem>
    <MenuItem
      component={"a" as any}
      href="/pc-components"
      onClick={props.onClick}
    >
      <ListItemIcon
        children={<PCComponentsIcon size={18} strokeWidth={1.5} />}
      />
      PC Components
    </MenuItem>
  </>
);
