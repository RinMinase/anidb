export type Data = Array<{
  id: number;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string | null;
}>;

export type Item = {
  id: number;
  title: string;
  description: string;
  ingredients: Array<string>;
  instructions: string;
  createdAt: string;
  updatedAt: string;
  imageUrl: string | null;
  imageUrlLg: string | null;
};
