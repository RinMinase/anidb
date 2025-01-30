export type PCInfoSummary = {
  uuid: string;
  owner: PCOwner;
  label: string;
  isActive: boolean;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export type PCInfoSummaryList = Array<PCInfoSummary>;

export type PCOwner = {
  uuid: string;
  name: string;
  infos: PCInfoSummaryList;
};

export type PCOwnerList = Array<PCOwner>;

export type PCComponentType = {
  id: number;
  type: string;
  name: string;
  isPeripheral: boolean;
};

export type PCComponentTypeList = Array<PCComponentType>;

export type PCComponent = {
  id: number;
  idType: number;
  type: PCComponentType;
  name: string;
  description: string;
  descriptiveName: string;
  count: number;
  isHidden: boolean;
  price: number;
  priceFormatted: string;
  priceEstimate: number;
  priceEstimateFormatted: string;
  purchaseDate: string;
  purchaseDateFormatted: string;
  purchaseLocation: string;
  purchaseNotes: string;
  isOnhand: boolean;
};

export type PCComponentList = Array<PCComponent>;

export type PCInfo = PCInfoSummary & {
  components: PCComponentList;
};

export type PCInfoStats = {
  totalSetupCost: number;
  totalSetupCostFormat: string;
  totalSystemCost: number;
  totalSystemCostFormat: string;
  totalPeripheralCost: number;
  totalPeripheralCostFormat: string;
  highlightCpu: string;
  highlightGpu: string;
  highlightRam: string;
  highlightStorage: string;
};
