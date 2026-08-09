export interface DashboardCategoryProduct {
  id: number;
  name: string;
  imageUrl: string;
}

export interface DashboardCategory {
  id: number;
  name: string;
  updatedAt: string;
  productsCount: number;
  products: DashboardCategoryProduct[];
}
