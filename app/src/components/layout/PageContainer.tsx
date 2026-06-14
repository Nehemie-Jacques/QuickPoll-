import type { ReactNode } from "react";

type Size = "sm" | "md" | "lg" | "xl";

const sizes: Record<Size, string> = {
  sm: "max-w-lg",
  md: "max-w-2xl",
  lg: "max-w-3xl",
  xl: "max-w-5xl",
};

export function PageContainer({
  children,
  size = "md",
  className = "",
}: {
  children: ReactNode;
  size?: Size;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full min-w-0 ${sizes[size]} px-4 py-6 sm:px-6 sm:py-8 ${className}`}
    >
      {children}
    </div>
  );
}
