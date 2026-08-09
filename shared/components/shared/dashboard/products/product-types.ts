export interface DashboardProduct {
  id: number;
  name: string;
  imageUrl: string;
  status: "ACTIVE" | "BLOCKED";
  category: {
    id: number;
    name: string;
  } | null;
  prices: number[];
  variantsCount: number;
  ingredientsCount: number;
  updatedAt: string;
}

export interface DashboardProductCategory {
  id: number;
  name: string;
}
