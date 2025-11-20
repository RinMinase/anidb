import { useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { LinearProgress, Paper } from "@mui/material";
import { CellComponentProps, Grid as VirtualizedGrid } from "react-window";
import axios from "axios";

import { ModuleContainer, Quality, RewatchIndicator } from "@components";

import { Data, defaultColumnSetup } from "./types";
import { calcEncoderWidth, calcTitleWidth } from "./helpers";
import { BaseTableCell } from "./components/BaseTableCell";
import { RatingCellContent } from "./components/RatingCellContent";

type CustomCellProps = CellComponentProps<{ data: Data }>;

const tableHeaders = Object.fromEntries(
  defaultColumnSetup.map(({ key, name }) => [key, name]),
) as any;

const Entries = () => {
  const [data, setData] = useState<Data>([]);
  const [isTableLoading, setTableLoading] = useState(true);
  const [columnSetup, setColumnSetup] = useState(defaultColumnSetup);

  const calculateColumnWidths = (data: Data) => {
    const titleWidth = calcTitleWidth(data);
    const encoderWidth = calcEncoderWidth(data);

    // Setup column headers
    const newColumnSetup = defaultColumnSetup.map((col) => {
      if (col.key === "title") {
        return { ...col, width: titleWidth };
      } else if (col.key === "encoder") {
        return { ...col, width: encoderWidth };
      }

      return col;
    });

    setColumnSetup(newColumnSetup);
    setTableLoading(false);
  };

  const fetchData = async () => {
    try {
      setTableLoading(true);

      const {
        data: { data },
      } = (await axios.get("/entries", {
        params: { limit: 9999 },
      })) as {
        data: { data: Data };
      };

      setData([tableHeaders, ...data]);
      calculateColumnWidths(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
      setTableLoading(false);
    }
  };

  const CellComponent = (props: CustomCellProps) => {
    const { data, columnIndex, rowIndex, style } = props;

    const item = data[rowIndex];
    const isHeader = rowIndex === 0;
    const columnKey = columnSetup[columnIndex].key;
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
    fetchData();
  }, []);

  return (
    <ModuleContainer headerText="All Entry Data">
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
          // 49px - page heading
          height: "calc(100vh - 48px - 48px - 49px)",
          width: "100%",
        }}
      >
        {isTableLoading ? (
          <LinearProgress />
        ) : (
          <VirtualizedGrid
            cellComponent={CellComponent}
            cellProps={{ data }}
            columnCount={columnSetup.length}
            columnWidth={(id) => columnSetup[id].width}
            rowCount={data.length}
            rowHeight={35}
          />
        )}
      </Paper>
    </ModuleContainer>
  );
};

export default Entries;
