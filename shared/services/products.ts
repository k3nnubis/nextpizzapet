import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";
import { ProductWithRelations } from "@/@types/prisma";

export const search = async (query: string): Promise<ProductWithRelations[]> => {
  const { data } = await axiosInstance.get<ProductWithRelations[]>(ApiRoutes.SEARCH_PRODUCTS, {
    params: { query },
  });
  return data;
};
