import { useContext, useEffect, useLayoutEffect, useState } from "preact/hooks";
import { toast } from "sonner";
import { useFieldArray, useForm } from "react-hook-form";
import { Grid2 as Grid } from "@mui/material";
import { route } from "preact-router";
import axios from "axios";

import { ArrowLeft as BackIcon, Trash2 as RemoveIcon } from "react-feather";

import {
  Button,
  ButtonLoading,
  ControlledAutocomplete,
  ControlledField,
  ControlledSelect,
  Dialog,
  GlobalLoaderContext,
  IconButton,
  ModuleContainer,
  OptionsKeyedProps,
  Table,
} from "@components";

import {
  PCComponent,
  PCComponentList,
  PCComponentTypeList,
  PCInfo,
  PCOwner,
} from "./types";

import {
  addComponentDefaultValues,
  AddComponentForm,
  addComponentResolver,
  pcSetupDefaultValues,
  PCSetupForm,
  PCSetupFormComponent,
  pcSetupResolver,
} from "./validation";

type Props = {
  ownerId: string;
  infoId?: string;
};

type AutocompleteOptions = Array<{
  id: string;
  label: string;
}>;

type InfoAPIComponentBody = Array<{
  id_component: string;
  count: number;
  is_hidden: boolean;
}>;

// For development purposes only
const ENABLE_VISIBILITY_HOOK = false;

const PcSetupAdd = (props: Props) => {
  const { isLoading, toggleLoader } = useContext(GlobalLoaderContext);

  const [pageTitle, setPageTitle] = useState<string>("");
  const [componentsLoading, setComponentsLoading] = useState(false);

  const [components, setComponents] = useState<AutocompleteOptions>([]);
  const [componentTypes, setComponentTypes] = useState<OptionsKeyedProps>([]);

  const [isConfirmExitDialogOpen, setConfirmExitDialogOpen] = useState(false);

  const [isSaveLoading, setSaveLoading] = useState(false);

  const {
    control: addComponentControl,
    reset: addComponentReset,
    getValues: addComponentGetValues,
    watch: addComponentWatch,
    trigger: addComponentTrigger,
    formState: { errors: addComponentErrors, isValid: addComponentFormIsValid },
  } = useForm<AddComponentForm>({
    defaultValues: addComponentDefaultValues,
    resolver: addComponentResolver,
    mode: "onChange",
  });

  const {
    control: pcSetupControl,
    getValues: pcSetupGetValues,
    trigger: pcSetupTrigger,
    setValue: pcSetupSetValue,
    formState: { errors: pcSetupErrors, isValid: pcSetupIsValid },
  } = useForm<PCSetupForm>({
    defaultValues: pcSetupDefaultValues,
    resolver: pcSetupResolver,
    mode: "onChange",
  });

  const pcSetupArray = useFieldArray({
    control: pcSetupControl,
    name: "components",
  });

  const addComponentType = addComponentWatch("id_type");

  const fetchComponentTypes = async () => {
    const {
      data: { data },
    } = (await axios.get(`/pc/types`)) as {
      data: { data: PCComponentTypeList };
    };

    setComponentTypes(
      data.map((item) => ({
        label: item.name,
        key: `cmp-type-${item.type}`,
        value: item.id,
      })),
    );
  };

  const fetchPcSetupData = async () => {
    if (props.infoId) {
      const {
        data: { data },
      } = (await axios.get(`/pc/infos/${props.infoId}`)) as {
        data: { data: PCInfo };
      };

      const components: PCSetupFormComponent[] = data.components.map(
        (item) => ({
          count: item.count,
          hidden: item.isHidden ?? false,
          id_component: `${item.id}`,
          name: item.name,
          type: item.type.name,
          isOnhand: item.isOnhand,
          price: item.price,
          priceEstimate: item.priceEstimate,
          purchaseDate: item.purchaseDate,
          purchaseLocation: item.purchaseLocation,
          purchaseNotes: item.purchaseNotes,
        }),
      );

      setPageTitle(`Edit PC Setup of ${data.owner.name}`);

      pcSetupArray.replace(components);
      pcSetupSetValue("label", data.label);
      pcSetupSetValue("hiddenSetup", data.isHidden);
    } else {
      // Only fetch owner information
      const {
        data: { data },
      } = (await axios.get(`/pc/owners/${props.ownerId}`)) as {
        data: { data: PCOwner };
      };

      setPageTitle(`Add PC Setup to ${data.name}`);
    }
  };

  const fetchData = async () => {
    try {
      toggleLoader(true);

      await Promise.all([fetchComponentTypes(), fetchPcSetupData()]);
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      toggleLoader(false);
    }
  };

  const handleSearchComponent = async () => {
    try {
      setComponentsLoading(true);

      const formValues = addComponentGetValues();
      const id_type = formValues.id_type ?? undefined;

      const params: any = {};
      if (id_type) params.id_type = id_type;

      const {
        data: { data },
      } = (await axios.get("/pc/components", { params })) as {
        data: { data: PCComponentList };
      };

      setComponents(
        data.map((item) => ({
          id: `${item.id}`,
          label: item.descriptiveName,
        })),
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed in fetching components");
    } finally {
      setComponentsLoading(false);
    }
  };

  const handleAddComponent = async () => {
    addComponentTrigger();

    const addComponentForm = addComponentGetValues();

    if (addComponentFormIsValid && addComponentForm.component?.id) {
      const {
        data: { data },
      } = (await axios.get(
        `/pc/components/${addComponentForm.component.id}`,
      )) as {
        data: { data: PCComponent };
      };

      pcSetupArray.append({
        // Required values
        id_component: `${data.id}`,
        count: addComponentForm.count,
        hidden: addComponentForm.hidden.toLowerCase() === "true",

        // Table values
        type: data.type.name,
        name: data.name,
        price: data.price,
        priceEstimate: data.priceEstimate,
        purchaseLocation: data.purchaseLocation,
        purchaseDate: data.purchaseDate,
        purchaseNotes: data.purchaseNotes,
        isOnhand: data.isOnhand,
      });

      addComponentReset();
    }
  };

  const handleClickSave = async () => {
    try {
      pcSetupTrigger();

      if (!pcSetupIsValid) {
        return;
      }

      setSaveLoading(true);

      const formdata = pcSetupGetValues();
      const { components: rawComponents } = formdata;

      let components: InfoAPIComponentBody = [];
      if (rawComponents && rawComponents.length) {
        components = rawComponents.map((item) => ({
          id_component: item.id_component,
          count: item.count ?? 1,
          is_hidden: item.hidden,
        }));
      }

      if (props.infoId) {
        await axios.put(`/pc/infos/${props.infoId}`, {
          id_owner: props.ownerId,
          label: formdata.label,
          is_active: true,
          is_hidden: formdata.hiddenSetup,
          components: JSON.stringify(components),
        });
      } else {
        await axios.post("/pc/infos", {
          id_owner: props.ownerId,
          label: formdata.label,
          is_active: true,
          is_hidden: formdata.hiddenSetup,
          components: JSON.stringify(components),
        });
      }

      route("/pc-setups");
      toast.success("Success");
    } catch (err) {
      console.error(err);
      toast.error("Failed");
    } finally {
      setSaveLoading(false);
    }
  };

  const HeaderControls = () => (
    <>
      <Button
        variant="contained"
        color="error"
        startIcon={<BackIcon size={20} />}
        onClick={() => setConfirmExitDialogOpen(true)}
        sx={{ minWidth: "100px" }}
      >
        Back
      </Button>
    </>
  );

  useEffect(() => {
    handleSearchComponent();
  }, [addComponentType]);

  useEffect(() => {
    fetchData();
  }, []);

  // Confirmation dialog on page reload
  useLayoutEffect(() => {
    window.onbeforeunload = () => true;
    return () => (window.onbeforeunload = null);
  }, []);

  // Calling Search API on page active
  useLayoutEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && ENABLE_VISIBILITY_HOOK) {
        handleSearchComponent();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <ModuleContainer
      headerText={pageTitle}
      loading={isLoading}
      headerControls={<HeaderControls />}
    >
      <Grid container spacing={2} pb={2}>
        <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
          <ControlledField
            name="label"
            label="PC Setup Name / Label"
            size="small"
            control={pcSetupControl}
            error={!!pcSetupErrors.label}
            helperText={pcSetupErrors.label?.message}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <ControlledSelect
            name="hiddenSetup"
            label="Is Setup Hidden"
            size="small"
            options={[
              {
                label: "FALSE",
                value: false,
              },
              {
                label: "TRUE",
                value: true,
              },
            ]}
            control={pcSetupControl}
            error={!!pcSetupErrors.hiddenSetup}
            helperText={pcSetupErrors.hiddenSetup?.message}
            disabled={isLoading}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Button variant="contained" color="secondary" fullWidth>
            Manage Components
          </Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 2 }}>
          <ButtonLoading
            variant="contained"
            color="warning"
            loading={isSaveLoading}
            onClick={handleClickSave}
            fullWidth
          >
            Save
          </ButtonLoading>
        </Grid>
        <Grid size={{ xs: 12, sm: 5, lg: 2 }}>
          <ControlledSelect
            name="id_type"
            label="Type"
            size="small"
            menuMaxHeight={300}
            options={componentTypes}
            control={addComponentControl}
            error={!!addComponentErrors.id_type}
            helperText={addComponentErrors.id_type?.message}
            disabled={isLoading}
            displayActualEmpty
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 7, lg: 5 }}>
          <ControlledAutocomplete
            name="component"
            label="Component Name"
            size="small"
            options={components}
            control={addComponentControl}
            error={!!addComponentErrors.component}
            helperText={addComponentErrors.component?.message}
            disabled={isLoading}
            loadingContents={componentsLoading}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <ControlledField
            name="count"
            label="Count"
            size="small"
            control={addComponentControl}
            error={!!addComponentErrors.count}
            helperText={addComponentErrors.count?.message}
            numeric
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 4, lg: 2 }}>
          <ControlledSelect
            name="hidden"
            label="Is Component Hidden"
            size="small"
            options={["FALSE", "TRUE"]}
            control={addComponentControl}
            error={!!addComponentErrors.hidden}
            helperText={addComponentErrors.hidden?.message}
            disabled={isLoading}
            fullWidth
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4, lg: 1 }}>
          <Button variant="contained" onClick={handleAddComponent} fullWidth>
            Add
          </Button>
        </Grid>
      </Grid>

      <Table.Container>
        <Table.Element>
          <Table.Head>
            <Table.Row>
              <Table.Cell sx={{ minWidth: 50, width: 50 }} />
              <Table.Cell>Type</Table.Cell>
              <Table.Cell>Name</Table.Cell>
              <Table.Cell>Count</Table.Cell>
              <Table.Cell>Price</Table.Cell>
              <Table.Cell>
                Price
                <br />
                Estimate
              </Table.Cell>
              <Table.Cell>
                Purchase
                <br />
                Location
              </Table.Cell>
              <Table.Cell>
                Purchase
                <br />
                Date
              </Table.Cell>
              <Table.Cell>Notes</Table.Cell>
              <Table.Cell sx={{ minWidth: 100, width: 100 }}>
                On Hand
              </Table.Cell>
              <Table.Cell sx={{ minWidth: 100, width: 100 }}>
                Is Hidden
              </Table.Cell>
            </Table.Row>
          </Table.Head>

          <Table.Body>
            {pcSetupArray.fields.map((field, index) => (
              <Table.Row key={field.id}>
                <Table.Cell>
                  <IconButton
                    size="small"
                    color="error"
                    disabled={false}
                    onClick={() => pcSetupArray.remove(index)}
                    children={<RemoveIcon size={20} />}
                  />
                </Table.Cell>
                <Table.Cell>{field.type}</Table.Cell>
                <Table.Cell>{field.name}</Table.Cell>
                <Table.Cell>{field.count}</Table.Cell>
                <Table.Cell>{field.price}</Table.Cell>
                <Table.Cell>{field.priceEstimate}</Table.Cell>
                <Table.Cell>{field.purchaseLocation}</Table.Cell>
                <Table.Cell>{field.purchaseDate}</Table.Cell>
                <Table.Cell>{field.purchaseNotes}</Table.Cell>
                <Table.Cell>{`${field.isOnhand}`.toUpperCase()}</Table.Cell>
                <Table.Cell>{`${field.hidden}`.toUpperCase()}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Element>
      </Table.Container>

      <Dialog
        type="warning"
        title="Are you sure?"
        text="Any changes will not be saved."
        onSubmit={() => route("/pc-setups")}
        open={isConfirmExitDialogOpen}
        setOpen={setConfirmExitDialogOpen}
      />
    </ModuleContainer>
  );
};

export default PcSetupAdd;
