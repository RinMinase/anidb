import { styled } from "@mui/material";

export type Qualities =
  | "4K 2160p"
  | "FHD 1080p"
  | "HD 720p"
  | "HQ 480p"
  | "LQ 360p";

type Props = {
  quality?: Qualities;
};

const Container = styled("div")<Props>(({ quality }) => {
  let bgcolor = "#666";
  let color = "#fff";

  if (quality === "4K 2160p") {
    bgcolor = "#f9c";
    color = "#444";
  }
  if (quality === "FHD 1080p") {
    bgcolor = "#9f9";
    color = "#444";
  }
  if (quality === "HD 720p") {
    bgcolor = "#9cf";
    color = "#444";
  }
  if (quality === "HQ 480p") {
    bgcolor = "#fc6";
    color = "#444";
  }

  return {
    minWidth: 30,
    width: 30,
    display: "inline-block",
    marginRight: 12,
    backgroundColor: bgcolor,
    fontSize: 10,
    borderRadius: 4,
    paddingTop: 1,
    paddingBottom: 1,
    textAlign: "center",
    color,
  };
});

const Quality = (props: Props) => {
  return (
    <Container quality={props.quality}>
      {props.quality ? props.quality.split(" ")[0] : ""}
    </Container>
  );
};

export default Quality;
