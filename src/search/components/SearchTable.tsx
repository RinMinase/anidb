import { Dispatch, StateUpdater, useEffect, useState } from "preact/hooks";
import { LinearProgress, Paper } from "@mui/material";
import { CellComponentProps, Grid as VirtualizedGrid } from "react-window";

import { Quality, RewatchIndicator } from "@components";

import { Data, defaultColumnSetup } from "../types";
import { BaseTableCell } from "./BaseTableCell";
import { calcEncoderWidth, calcGenreWidth, calcTitleWidth } from "../helpers";
import { RatingCellContent } from "./RatingCellContent";
import { GenresCellContent } from "./GenresCellContent";

type Props = {
  data: Data;
  setData: Dispatch<StateUpdater<Data>>;
  setTableLoader: Dispatch<StateUpdater<boolean>>;
  isTableLoading: boolean;
};

type CustomCellProps = CellComponentProps<{ data: Data }>;

const SearchTable = (props: Props) => {
  const [columnSetup, setColumnSetup] = useState(defaultColumnSetup);

  const calculateColumnWidths = (data: Data) => {
    const titleWidth = calcTitleWidth(data);
    const encoderWidth = calcEncoderWidth(data);
    const genreWidth = calcGenreWidth(data);

    // Setup column headers
    const newColumnSetup = defaultColumnSetup.map((col) => {
      if (col.key === "title") {
        return { ...col, width: titleWidth };
      } else if (col.key === "encoder") {
        return { ...col, width: encoderWidth };
      } else if (col.key === "genres") {
        return { ...col, width: genreWidth };
      }

      return col;
    });

    setColumnSetup(newColumnSetup);
    props.setTableLoader(false);
  };

  const CellComponent = (props: CustomCellProps) => {
    const { data, columnIndex, rowIndex, style } = props;

    const item = data[rowIndex];
    const isHeader = rowIndex === 0;
    const columnKey = defaultColumnSetup[columnIndex].key;
    const content = item[columnKey];

    // Headers
    if (isHeader) {
      switch (columnKey) {
        case "episodes":
        case "release":
          return (
            <BaseTableCell style={style} header align="center">
              {content as string}
            </BaseTableCell>
          );
        case "genres":
          return (
            <BaseTableCell style={style} header align="center">
              {content as string}
            </BaseTableCell>
          );
        case "encoder":
          return (
            <BaseTableCell style={style} header align="center">
              {content as string}
            </BaseTableCell>
          );
        case "rating":
          return (
            <BaseTableCell style={style} header align="right">
              {content as string}
            </BaseTableCell>
          );
        default:
          return (
            <BaseTableCell style={style} header>
              {content as string}
            </BaseTableCell>
          );
      }
    }

    // Data
    switch (columnKey) {
      case "title":
        return (
          <BaseTableCell style={style}>
            <Quality quality={item.quality} />
            <span>{item.title}</span>
          </BaseTableCell>
        );
      case "episodes":
        return (
          <BaseTableCell style={style} align="center">
            {`${item.episodes} / ${item.ovas} / ${item.specials}`}
          </BaseTableCell>
        );
      case "dateFinished":
        return (
          <BaseTableCell style={style}>
            {item.dateFinished || ""}
            <RewatchIndicator show={item.rewatched} times={item.rewatchCount} />
          </BaseTableCell>
        );
      case "release":
        return (
          <BaseTableCell style={style} align="center">
            {content as string}
          </BaseTableCell>
        );
      case "genres":
        return (
          <BaseTableCell style={style} align="center">
            <GenresCellContent id={item.id || ""} genres={item.genres} />
          </BaseTableCell>
        );
      case "encoder":
        return (
          <BaseTableCell style={style} align="center">
            {content as string}
          </BaseTableCell>
        );
      case "rating":
        return (
          <BaseTableCell style={style} align="center">
            <RatingCellContent rating={item.rating} />
          </BaseTableCell>
        );
      default:
        return <BaseTableCell style={style}>{content as string}</BaseTableCell>;
    }
  };

  useEffect(() => {
    if (props.data.length) {
      calculateColumnWidths(props.data);
    }
  }, [props.data]);

  return (
    <>
      <div
        id="text_calculation"
        style={{
          position: "absolute",
          visibility: "hidden",
          height: "auto",
          width: "auto",
          whiteSpace: "nowrap",
          fontSize: "16px",
        }}
      />

      <Paper
        sx={{
          // 48px - header
          // 48px - container padding
          height: "calc(100vh - 48px - 48px)",
          width: "100%",
        }}
      >
        {props.isTableLoading ? (
          <LinearProgress />
        ) : (
          <VirtualizedGrid
            cellComponent={CellComponent}
            cellProps={{ data: props.data }}
            columnCount={columnSetup.length}
            columnWidth={(id) => columnSetup[id].width}
            rowCount={props.data.length}
            rowHeight={35}
          />
        )}
      </Paper>
    </>
  );
};

export default SearchTable;
