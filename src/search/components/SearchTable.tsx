import { forwardRef } from "preact/compat";
import { TableComponents, TableVirtuoso } from "react-virtuoso";
import { Chip, Grid2 as Grid, Paper, Stack } from "@mui/material";

import { Quality, Rating, RewatchIndicator, Table } from "@components";

import { Data, Item, TableHeadings } from "../types";

type Props = {
  data: Data;
  isTableLoading: boolean;
};

const headings: TableHeadings = [
  { id: "title", label: "Title", width: 250 },
  { id: "episodes", label: "E / O / S", width: 110 },
  { id: "filesize", label: "Filesize", width: 115 },
  { id: "date_finished", label: "Date Finished", width: 205 },
  { id: "release", label: "Release", width: 130 },
  { id: "genres", label: "Genres", width: 225 },
  { id: "encoder", label: "Encoder", width: 200 },
  { id: "rating", label: "Rating", width: 165, align: "center" },
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
      <Table.Cell sx={{ minWidth: "250px", maxWidth: "250px" }}>
        <Quality quality={item.quality} />
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
      <Table.Cell sx={{ minWidth: "225px", maxWidth: "225px" }}>
        <Grid container spacing={1}>
          {item.genres.map((genre) => (
            <Chip
              key={`${item.id}_${genre.id}`}
              size="small"
              label={genre.genre}
            />
          ))}
        </Grid>
      </Table.Cell>
      <Table.Cell sx={{ minWidth: "200px", maxWidth: "200px" }}>
        {item.encoder}
      </Table.Cell>

      <Table.Cell sx={{ minWidth: "165px", maxWidth: "165px" }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Chip
            label={item.rating}
            size="small"
            sx={{ width: "45px", height: "20px" }}
          />
          <Rating value={item.ratingOver5} />
        </Stack>
      </Table.Cell>
    </>
  );
}

const SearchTable = (props: Props) => {
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

        {props.isTableLoading ? <Table.Loader /> : null}
      </>
    );
  };

  return (
    <Paper
      sx={{
        // 48px - header
        // 48px - container padding
        height: "calc(100vh - 48px - 48px)",
        width: "100%",
      }}
    >
      <TableVirtuoso
        data={props.data}
        // @ts-expect-error Virtuoso-MUI Error
        components={VirtuosoTableComponents}
        fixedHeaderContent={fixedHeaderContent}
        itemContent={rowContent}
        increaseViewportBy={750}
      />
    </Paper>
  );
};

export default SearchTable;
