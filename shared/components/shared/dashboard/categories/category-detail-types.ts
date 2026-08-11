export interface DashboardCategoryProductDetails {
  id: number;
  name: string;
  imageUrl: string;
  status: "ACTIVE" | "BLOCKED";
  prices: number[];
  variantsCount: number;
  updatedAt: string;
}
