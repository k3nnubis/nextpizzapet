import { InfoBlock } from "@/shared/components/shared";

export default function NotFoundPage() {
  return (
    <div className="mt-40 flex flex-col items-center justify-center">
      <InfoBlock
        title="Страница не найдена"
        text="Проверьте корректность введённого адреса или повторите попытку позже"
        imageUrl="/assets/images/404-image.png"
      />
    </div>
  );
}
