import { PaymentData } from "@/@types/yookassa";
import axios from "axios";

interface Props {
  orderId: number;
  amount: number;
  description: string;
}

export async function createPayment(details: Props) {
  if (!process.env.YOOKASSA_API_KEY) {
    throw new Error("Укажите ключ YOOKASSA_API_KEY");
  }
  const { data } = await axios.post<PaymentData>(
    "https://api.yookassa.ru/v3/payments",
    {
      amount: {
        value: details.amount,
        currency: "RUB",
      },
      capture: true,
      description: details.description,
      metadata: {
        order_id: details.orderId,
      },
      confirmation: {
        type: "redirect",
        return_url: process.env.YOOKASSA_CALLBACK_URL,
      },
    },
    {
      auth: {
        username: process.env.YOOKASSA_STORE_ID as string,
        password: process.env.YOOKASSA_API_KEY as string,
      },
      headers: {
        "Idempotence-Key": Math.random().toString(36).substring(7),
      },
    },
  );

  return data;
}
