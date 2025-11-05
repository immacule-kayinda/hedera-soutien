"use client";

import * as React from "react";
import { toast as sonnerToast } from "sonner";

type ToastPayload =
  | string
  | {
      title?: React.ReactNode;
      description?: React.ReactNode;
    };

function normalizeAndShow(payload: ToastPayload) {
  if (typeof payload === "string") {
    return sonnerToast(payload);
  }

  const { title, description } = payload;

  // Sonner accepts JSX content. We build a small fragment that mirrors the
  // previous toast UI (title + description).
  const content = (
    React.createElement(React.Fragment, null,
      title ? React.createElement("div", { className: "font-medium" }, title) : null,
      description ? React.createElement("div", { className: "text-sm text-muted-foreground" }, description) : null
    )
  );

  return sonnerToast(content as any);
}

export function useToast() {
  return { toast: normalizeAndShow } as const;
}

export { normalizeAndShow as toast };
