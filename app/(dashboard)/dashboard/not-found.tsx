import { Title } from "@/shared/components/shared";

export default function NotFoundPage() {
  return (
    <div className="mx-auto flex w-full flex-col items-center pt-[80px]">
      <div className="w-[445px]">
        <Title size="lg" text="Страница не найдена" className="font-extrabold" />
        <p className="text-lg text-gray-400">
          Попробуйте перезагрузить страницу, или проверьте правильность введенных данных
        </p>
      </div>
    </div>
  );
}
