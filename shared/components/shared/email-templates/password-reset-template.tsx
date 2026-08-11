interface PasswordResetTemplateProps {
  fullName: string;
  resetUrl: string;
}

export function PasswordResetTemplate({ fullName, resetUrl }: PasswordResetTemplateProps) {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", color: "#222" }}>
      <h2>Сброс пароля Good Food</h2>
      <p>Здравствуйте, {fullName}.</p>
      <p>Администратор создал ссылку для безопасной смены пароля. Она действует 60 минут.</p>
      <p><a href={resetUrl}>Задать новый пароль</a></p>
      <p>Если вы не ожидали это письмо, обратитесь к администратору.</p>
    </div>
  );
}
