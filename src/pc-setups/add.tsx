import { ModuleContainer } from "@components";

type Props = {
  matches?: {
    ownerId: string;
    infoId?: string;
  };
};

const PcSetupAdd = (props: Props) => {
  return (
    <ModuleContainer headerText="PC Setup">
      <p>pc add</p>
    </ModuleContainer>
  );
};

export default PcSetupAdd;
