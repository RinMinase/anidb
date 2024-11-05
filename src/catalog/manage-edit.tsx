import CatalogAdd from "./add";

type Props = {
  matches?: {
    id: string;
  };
};

const ManageCatalogEdit = (props: Props) => {
  return <CatalogAdd fromManage {...props} />;
};

export default ManageCatalogEdit;
