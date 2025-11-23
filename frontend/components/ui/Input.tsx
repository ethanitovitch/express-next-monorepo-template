"use client";
import React, { useState } from "react";

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  hint?: string;
};

export default function Input({ label, error, hint, className = "", type, ...rest }: Props) {
  const isPassword = type === "password";
  const [show, setShow] = useState(false);

  return (
    <label className="block space-y-1">
      {label && <span className="text-sm font-medium text-gray-800">{label}</span>}

      <div className="relative">
        <input
          {...rest}
          type={isPassword ? (show ? "text" : "password") : type}
          className={`w-full rounded-xl border px-3 py-2 text-sm outline-none transition
                      focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)]
                      ${error ? "border-red-500" : "border-gray-300"}
                      text-black placeholder:text-gray-400
                      ${isPassword ? "pr-10" : ""}
                      ${className}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-500 hover:bg-black/5 hover:text-[var(--color-primary)]"
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={0}
          >
            {show ? (
              /* eye-off */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M3 3l18 18" />
                <path d="M10.7 6.1a8.5 8.5 0 0 1 9.2 5.4c-1.1 2.7-3.5 5-6.4 6.1a8.3 8.3 0 0 1-3.1.5" />
                <path d="M6.6 6.6C4.7 7.8 3.2 9.5 2.5 11.5c1.2 3.3 4.3 6.8 9.5 6.8 1.1 0 2.1-.2 3-.5" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            ) : (
              /* eye */
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" strokeWidth="2" className="h-5 w-5">
                <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
          </button>
        )}
      </div>

      {error && <span className="text-xs text-red-600">{error}</span>}
      {!error && hint && <span className="text-xs text-gray-500">{hint}</span>}
    </label>
  );
}
