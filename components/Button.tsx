import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  children: ReactNode;
};

export default function Button({
  loading = false,
  disabled,
  children,
  className = "",
  ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`relative inline-flex items-center justify-center transition ${className}`}
    >
      <span className={loading ? "opacity-0" : "opacity-100"}>{children}</span>
      {loading ? (
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-[spin_1.1s_linear_infinite]" />
        </span>
      ) : null}
    </button>
  );
}
