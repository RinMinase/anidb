import { useContext, useEffect, useState } from "preact/hooks";
import { useLocation, useRoute } from "preact-iso";
import { toast } from "sonner";
import { format } from "date-fns";
import axios from "axios";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import {
  ArrowLeft as BackIcon,
  Edit as EditIcon,
  Image as ImageIcon,
  Trash as DeleteIcon,
} from "react-feather";

import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import {
  Button,
  Dialog,
  GlobalLoaderContext,
  ModuleContainer,
} from "@components";
import { Item } from "./types";

import "./markdown-formatter.css";

const ViewRecipe = () => {
  const route = useRoute();
  const location = useLocation();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const { toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Item>();
  const [ingedientsChecks, setIngredientsChecks] = useState<boolean[]>([]);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const fetchData = async () => {
    toggleLoader(true);

    try {
      const {
        data: { data },
      } = await axios.get(`/recipes/${route.params.id}`);

      setData(() => data);

      if (data.ingredients && data.ingredients.length) {
        setIngredientsChecks(() =>
          new Array(data.ingredients.length).fill(false),
        );
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleToggle = (index: number) => () => {
    const values = [...ingedientsChecks];
    values[index] = !values[index];
    setIngredientsChecks(values);
  };

  const handleDeleteSubmit = async () => {
    try {
      await axios.delete(`/recipes/${route.params.id}`);
      location.route("/recipes");
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (!data) return;

  return (
    <ModuleContainer>
      <Box sx={{ position: "relative" }}>
        {data.imageUrlLg ? (
          <Box
            component="img"
            src={data.imageUrlLg || ""}
            sx={{
              width: "100%",
              height: { xs: 200, sm: 300 },
              objectFit: "cover",
            }}
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: { xs: 200, sm: 300 },
              backgroundColor: "lightgray",
            }}
          />
        )}

        <Button
          variant="contained"
          color="secondary"
          startIcon={<BackIcon size={18} />}
          sx={{ position: "absolute", top: 8, left: 8 }}
          onClick={() => location.route("/recipes")}
        >
          Back
        </Button>

        <Button
          variant="contained"
          color="secondary"
          startIcon={<EditIcon size={18} />}
          sx={{ position: "absolute", top: 8, right: { xs: 8, sm: 128 } }}
          onClick={() => location.route(`/recipes/edit/${route.params.id}`)}
        >
          Edit
        </Button>

        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon size={18} />}
          sx={{ position: "absolute", top: { xs: 56, sm: 8 }, right: 8 }}
          onClick={() => setDeleteDialogOpen(true)}
        >
          Delete
        </Button>

        {isDesktop ? (
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ImageIcon size={18} />}
            sx={{ position: "absolute", top: 56, right: 8 }}
            onClick={() =>
              location.route(`/recipes/edit-image/${route.params.id}`)
            }
          >
            Edit Image
          </Button>
        ) : null}

        <Box
          sx={{
            position: { sm: "absolute" },
            bottom: data.imageUrlLg ? 7 : 0,
            left: 0,
            width: "100%",
            padding: "12px 8px 4px",
            mb: { xs: 2, sm: 0 },
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            color: "white",
          }}
        >
          <Typography variant="h4">{data.title}</Typography>
          <Typography variant="body1" gutterBottom>
            {data.description}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: { xs: "column", sm: "row" },
            }}
          >
            <Typography variant="caption">
              Created: {format(data.createdAt, "MMM d, yyyy HH:mm")}
            </Typography>
            <Typography variant="caption">
              Last Updated: {format(data.updatedAt, "MMM d, yyyy HH:mm")}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box>
        <Typography variant="h6">Ingredients</Typography>

        <List sx={{ width: "100%" }}>
          {data.ingredients.map((item, index) => {
            const labelId = `checkbox-list-label-${index}`;

            return (
              <ListItem key={labelId} disablePadding>
                <ListItemButton
                  onClick={handleToggle(index)}
                  dense
                  disableRipple
                >
                  <ListItemIcon sx={{ minWidth: 32 }}>
                    <Checkbox
                      edge="start"
                      checked={ingedientsChecks[index]}
                      tabIndex={-1}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={item} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
      <Box className="markdown-body">
        {data.instructions ? (
          <Markdown remarkPlugins={[remarkGfm]}>{data.instructions}</Markdown>
        ) : null}
      </Box>

      <Dialog
        title="Are you sure?"
        text="This content would be deleted."
        onSubmit={handleDeleteSubmit}
        open={isDeleteDialogOpen}
        setOpen={setDeleteDialogOpen}
      />
    </ModuleContainer>
  );
};

export default ViewRecipe;
