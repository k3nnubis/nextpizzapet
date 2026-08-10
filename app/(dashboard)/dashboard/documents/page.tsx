import { FileText } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Документы",
};

export default function DashboardDocumentsPage() {
  return (
    <div className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px] space-y-7">
        <header className="relative overflow-hidden rounded-3xl bg-gray-950 px-6 py-7 text-white shadow-lg sm:px-8 sm:py-9">
          <div className="absolute -top-20 -right-16 size-64 rounded-full bg-indigo-500/25 blur-3xl" />
          <div className="absolute -bottom-24 left-1/3 size-52 rounded-full bg-sky-300/10 blur-3xl" />
          <div className="relative max-w-2xl">
            <p className="mb-3 text-xs font-extrabold tracking-[0.2em] text-indigo-400 uppercase">
              Рабочие материалы
            </p>
            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Документы</h1>
          </div>
        </header>

        <section className="flex min-h-80 flex-col items-center justify-center rounded-2xl border border-dashed bg-white px-5 text-center shadow-sm">
          <span className="flex size-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
            <FileText className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-extrabold">Раздел пока пуст</h2>
          <p className="text-muted-foreground mt-1 max-w-md text-sm">
            Здесь появятся документы, когда для раздела будет добавлен функционал.
          </p>
        </section>
      </div>
    </div>
  );
}
