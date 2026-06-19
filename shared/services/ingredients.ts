import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";
import type { Ingredient } from "@/src/generated/prisma/client";

export const getAll = async (): Promise<Ingredient[]> => {
  const { data } = await axiosInstance.get<Ingredient[]>(ApiRoutes.INGREDIENTS);
  return data;
};
