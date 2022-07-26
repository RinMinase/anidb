import { useState } from "preact/hooks";

import { Box, Button, Stack, Typography } from "@mui/material";

type Props = {
  path: string;
};

const Home = (props: Props) => {
  const [value, setValue] = useState(0);

  const handleClick = () => {
    setValue((prev) => prev + 1);
  };

  return (
    <Stack spacing={3}>
      <Typography>Value - {value}</Typography>
      <Button variant="contained" onClick={handleClick}>
        Value
      </Button>
      <Button variant="contained" href="/lazy">
        Lazy Component
      </Button>
    </Stack>
  );
};

export default Home;
