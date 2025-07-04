
export type ProductCategory = string;
export type ProductGender = "Men" | "Women" | "Unisex";
export type ProductOccasion = "Wedding" | "Festival" | "Casual" | "Formal";

export type Product = {
  id: string;
  name: string;
  category: ProductCategory;
  gender: ProductGender;
  size: string;
  color: string;
  fabric: string;
  occasion: ProductOccasion;
  stock: number;
  imageUrl: string;
};
