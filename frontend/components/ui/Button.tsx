"use client";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost";
  loading?: boolean;
};

export default function Button({ variant="primary", loading, className="", children, ...rest }: Props) {
  const base = "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none";
  const styles = {
    primary: `bg-primary text-white hover:opacity-90 active:opacity-85
              focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bg-primary/30`,
    outline: `border border-primary text-primary
              hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/30`,
    ghost: `text-primary hover:bg-primary/10`
  }[variant];

  return (
    <button className={`${base} ${styles} ${className}`} disabled={loading || rest.disabled} {...rest}>
      {loading ? "…" : children}
    </button>
  );
}
