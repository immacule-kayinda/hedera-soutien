"use client";

import { Toaster as SonnerToaster } from "sonner";

// Simple wrapper that mounts Sonner's Toaster in the UI.
// The rest of the app uses `useToast()` (now backed by Sonner), so this
// component just needs to render Sonner's UI.
export function Toaster() {
  return <SonnerToaster position="top-right" />;
}
