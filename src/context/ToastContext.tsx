'use client';

import { createContext, useCallback, useContext, useState, useRef } from 'react';
import Toast from '@/components/Toast/Toast';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ToastItem {
  id: number;
  message: string;
  duration: number;
}

interface ToastContextValue {
  showToast: (message: string, duration?: number) => void;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ToastContext = createContext<ToastContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const idCounter = useRef(0);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, duration = 2000) => {
    const id = ++idCounter.current;
    setToasts((prev) => [...prev, { id, message, duration }]);
  }, []);

  return (
    <ToastContext value={{ showToast }}>
      {children}
      <Toast toasts={toasts} onDismiss={removeToast} />
    </ToastContext>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === null) {
    throw new Error('useToast must be used within a <ToastProvider>');
  }
  return context;
}
