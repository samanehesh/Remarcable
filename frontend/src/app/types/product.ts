import { Category } from "./category";
import { Tag } from "./tag";

export type Product = {
  id: number;
  name: string;
  description: string;
  category: Category;
  tags: Tag[];
};