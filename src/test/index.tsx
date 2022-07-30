import { useState } from "preact/hooks";

import { Button, Stack, Typography } from "@mui/material";

const Test = () => {
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

export default Test;
