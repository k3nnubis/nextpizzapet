interface OrderBlankProps {
  totalAmount: number;
  orderId: number;
  paymentUrl: string;
}

export function OrderBlank({ totalAmount, orderId, paymentUrl }: OrderBlankProps) {
  return (
    <div>
      <h1>Заказ #{orderId}</h1>
      <p>
        Оплатите заказ на сумму {totalAmount} ₽. Перейдите <a href={paymentUrl}>по этой ссылке</a> для оплаты
        заказа.
      </p>
    </div>
  );
}
