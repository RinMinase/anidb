import { Box, Button, Typography } from "@mui/material";

const Lazy = () => {
  return (
    <Box>
      <Typography>Lazy Loaded Page</Typography>
      <Button variant="contained" href="/">
        Normal Component
      </Button>
    </Box>
  );
};

export default Lazy;
