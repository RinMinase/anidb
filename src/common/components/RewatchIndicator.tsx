// commit to change to lf
import { Typography } from "@mui/material";

import { cardinalToOrdinal } from "../functions";

type Props = {
  show?: boolean;
  times?: number;
};

const RewatchIndicator = (props: Props) => {
  return props.show ? (
    <Typography
      component="span"
      sx={{
        marginLeft: "4px",
        color: "gray",
        fontSize: 11,
        whiteSpace: "nowrap",
      }}
    >
      <span>(</span>
      {props.times && props.times > 1 ? (
        <span>{`${cardinalToOrdinal(props.times)} `}</span>
      ) : null}
      <span>Rewatch)</span>
    </Typography>
  ) : null;
};

export default RewatchIndicator;
