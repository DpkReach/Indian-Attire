
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

// New types for Sales
export type SaleStatus = "Fulfilled" | "Pending" | "Cancelled";

export type SaleItem = {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
};

export type Sale = {
  id: string;
  customerName: string;
  customerEmail: string;
  date: string;
  total: number;
  status: SaleStatus;
  items: SaleItem[];
};
