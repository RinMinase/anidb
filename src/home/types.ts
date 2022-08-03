export type Data = Array<{
  id?: string;
  quality?: string;
  title?: string;
  dateFinished?: string;
  rewatched?: boolean;
  filesize?: string;
  episodes?: number;
  ovas?: number;
  specials?: number;
  encoder?: string;
  release?: string;
  remarks?: string | null;
  rating?: number;
}>;
