import { useContext, useEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { Paper, useTheme } from "@mui/material";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import axios from "axios";
import AutoSizer from "react-virtualized-auto-sizer";

import {
  GlobalLoaderContext,
  ModuleContainer,
  RewatchIndicator,
} from "@components";

import { Data, Item } from "./types";

const qualityColorsEnum = {
  "4K 2160p": "#f9c",
  "FHD 1080p": "#9f9",
  "HD 720p": "#9cf",
  "HQ 480p": "#fc6",
  "LQ 360p": "#666",
};

const TABLE_HEADER_SIZE = 38;
const WIDTH = {
  title: 120,
  encoder: 75,
};

const Entries = () => {
  const theme = useTheme();
  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);
  const [titleColumnWidth, setTitleColumnWidth] = useState(WIDTH.title);
  const [encoderColumnWidth, setEncoderColumnWidth] = useState(WIDTH.encoder);

  const calculateColumnWidths = (data: Data) => {
    const dataCopy = structuredClone(data);
    const el = document.getElementById("text_calculation")!;
    const PADDING = 8 + 8;

    // Title Calculation
    const longestTitle = dataCopy.sort(
      (a: Item, b: Item) => (b.title?.length || 0) - (a.title?.length || 0),
    )[0];

    el.textContent = longestTitle.title || "";
    const titleWidth = el.clientWidth + 1 + PADDING;
    setTitleColumnWidth(titleWidth < WIDTH.title ? WIDTH.title : titleWidth);

    // Encoder Calculation
    const longestEncoder = dataCopy.sort(
      (a: Item, b: Item) => (b.encoder?.length || 0) - (a.encoder?.length || 0),
    )[0];

    el.textContent = longestEncoder.encoder || "";
    const encoderWidth = el.clientWidth + 1 + PADDING;
    setEncoderColumnWidth(
      encoderWidth < WIDTH.encoder ? WIDTH.encoder : encoderWidth,
    );

    // Reset text calcuation element
    el.textContent = "";
  };

  const fetchData = async () => {
    try {
      toggleLoader(true);

      const {
        data: { data },
      } = (await axios.get("/entries", {
        params: { limit: 9999 },
      })) as {
        data: { data: Data };
      };

      setData(data);
      calculateColumnWidths(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    return (
      <tr
        style={{
          ...style,
          top: `${parseFloat(style.top as any) + TABLE_HEADER_SIZE}px`,
          borderTop: !index ? "2px solid" : "",
          borderBottom: "1px solid",
          borderColor: theme.palette.divider,
          width: "unset",
        }}
      >
        <td
          style={{
            padding: "4px",
            whiteSpace: "nowrap",
            fontSize: "12px",
            color: qualityColorsEnum[data[index].quality ?? "LQ 360p"],
            textAlign: "center",
            width: "75px",
            minWidth: "75px",
            maxWidth: "75px",
          }}
        >
          {data[index].quality}
        </td>
        <td
          style={{
            padding: "4px",
            whiteSpace: "nowrap",
            width: `${titleColumnWidth}px`,
            minWidth: `${titleColumnWidth}px`,
            maxWidth: `${titleColumnWidth}px`,
          }}
        >
          {data[index].title}
        </td>
        <td
          style={{
            padding: "4px",
            whiteSpace: "nowrap",
            textAlign: "center",
            width: "120px",
            minWidth: "120px",
            maxWidth: "120px",
          }}
        >
          {data[index].episodes} / {data[index].ovas} / {data[index].specials}
        </td>
        <td
          style={{
            padding: "4px",
            whiteSpace: "nowrap",
            textAlign: "center",
            width: "100px",
            minWidth: "100px",
            maxWidth: "100px",
          }}
        >
          {data[index].filesize}
        </td>
        <td
          style={{
            padding: "4px",
            whiteSpace: "nowrap",
            width: "190px",
            minWidth: "190px",
            maxWidth: "190px",
          }}
        >
          {data[index].dateFinished}
          <RewatchIndicator
            show={data[index].rewatched}
            times={data[index].rewatchCount}
          />
        </td>
        <td
          style={{
            padding: "4px",
            whiteSpace: "nowrap",
            textAlign: "center",
            width: "110px",
            minWidth: "110px",
            maxWidth: "110px",
          }}
        >
          {data[index].release}
        </td>
        <td
          style={{
            padding: "4px",
            whiteSpace: "nowrap",
            width: `${encoderColumnWidth}px`,
            minWidth: `${encoderColumnWidth}px`,
            maxWidth: `${encoderColumnWidth}px`,
          }}
        >
          {data[index].encoder}
        </td>

        <td
          style={{
            padding: "4px 8px",
            whiteSpace: "nowrap",
            width: "85px",
            minWidth: "85px",
            maxWidth: "85px",
          }}
        >
          <p
            style={{
              margin: 0,
              textAlign: "right",
              width: "100%",
              display: "inline-block",
              paddingRight: !data[index].rating ? "12px" : undefined,
              fontWeight: data[index].rating > 7.5 ? "bold" : undefined,
              fontSize: data[index].rating > 7.5 ? "13px" : "11px",
              color: !data[index].rating
                ? "#9E9E9E"
                : data[index].rating > 7.5
                ? "#28a745"
                : data[index].rating > 6
                ? "#1e90ff"
                : "#e57373",
            }}
          >
            {data[index].rating ? `${data[index].rating} / 10` : "-"}
          </p>
        </td>
      </tr>
    );
  };

  const Inner = ({ children, ...rest }: any) => {
    return (
      <div {...rest}>
        <table style={{ position: "absolute", width: "100%" }}>
          <thead>
            <tr>
              <th
                style={{
                  width: "75px",
                  minWidth: "75px",
                  maxWidth: "75px",
                }}
              >
                Quality
              </th>
              <th
                style={{
                  width: `${titleColumnWidth}px`,
                  minWidth: `${titleColumnWidth}px`,
                  maxWidth: `${titleColumnWidth}px`,
                  textAlign: "left",
                  padding: "4px",
                }}
              >
                Title
              </th>
              <th
                style={{
                  width: "120px",
                  minWidth: "120px",
                  maxWidth: "120px",
                }}
              >
                E / O / S
              </th>
              <th
                style={{
                  width: "100px",
                  minWidth: "100px",
                  maxWidth: "100px",
                }}
              >
                Filesize
              </th>
              <th
                style={{
                  width: "190px",
                  minWidth: "190px",
                  maxWidth: "190px",
                  textAlign: "left",
                  padding: "4px",
                }}
              >
                Date Finished
              </th>
              <th
                style={{
                  width: "110px",
                  minWidth: "110px",
                  maxWidth: "110px",
                }}
              >
                Release Date
              </th>
              <th
                style={{
                  width: `${encoderColumnWidth}px`,
                  minWidth: `${encoderColumnWidth}px`,
                  maxWidth: `${encoderColumnWidth}px`,
                  textAlign: "left",
                  padding: "4px",
                }}
              >
                Encoder
              </th>
              <th
                style={{
                  width: "85px",
                  minWidth: "85px",
                  maxWidth: "85px",
                  textAlign: "right",
                  padding: "4px 8px",
                }}
              >
                Rating
              </th>
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    );
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
        <AutoSizer>
          {({ height, width }) => (
            <List
              innerElementType={Inner}
              itemCount={data.length}
              itemSize={35}
              height={height}
              width={width}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </Paper>
    </ModuleContainer>
  );
};

export default Entries;
