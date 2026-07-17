interface OrderFailedProps {
  orderId: number;
}

export function OrderFailed({ orderId }: OrderFailedProps) {
  return (
    <div>
      <h1>Заказ #{orderId} не был оплачен!</h1>

      <p>К сожалению, оплата не была произведена. Заказ был отменен</p>
    </div>
  );
}
