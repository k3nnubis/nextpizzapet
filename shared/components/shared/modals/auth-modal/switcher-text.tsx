interface SwitcherTextProps {
  isLogin: boolean;
  children: React.JSX.Element | React.ReactNode;
  onClick?: () => void;
}

export function SwitcherText({ isLogin, children, onClick }: SwitcherTextProps) {
  return (
    <div className="flex flex-col items-center gap-4">
      {children}
      <p className="text-xs text-gray-400">
        {isLogin ? "Еще не зарегистрированы?" : "Уже зарегистрированы?"}{" "}
        <button className="text-primary hover:opacity-50" onClick={onClick}>
          {isLogin ? "Регистрация" : "Авторизация"}
        </button>
      </p>
    </div>
  );
}
