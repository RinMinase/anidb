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

export type PCComponent = {
  id: number;
  type: string;
  name: string;
  description: string;
  count: number;
  isHidden: boolean;
  price: number;
  priceFormatted: string;
  priceEstimate: number;
  priceEstimateFormatted: string;
  purchaseDate: string;
  purchaseLocation: string;
  purchaseNotes: string;
  isOnhand: boolean;
};

export type PCComponentList = Array<PCComponent>;

export type PCInfo = PCInfoSummary & {
  components: PCComponentList;
};
