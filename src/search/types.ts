export type { Data } from "../home/types";

export type Codecs = {
  audio: Array<{
    id: string;
    codec: string;
  }>;
  video: Array<{
    id: string;
    codec: string;
  }>;
};

export type Genres = Array<{
  id: number;
  genre: string;
}>;
