import type { CategoryWithProducts } from "@/@types/prisma";
import { axiosInstance } from "./instance";
import { ApiRoutes } from "./constants";

export const getByProductId = async (
  productId: number,
): Promise<CategoryWithProducts> => {
  const { data } = await axiosInstance.get<CategoryWithProducts>(
    `${ApiRoutes.PRODUCT_CATEGORY}/${productId}`,
  );
  return data;
};
