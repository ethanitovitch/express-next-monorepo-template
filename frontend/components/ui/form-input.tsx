"use client"

import * as React from "react"
import { useState } from "react"
import { Input } from "./base-input"
import { Label } from "./label"
import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"

interface FormInputProps extends React.ComponentProps<"input"> {
  label?: string
  error?: string
  hint?: string
}

function FormInput({ label, error, hint, className, type, id, ...props }: FormInputProps) {
  const isPassword = type === "password"
  const [show, setShow] = useState(false)
  const generatedId = React.useId()
  const inputId = id || generatedId

  return (
    <div className="grid gap-2">
      {label && <Label htmlFor={inputId}>{label}</Label>}
      <div className="relative">
        <Input
          id={inputId}
          type={isPassword ? (show ? "text" : "password") : type}
          className={cn(
            error && "border-destructive focus-visible:ring-destructive/50",
            isPassword && "pr-10",
            className
          )}
          aria-invalid={!!error}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute inset-y-0 right-2 my-auto inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={0}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
      {!error && hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </div>
  )
}

export { FormInput }

