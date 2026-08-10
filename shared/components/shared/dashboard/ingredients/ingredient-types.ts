export interface DashboardIngredient {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  productsCount: number;
  cartItemsCount: number;
  updatedAt: string;
}

export interface IngredientProduct {
  id: number;
  name: string;
  imageUrl: string;
  status: "ACTIVE" | "BLOCKED";
  category: { name: string } | null;
}
