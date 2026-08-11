import { CartItemDTO } from "@/shared/services/dto/cart.dto";

interface VerificationTemplateProps {
  code: string;
}

export function VerificationTemplate({ code }: VerificationTemplateProps) {
  return (
    <div>
      <p>Код подтверждения: </p>
      <h2>{code}</h2>
      <a href={`http://localhost:3000/api/auth/verify?code=${code}`}>Подтвердить регистрацию</a>
    </div>
  );
}
