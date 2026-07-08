import React from "react";
import { CheckoutWhiteBlock } from "./checkout-white-block";
import { Input, Textarea } from "../../ui";

interface CheckoutAdressFormProps {
  className?: string;
}

export function CheckoutAdressForm({ className }: CheckoutAdressFormProps) {
  return (
    <CheckoutWhiteBlock title="3. Адрес доставки">
      <div className="flex flex-col gap-5">
        <Input name="adress" className="text-base placeholder:text-gray-400" placeholder="Адрес доставки" />
        <Textarea
          name="order-comment"
          className="text-base placeholder:text-gray-400"
          placeholder="Укажите тут дополнительную информацию для курьера"
          rows={5}
        />
      </div>
    </CheckoutWhiteBlock>
  );
}
