import { Chip, Grid } from "@mui/material";

import { Genres } from "../types";

type Props = {
  id: string;
  genres: Genres;
};

export const GenresCellContent = ({ id, genres }: Props) => {
  return (
    <Grid container spacing={1}>
      {genres.map((genre) => (
        <Chip key={`${id}_${genre.id}`} size="small" label={genre.genre} />
      ))}
    </Grid>
  );
};
