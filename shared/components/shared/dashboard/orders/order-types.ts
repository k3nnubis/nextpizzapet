export type DashboardOrderStatus = "PENDING" | "SUCCEEDED" | "CANCELLED";

export type DashboardOrder = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  totalAmount: number;
  status: DashboardOrderStatus;
  itemsCount: number;
  userId: number | null;
  createdAt: string;
};
