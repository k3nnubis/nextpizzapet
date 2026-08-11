"use client";
import { CheckoutWhiteBlock } from "./checkout-white-block";
import { FormTextarea } from "../form-components";
import { AddressInput } from "../form-components/address-input";
import { cn } from "@/shared/lib/utils";

interface CheckoutAdressFormProps {
  disabled?: boolean;
  className?: string;
}

export function CheckoutAdressForm({ disabled, className }: CheckoutAdressFormProps) {
  return (
    <CheckoutWhiteBlock
      title="3. Адрес доставки"
      className={cn("relative overflow-hidden", className, { "pointer-events-none": disabled })}
    >
      <div
        className={cn("bg-accent absolute inset-0 z-10 animate-pulse", {
          hidden: !disabled,
        })}
      />
      <div className="flex flex-col gap-5">
        <AddressInput name="address" />
        <FormTextarea
          name="order_comment"
          className="text-base placeholder:text-gray-400"
          placeholder="Укажите тут дополнительную информацию для курьера"
          rows={5}
        />
      </div>
    </CheckoutWhiteBlock>
  );
}
