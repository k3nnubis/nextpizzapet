import { ResetPasswordForm } from "./reset-password-form";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token } = await searchParams;
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <section className="w-full rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold">Новый пароль</h1>
        <p className="text-muted-foreground mt-2 mb-6 text-sm">Придумайте пароль длиной не менее 8 символов.</p>
        {token ? <ResetPasswordForm token={token} /> : <p className="text-destructive">В ссылке отсутствует токен сброса.</p>}
      </section>
    </main>
  );
}
