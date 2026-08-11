export interface DashboardProductVariant {
  id: number;
  price: number;
  size: number | null;
  pizzaType: number | null;
}

export interface DashboardProductIngredient {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
}
