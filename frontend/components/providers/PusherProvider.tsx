"use client";

import { usePusher } from "@/hooks/usePusher";

export function PusherProvider({ children }: { children: React.ReactNode }) {
  // Initialize pusher connection when authenticated
  usePusher();
  
  return <>{children}</>;
}

