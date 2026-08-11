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
import { createOrder } from "./actions";
import toast from "react-hot-toast";
import React from "react";
import { Api } from "@/shared/services/api-client";
import { useSession } from "next-auth/react";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const { totalAmount, items, updateItemQuantity, removeCartItem, loading } = useCart();
  const [submitting, setSubmitting] = React.useState(false);
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
  React.useEffect(() => {
    async function fetchUserInfo() {
      const data = await Api.auth.getMe();
      const [firstName, lastName] = data.fullName.split(" ");

      form.setValue("firstName", firstName);
      form.setValue("lastName", lastName);
      form.setValue("email", data.email);
    }

    if (session) {
      fetchUserInfo();
    }
  }, [session]);
  const onSubmit = async (data: CheckoutFormValues) => {
    try {
      setSubmitting(true);
      const url = await createOrder(data);
      toast.success("Заказ успешно создан! 🖇️ Переход на оплату...", {
        icon: "✅",
      });
      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.log(error);
      setSubmitting(false);
      toast.error("Не удалось создать заказ.", {
        icon: "❌",
      });
    }
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
              <CheckoutSidebar totalAmount={totalAmount} loading={loading || submitting} />
            </div>
          </div>
        </form>
      </FormProvider>
    </Container>
  );
}
