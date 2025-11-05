"use client";

// Lightweight wrapper to switch the project toast implementation to Sonner.
// Exports the same `useToast` hook shape (`{ toast }`) used across the codebase
// and a top-level `toast` export for direct usage.

import { toast as sonnerToast } from "sonner";

export function useToast() {
  return { toast: sonnerToast } as const;
}

export { sonnerToast as toast };
