import { useContext, useEffect, useLayoutEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { Grid2 as Grid } from "@mui/material";
import axios from "axios";

import { GlobalLoaderContext, ModuleContainer } from "@components";

import { Codecs, Data, EntryWatchers, Genres } from "./types";
import SearchForm from "./components/SearchForm";
import SearchTable from "./components/SearchTable";

const Search = () => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [tableLoader, setTableLoader] = useState(false);
  const [data, setData] = useState<Data>([]);
  const [genres, setGenres] = useState<Genres>([]);
  const [watchers, setWatchers] = useState<EntryWatchers>([]);
  const [codecs, setCodecs] = useState<Codecs>({
    audio: [],
    video: [],
  });

  const fetchCodecs = async () => {
    const {
      data: { data },
    } = await axios.get("/codecs");

    setCodecs(data);
  };

  const fetchGenres = async () => {
    const {
      data: { data },
    } = await axios.get("/genres");

    setGenres(data);
  };

  const fetchWatchers = async () => {
    const {
      data: { data },
    } = await axios.get("/entries/watchers");

    setWatchers(data);
  };

  const fetchData = async () => {
    try {
      toggleLoader(true);

      await Promise.all([fetchCodecs(), fetchGenres(), fetchWatchers()]);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useLayoutEffect(() => {
    toggleLoader(true);
  }, []);

  return (
    <ModuleContainer>
      {!isLoading && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4, lg: 3 }}>
            <SearchForm
              codecs={codecs}
              genres={genres}
              watchers={watchers}
              isSearchLoading={tableLoader}
              setTableLoader={setTableLoader}
              setData={setData}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 8, lg: 9 }}>
            <SearchTable data={data} isTableLoading={tableLoader} />
          </Grid>
        </Grid>
      )}
    </ModuleContainer>
  );
};

export default Search;
