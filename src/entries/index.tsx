import { useContext, useEffect, useState } from "preact/hooks";
import { forwardRef } from "preact/compat";
import { TableComponents, TableVirtuoso } from "react-virtuoso";
import { toast } from "sonner";
import { Paper, Typography } from "@mui/material";
import axios from "axios";

import {
  GlobalLoaderContext,
  ModuleContainer,
  RewatchIndicator,
  Table,
} from "@components";

import { Data, Item, TableHeadings } from "./types";

const qualityColorsEnum = {
  "4K 2160p": "#f9c",
  "FHD 1080p": "#9f9",
  "HD 720p": "#9cf",
  "HQ 480p": "#fc6",
  "LQ 360p": "#666",
};

const headings: TableHeadings = [
  { id: "quality", label: "Quality", width: 120 },
  { id: "title", label: "Title", width: 250 },
  { id: "episodes", label: "E / O / S", width: 110 },
  { id: "filesize", label: "Filesize", width: 115 },
  { id: "date_finished", label: "Date Finished", width: 205 },
  { id: "release", label: "Release", width: 130 },
  { id: "encoder", label: "Encoder", width: 200 },
  { id: "rating", label: "Rating", width: 100, align: "center" },
];

const VirtuosoTableComponents: TableComponents<Data> = {
  Scroller: forwardRef<HTMLDivElement>((props, ref) => (
    <Table.Container component={Paper} {...props} ref={ref} />
  )),
  Table: (props) => (
    // @ts-expect-error Virtuoso-MUI Error
    <Table.Element
      {...props}
      size="small"
      sx={{ borderCollapse: "separate", tableLayout: "fixed" }}
    />
  ),
  TableHead: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <Table.Head {...props} ref={ref} />
  )),
  // @ts-expect-error Virtuoso-MUI Error
  TableRow: forwardRef<HTMLTableRowElement>((props, ref) => (
    <Table.Row {...props} ref={ref} hover />
  )),
  TableBody: forwardRef<HTMLTableSectionElement>((props, ref) => (
    <Table.Body {...props} ref={ref} />
  )),
};

function rowContent(_index: number, item: Item) {
  return (
    <>
      <Table.Cell
        sx={{
          minWidth: "120px",
          maxWidth: "120px",
          fontSize: "12px",
          color: qualityColorsEnum[item.quality ?? "LQ 360p"],
        }}
      >
        {item.quality}
      </Table.Cell>
      <Table.Cell sx={{ minWidth: "250px", maxWidth: "250px" }}>
        {item.title}
      </Table.Cell>
      <Table.Cell sx={{ minWidth: "110px", maxWidth: "110px" }}>
        {item.episodes} / {item.ovas} / {item.specials}
      </Table.Cell>
      <Table.Cell sx={{ minWidth: "115px", maxWidth: "115px" }}>
        {item.filesize}
      </Table.Cell>
      <Table.Cell sx={{ minWidth: "205px", maxWidth: "205px" }}>
        {item.dateFinished}
        <RewatchIndicator show={item.rewatched} times={item.rewatchCount} />
      </Table.Cell>
      <Table.Cell sx={{ minWidth: "130px", maxWidth: "130px" }}>
        {item.release}
      </Table.Cell>
      <Table.Cell sx={{ minWidth: "200px", maxWidth: "200px" }}>
        {item.encoder}
      </Table.Cell>

      <Table.Cell>
        <Typography
          variant="overline"
          textAlign="right"
          width="100%"
          display="inline-block"
          sx={{
            paddingRight: !item.rating ? "12px" : undefined,
            fontWeight: item.rating > 7.5 ? "bold" : undefined,
            fontSize: item.rating > 7.5 ? "13px" : "11px",
            color: !item.rating
              ? "#9E9E9E"
              : item.rating > 7.5
              ? "#28a745"
              : item.rating > 6
              ? "#1e90ff"
              : "#e57373",
          }}
        >
          {item.rating ? `${item.rating} / 10` : "-"}
        </Typography>
      </Table.Cell>
    </>
  );
}

const Entries = () => {
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);

  const fetchData = async () => {
    try {
      toggleLoader(true);

      const {
        data: { data },
      } = await axios.get("/entries", {
        params: { limit: 9999 },
      });

      setData(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const fixedHeaderContent = () => {
    return (
      <>
        <Table.Row>
          {headings.map((heading) => (
            <Table.Cell
              key={heading.id}
              variant="head"
              sx={(theme) => ({
                backgroundColor: "#EEEEEE",
                width: `${heading.width}px`,
                textAlign: heading.align ?? "left",
                ...theme.applyStyles("dark", {
                  backgroundColor: "#424242",
                }),
              })}
            >
              {heading.label}
            </Table.Cell>
          ))}
        </Table.Row>
      </>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="All Entry Data">
      <Paper
        sx={{
          // 48px - header
          // 48px - container padding
          // 49px - page heading
          height: "calc(100vh - 48px - 48px - 49px)",
          width: "100%",
        }}
      >
        <TableVirtuoso
          data={data}
          // @ts-expect-error Virtuoso-MUI Error
          components={VirtuosoTableComponents}
          fixedHeaderContent={fixedHeaderContent}
          itemContent={rowContent}
          increaseViewportBy={1000}
        />
      </Paper>
    </ModuleContainer>
  );
};

export default Entries;
