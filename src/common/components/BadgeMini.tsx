// commit to change to lf

import { styled } from "@mui/material";
import contrast from "font-color-contrast";

type Props = {
  label: string;
  color?: string;
};

const Container = styled("div")<Props>(({ color }) => {
  return {
    display: "inline-block",
    marginRight: 12,
    backgroundColor: color,
    fontSize: 10,
    borderRadius: 4,
    padding: "1px 4px",
    marginLeft: 8,
    textAlign: "center",
    color: contrast(color),
  };
});

const BadgeMini = (props: Props) => {
  return <Container color={props.color ?? "#fff"}>{props.label}</Container>;
};

export default BadgeMini;
