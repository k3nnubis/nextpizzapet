import {
  CheckoutItem,
  CheckoutItemDetails,
  CheckoutWhiteBlock,
  Container,
  Title,
} from "@/shared/components/shared";
import { Button, Input, Textarea } from "@/shared/components/ui";
import { ArrowRight, Package, Percent, Truck } from "lucide-react";

export default function CheckoutPage() {
  return (
    <Container className="mt-10">
      <Title text="Оформление заказа" className="mb-8 text-[36px] font-extrabold" />

      <div className="flex gap-10">
        {/* Левая часть */}
        <div className="mb-20 flex flex-1 flex-col gap-10">
          <CheckoutWhiteBlock title="1. Корзина">
            <div className="flex flex-col gap-5">
              <CheckoutItem
                name="Чизбургер-пицца"
                details="Средняя 30 см, традиционное тесто"
                imageUrl="/products-unique/diablo.avif"
                price={500}
                quantity={10}
                id={1}
              />
              <CheckoutItem
                name="Чизбургер-пицца"
                details="Средняя 30 см, традиционное тесто"
                imageUrl="/products-unique/diablo.avif"
                price={500}
                quantity={10}
                id={1}
              />
            </div>
          </CheckoutWhiteBlock>
          <CheckoutWhiteBlock title="2. Персональные данные">
            <div className="grid grid-cols-2 gap-5">
              <Input name="firstName" className="text-base placeholder:text-gray-400" placeholder="Имя" />
              <Input name="lastName" className="text-base placeholder:text-gray-400" placeholder="Фамилия" />
              <Input name="email" className="text-base placeholder:text-gray-400" placeholder="E-Mail" />
              <Input name="phone" className="text-base placeholder:text-gray-400" placeholder="Телефон" />
            </div>
          </CheckoutWhiteBlock>
          <CheckoutWhiteBlock title="3. Адрес доставки">
            <div className="flex flex-col gap-5">
              <Input
                name="adress"
                className="text-base placeholder:text-gray-400"
                placeholder="Адрес доставки"
              />
              <Textarea
                name="order-comment"
                className="text-base placeholder:text-gray-400"
                placeholder="Укажите тут дополнительную информацию для курьера"
                rows={5}
              />
            </div>
          </CheckoutWhiteBlock>
        </div>
        {/* Правая часть */}
        <div className="w-[450px]">
          <CheckoutWhiteBlock className="sticky top-4 p-6">
            <div className="flex flex-col gap-1">
              <span className="text-xl">Итого:</span>
              <span className="text-[34px] font-extrabold">3506 ₽</span>
            </div>
            <CheckoutItemDetails
              title={
                <div className="flex items-center">
                  <Package size={18} className="mr-2 text-gray-300" />
                  Стоимость товаров:
                </div>
              }
              value="3000"
            />
            <CheckoutItemDetails
              title={
                <div className="flex items-center">
                  <Percent size={18} className="mr-2 text-gray-300" />
                  Налоги:
                </div>
              }
              value="200"
            />
            <CheckoutItemDetails
              title={
                <div className="flex items-center">
                  <Truck size={18} className="mr-2 text-gray-300" />
                  Доставка:
                </div>
              }
              value="306"
            />
            <Button type="submit" className="mt-6 h-14 w-full rounded-2xl text-base font-bold">
              Перейти к оплате
              <ArrowRight className="ml-2 w-5" />
            </Button>
          </CheckoutWhiteBlock>
        </div>
      </div>
    </Container>
  );
}
