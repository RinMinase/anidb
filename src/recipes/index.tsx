import { useContext, useEffect, useState } from "preact/hooks";
import { useLocation } from "preact-iso";
import { toast } from "sonner";
import { format } from "date-fns";
import { Box, Typography } from "@mui/material";
import axios from "axios";

import { Button, GlobalLoaderContext, ModuleContainer } from "@components";
import { Data } from "./types";

const Recipes = () => {
  const location = useLocation();

  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Data>([]);

  const fetchData = async () => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = await axios.get("/recipes");

      setData(() => data);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const HeaderControls = () => (
    <>
      <Button
        variant="contained"
        sx={{
          minWidth: { xs: 120, sm: 180 },
        }}
        onClick={() => location.route("/recipes/add")}
      >
        Add New
      </Button>
    </>
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ModuleContainer
      headerText="Recipe List"
      headerControls={<HeaderControls />}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: "12px",
        }}
      >
        {data.map((item) => (
          <Box
            key={item.id}
            sx={{
              width: { xs: "100%", sm: "256px" },
              borderBottomLeftRadius: 12,
              borderBottomRightRadius: 12,
              cursor: "pointer",
              transition: { sm: "transform 0.3s ease-in-out" },
              "&:hover": {
                transform: { sm: "scale(1.05)" },
                boxShadow: { sm: "0 10px 20px rgba(0,0,0,0.2);" },
              },
            }}
            onClick={() => location.route(`/recipes/${item.id}`)}
          >
            {item.imageUrl ? (
              <Box
                component="img"
                src={item.imageUrl}
                sx={{
                  width: "100%",
                  height: 256,
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            ) : (
              <Box
                sx={{
                  width: { xs: "100%", sm: 256 },
                  height: 256,
                  borderRadius: "12px",
                  backgroundColor: "lightgray",
                }}
              />
            )}

            <Box sx={{ py: 1.5, px: 0.5 }}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {item.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  mt: 0.5,
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {item.description}
              </Typography>

              {item.updatedAt ? (
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ mt: 1, display: "block" }}
                >
                  {format(item.updatedAt, "MMM d, yyyy HH:mm")}
                </Typography>
              ) : null}
            </Box>
          </Box>
        ))}

        {new Array(data.length % 4).fill(true).map((item, id) => (
          <Box key={`spacer_${id}`} width={256} />
        ))}
      </Box>
    </ModuleContainer>
  );
};

export default Recipes;
