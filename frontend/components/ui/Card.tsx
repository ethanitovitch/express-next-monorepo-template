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

export default function Card({
  title,
  children,
  size,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  size?: Size;
  className?: string;
}) {
  return (
    <div
      className={`w-full ${size ? sizeClass[size] : ''} rounded-2xl border border-gray-200 bg-white/90 p-6 md:p-8 shadow-sm overflow-hidden ${className}`}
    >
      <h2 className="mb-6 text-xl font-semibold text-gray-900">
        {title}
      </h2>
      {children}
    </div>
  );
}
