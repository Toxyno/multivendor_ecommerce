"use client";

import * as React from "react";

type ToastProps = {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  duration?: number;
  variant?: "default" | "destructive";
};

type State = {
  toasts: ToastProps[];
};

const ToastContext = React.createContext<{
  toasts: ToastProps[];
  toast: (toast: Omit<ToastProps, "id">) => void;
  dismiss: (id: string) => void;
} | null>(null);

export function ToastProviderCustom({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<State>({ toasts: [] });

  const toast = (toast: Omit<ToastProps, "id">) => {
    const id = crypto.randomUUID();
    setState((s) => ({
      toasts: [...s.toasts, { id, duration: 4000, ...toast }],
    }));

    setTimeout(() => {
      setState((s) => ({
        toasts: s.toasts.filter((t) => t.id !== id),
      }));
    }, toast.duration ?? 4000);
  };

  const dismiss = (id: string) => {
    setState((s) => ({
      toasts: s.toasts.filter((t) => t.id !== id),
    }));
  };

  return (
    <ToastContext.Provider value={{ toasts: state.toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProviderCustom");
  return ctx;
}
