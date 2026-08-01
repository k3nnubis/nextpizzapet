import { User } from "@prisma/client";
import { axiosInstance } from "../instance";
import { DashboardRoutes } from "./constants";

export const getUsers = async (): Promise<User[]> => {
  const { data } = await axiosInstance.get<User[]>(DashboardRoutes.USERS);
  return data;
};
