"use client";
import React from "react";

type Size = "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

const sizeClass: Record<Size, string> = {
  md:  "max-w-md",
  lg:  "max-w-lg",
  xl:  "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
};

export default function AuthCard({
  title,
  children,
  size = "md",
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full ${sizeClass[size]} rounded-2xl border border-gray-200 bg-white/90 p-6 md:p-8 shadow-sm overflow-hidden ${className}`}
    >
      <h1 className="mb-6 text-center text-2xl md:text-3xl font-semibold text-gray-900">
        {title}
      </h1>
      {children}
    </div>
  );
}
