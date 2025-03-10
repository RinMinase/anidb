import { useEffect, useState } from "preact/hooks";
import { Chip, Grid2 as Grid, Paper, useTheme } from "@mui/material";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

import { Quality, RewatchIndicator } from "@components";

import { Data, Item } from "../types";

type Props = {
  data: Data;
  isTableLoading: boolean;
};

const TABLE_HEADER_SIZE = 38;
const WIDTH = {
  title: 150,
  encoder: 75,
  genre: 50,
};

const SearchTable = (props: Props) => {
  const theme = useTheme();

  const [titleColumnWidth, setTitleColumnWidth] = useState(WIDTH.title);
  const [encoderColumnWidth, setEncoderColumnWidth] = useState(WIDTH.encoder);
  const [genreColumnWidth, setGenreColumnWidth] = useState(WIDTH.genre);

  const calculateColumnWidths = () => {
    const dataCopy = structuredClone(props.data);
    const el = document.getElementById("text_calculation")!;
    const PADDING = 8 + 8;

    // Title Calculation
    const longestTitle = dataCopy.sort(
      (a: Item, b: Item) => (b.title?.length || 0) - (a.title?.length || 0),
    )[0];

    el.textContent = longestTitle.title || "";
    const QUALITY_COMPONENT = 42;
    const titleWidth = el.clientWidth + 1 + PADDING + QUALITY_COMPONENT;
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

    // Genre Calculation
    const longestGenre = dataCopy.sort(
      (a: Item, b: Item) => (b.genres?.length || 0) - (a.genres?.length || 0),
    )[0];

    const genreContainer = longestGenre.genres.length * 16;
    const genreText = longestGenre.genres.reduce((acc, val) => {
      return `${acc}${val.genre}`;
    }, "");

    el.textContent = genreText;
    const genreWidth = el.clientWidth + 1 + genreContainer;
    setGenreColumnWidth(genreWidth < WIDTH.genre ? WIDTH.genre : genreWidth);

    // Reset text calcuation element
    el.textContent = "";
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
            width: `${titleColumnWidth}px`,
            minWidth: `${titleColumnWidth}px`,
            maxWidth: `${titleColumnWidth}px`,
          }}
        >
          <Quality quality={props.data[index].quality} />
          <span>{props.data[index].title}</span>
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
          {props.data[index].episodes} / {props.data[index].ovas} /{" "}
          {props.data[index].specials}
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
          {props.data[index].filesize}
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
          {props.data[index].dateFinished}
          <RewatchIndicator
            show={props.data[index].rewatched}
            times={props.data[index].rewatchCount}
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
          {props.data[index].release}
        </td>
        <td
          style={{
            padding: "4px",
            whiteSpace: "nowrap",
            textAlign: "center",
            width: `${genreColumnWidth}px`,
            minWidth: `${genreColumnWidth}px`,
            maxWidth: `${genreColumnWidth}px`,
          }}
        >
          <Grid container spacing={1}>
            {props.data[index].genres.map((genre) => (
              <Chip
                key={`${props.data[index].id}_${genre.id}`}
                size="small"
                label={genre.genre}
              />
            ))}
          </Grid>
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
          {props.data[index].encoder}
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
              paddingRight: !props.data[index].rating ? "12px" : undefined,
              fontWeight: props.data[index].rating >= 4 ? "bold" : undefined,
              fontSize: props.data[index].rating >= 4 ? "13px" : "11px",
              color: !props.data[index].rating
                ? "#9e9e9e"
                : props.data[index].rating > 4
                ? "#28a745"
                : props.data[index].rating >= 3
                ? "#1e90ff"
                : "#e57373",
            }}
          >
            {props.data[index].rating ? `${props.data[index].rating} / 5` : "-"}
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
                  width: `${genreColumnWidth}px`,
                  minWidth: `${genreColumnWidth}px`,
                  maxWidth: `${genreColumnWidth}px`,
                  padding: "4px",
                }}
              >
                Genres
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
    if (props.data.length) {
      calculateColumnWidths();
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
        <AutoSizer>
          {({ height, width }) => (
            <List
              innerElementType={Inner}
              itemCount={props.data.length}
              itemSize={35}
              height={height}
              width={width}
            >
              {Row}
            </List>
          )}
        </AutoSizer>
      </Paper>
    </>
  );
};

export default SearchTable;
