import { ModuleContainer } from "@components";
import { useEffect } from "preact/hooks";

type Props = {
  matches?: {
    ownerId: string;
    infoId?: string;
  };
};

const PcSetupAdd = (props: Props) => {
  useEffect(() => {
    console.log(props);
  }, []);

  return (
    <ModuleContainer headerText="PC Setup">
      <p>pc add</p>
    </ModuleContainer>
  );
};

export default PcSetupAdd;
