import { CheckoutWhiteBlock } from "./checkout-white-block";
import { FormInput, FormPhoneInput } from "../form-components";
import { cn } from "@/shared/lib/utils";

interface CheckoutPersonalFormProps {
  disabled?: boolean;
  className?: string;
}

export function CheckoutPersonalForm({ disabled, className }: CheckoutPersonalFormProps) {
  return (
    <CheckoutWhiteBlock
      title="2. Персональные данные"
      className={cn("relative overflow-hidden", className, { "pointer-events-none": disabled })}
    >
      <div
        className={cn("bg-accent absolute inset-0 z-10 animate-pulse", {
          hidden: !disabled,
        })}
      />
      <div className="grid grid-cols-2 gap-5">
        <FormInput name="firstName" className="text-base placeholder:text-gray-400" placeholder="Имя" />
        <FormInput name="lastName" className="text-base placeholder:text-gray-400" placeholder="Фамилия" />
        <FormInput name="email" className="text-base placeholder:text-gray-400" placeholder="E-Mail" />
        <FormPhoneInput name="phone" className="text-base placeholder:text-gray-400" placeholder="Телефон" />
      </div>
    </CheckoutWhiteBlock>
  );
}
