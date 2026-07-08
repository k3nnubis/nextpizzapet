import { CheckoutWhiteBlock } from "./checkout-white-block";
import { FormInput } from "../form-components";

interface CheckoutPersonalFormProps {
  className?: string;
}

export function CheckoutPersonalForm({ className }: CheckoutPersonalFormProps) {
  return (
    <CheckoutWhiteBlock title="2. Персональные данные" className={className}>
      <div className="grid grid-cols-2 gap-5">
        <FormInput name="firstName" className="text-base placeholder:text-gray-400" placeholder="Имя" />
        <FormInput name="lastName" className="text-base placeholder:text-gray-400" placeholder="Фамилия" />
        <FormInput name="email" className="text-base placeholder:text-gray-400" placeholder="E-Mail" />
        <FormInput name="phone" className="text-base placeholder:text-gray-400" placeholder="Телефон" />
      </div>
    </CheckoutWhiteBlock>
  );
}
