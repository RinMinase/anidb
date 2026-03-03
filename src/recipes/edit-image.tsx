import { useContext, useEffect, useState } from "preact/hooks";
import { useLocation, useRoute } from "preact-iso";

import { Dialog, GlobalLoaderContext, ModuleContainer } from "@components";
import axios from "axios";
import { toast } from "sonner";
import { Item } from "./types";

const RecipeEditImage = () => {
  const route = useRoute();
  const location = useLocation();

  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [data, setData] = useState<Item>();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const fetchData = async () => {
    try {
      toggleLoader(true);

      const {
        data: { data },
      } = await axios.get(`/recipes/${route.params.id}`);

      setData(data);
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

  if (!data) return;

  return (
    <ModuleContainer
      handleBack={() => setDialogOpen(true)}
      headerText={`Editing image of ${data.title}`}
    >
      <div>test</div>

      <Dialog
        type="warning"
        title="Are you sure?"
        text="Any changes will not be saved."
        onSubmit={() => location.route(`/recipes/${route.params.id}`)}
        open={isDialogOpen}
        setOpen={setDialogOpen}
      />
    </ModuleContainer>
  );
};

export default RecipeEditImage;
