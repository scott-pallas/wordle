'use client';

import { useEffect, useState } from 'react';

interface ToastItem {
  id: number;
  message: string;
  duration: number;
}

interface ToastProps {
  toasts: ToastItem[];
  onDismiss: (id: number) => void;
}

function ToastMessage({ toast, onDismiss }: { toast: ToastItem; onDismiss: (id: number) => void }) {
  const [dismissing, setDismissing] = useState(false);

  useEffect(() => {
    const fadeOutAt = toast.duration - 200;
    const fadeTimer = setTimeout(() => setDismissing(true), fadeOutAt);
    const removeTimer = setTimeout(() => onDismiss(toast.id), toast.duration);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [toast.id, toast.duration, onDismiss]);

  return (
    <div
      className={`bg-zinc-100 text-zinc-900 font-bold text-sm px-4 py-3 rounded-lg shadow-lg ${
        dismissing ? 'animate-fade-out' : 'animate-fade-in'
      }`}
    >
      {toast.message}
    </div>
  );
}

export default function Toast({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastMessage key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
