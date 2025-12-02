"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

type Size = "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl"

const sizeClass: Record<Size, string> = {
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
}

export default function AuthCard({
  title,
  children,
  size = "md",
  className = "",
}: {
  title: string
  children: React.ReactNode
  size?: Size
  className?: string
}) {
  return (
    <Card className={cn("mx-auto w-full", sizeClass[size], className)}>
      <CardHeader>
        <CardTitle className="text-center text-2xl md:text-3xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}
