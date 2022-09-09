import { styled } from "@mui/material";

export type Qualities = "4K 2160p" | "FHD 1080p" | "HD 720p" | "HQ 480p" | "LQ 360p";

type Props = {
  quality?: Qualities;
};

const Container = styled("div")<Props>(({ quality }) => {
  let bgcolor = "#777";

  if (quality === "4K 2160p") bgcolor = "#f9c";
  if (quality === "FHD 1080p") bgcolor = "#9f9";
  if (quality === "HD 720p") bgcolor = "#9cf";
  if (quality === "HQ 480p") bgcolor = "#fc6";

  return {
    width: 10,
    height: 10,
    display: "inline-block",
    marginRight: 8,
    backgroundColor: bgcolor,
  };
});

const Quality = (props: Props) => {
  return <Container quality={props.quality} />;
};

export default Quality;
