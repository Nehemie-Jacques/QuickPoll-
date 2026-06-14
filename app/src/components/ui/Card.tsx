import type { CSSProperties, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function Card({ children, className = "", style }: CardProps) {
  return (
    <div className={`qp-card qp-card-hover w-full min-w-0 p-6 ${className}`} style={style}>
      {children}
    </div>
  );
}
