import React from "react";

type UpdateItemQuantity = (id: number, quantity: number) => Promise<void>;
type RemoveCartItem = (id: number) => Promise<void>;

const removeFirstItemId = (itemIds: number[], id: number) => {
  const index = itemIds.indexOf(id);

  if (index === -1) {
    return itemIds;
  }

  return [...itemIds.slice(0, index), ...itemIds.slice(index + 1)];
};

export const useCartItemActions = (
  updateItemQuantity: UpdateItemQuantity,
  removeCartItem: RemoveCartItem,
) => {
  const [loadingItemIds, setLoadingItemIds] = React.useState<number[]>([]);

  const startLoading = (id: number) => {
    setLoadingItemIds((prev) => [...prev, id]);
  };

  const stopLoading = (id: number) => {
    setLoadingItemIds((prev) => removeFirstItemId(prev, id));
  };

  const onClickCountButton = async (id: number, quantity: number, type: "plus" | "minus") => {
    const newQuantity = type === "plus" ? quantity + 1 : quantity - 1;

    startLoading(id);

    try {
      await updateItemQuantity(id, newQuantity);
    } finally {
      stopLoading(id);
    }
  };

  const onClickRemove = async (id: number) => {
    startLoading(id);

    try {
      await removeCartItem(id);
    } finally {
      stopLoading(id);
    }
  };

  return {
    loadingItemIds,
    onClickCountButton,
    onClickRemove,
  };
};
