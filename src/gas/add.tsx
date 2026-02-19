import { useState } from "preact/hooks";
import AddFuelForm from "./components/AddFuelForm";
import { Box } from "@mui/material";

const AddFuel = () => {
  const [loading, setLoading] = useState(false);

  return (
    <Box maxWidth={600} mt={2} mr={-1}>
      <AddFuelForm isLargeForm loading={loading} setLoading={setLoading} />
    </Box>
  );
};

export default AddFuel;
