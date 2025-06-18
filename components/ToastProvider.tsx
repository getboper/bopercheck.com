import React, { createContext, useContext } from 'react';
import { useToast, Toast } from '../hooks/use-toast';

interface ToastContextType {
  toast: (props: Omit<Toast, 'id'>) => string;
  dismiss: (id: string) => void;
  toasts: Toast[];
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const toastHook = useToast();

  return (
    <ToastContext.Provider value={toastHook}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 space-y-2">
        {toastHook.toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-lg shadow-lg border ${
              toast.variant === 'destructive'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-green-50 border-green-200 text-green-800'
            }`}
          >
            <div className="font-semibold">{toast.title}</div>
            {toast.description && (
              <div className="text-sm opacity-80">{toast.description}</div>
            )}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider');
  }
  return context;
}