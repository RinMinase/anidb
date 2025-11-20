import { CSSProperties } from "preact";
import { useTheme } from "@mui/material";

type Props = {
  header?: boolean;
  align?: "center" | "right";
  style: CSSProperties;
  children: any;
};

export const BaseTableCell = (props: Props) => {
  const theme = useTheme();

  const alignment =
    props.align === "center"
      ? "center"
      : props.align === "right"
        ? "flex-end"
        : "";

  return (
    <div
      className="truncate"
      style={{
        ...props.style,
        backgroundColor: props.header ? theme.palette.primary.main : "",
        fontWeight: props.header ? "bold" : "",
        paddingLeft: "8px",
        paddingRight: "8px",
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid",
        borderColor: theme.palette.divider,
        justifyContent: alignment,
      }}
    >
      {props.children}
    </div>
  );
};
