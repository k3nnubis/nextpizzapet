"use client";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckoutAdressForm,
  CheckoutCart,
  CheckoutPersonalForm,
  CheckoutSidebar,
  Container,
  Title,
} from "@/shared/components/shared";
import { useCart, useCartItemActions } from "@/shared/hooks";
import { checkoutFormSchema, CheckoutFormValues } from "@/shared/constants";

export default function CheckoutPage() {
  const { totalAmount, items, updateItemQuantity, removeCartItem, loading } = useCart();

  const { loadingItemIds, onClickCountButton, onClickRemove } = useCartItemActions(
    updateItemQuantity,
    removeCartItem,
  );

  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      address: "",
      order_comment: "",
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    console.log(data);
  };

  return (
    <Container className="mt-10">
      <Title text="Оформление заказа" className="mb-8 text-[36px] font-extrabold" />
      <FormProvider {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="flex gap-10">
            {/* Левая часть */}
            <div className="mb-20 flex flex-1 flex-col gap-10">
              <CheckoutCart
                items={items}
                loading={loading}
                loadingItemIds={loadingItemIds}
                onClickCountButton={onClickCountButton}
                onClickRemove={onClickRemove}
              />

              <CheckoutPersonalForm disabled={loading} />

              <CheckoutAdressForm disabled={loading} />
            </div>
            {/* Правая часть */}
            <div className="w-[450px]">
              <CheckoutSidebar totalAmount={totalAmount} loading={loading} />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
