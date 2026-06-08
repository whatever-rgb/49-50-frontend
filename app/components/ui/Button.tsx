import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  const baseClass =
    "px-6 py-3 font-bold text-xs transition-colors disabled:opacity-50 border-2";

  const variants = {
    primary: "bg-retro-300 text-retro-900 border-retro-200 hover:bg-retro-200",
    secondary: "bg-retro-800 text-retro-200 border-retro-300 hover:bg-retro-700",
  };

  return (
    <button
      className={`${baseClass} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}