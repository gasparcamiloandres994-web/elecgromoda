import React from 'react';
import { CheckCircle2, SlidersHorizontal, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  subtitle?: string;
  type?: 'cart' | 'compare' | 'info';
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-slate-900 text-white rounded-xl shadow-xl p-3.5 flex items-start gap-3 border border-slate-700/80 animate-slideUp text-xs"
        >
          <div className="mt-0.5 text-blue-400 shrink-0">
            {toast.type === 'compare' ? (
              <SlidersHorizontal className="w-4 h-4 text-blue-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-white">{toast.title}</p>
            {toast.subtitle && (
              <p className="text-slate-300 text-[11px] truncate mt-0.5">{toast.subtitle}</p>
            )}
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-white p-0.5 cursor-pointer"
            aria-label="Cerrar notificación"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
