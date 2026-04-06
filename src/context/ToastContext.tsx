"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, AlertTriangle, Loader2, X, AlertCircle } from "lucide-react";

type ToastType = "success" | "warning" | "alert" | "loading";

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  // Sekarang showToast mengembalikan string (ID)
  showToast: (message: string, type: ToastType) => string; 
  hideToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType) => {
    const id = Math.random().toString(36).substr(2, 9);
    
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto close jika bukan loading
    if (type !== "loading") {
      setTimeout(() => hideToast(id), 4000);
    }

    return id; // Kembalikan ID supaya bisa di-dismiss manual
  }, [hideToast]);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      
      <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-3 w-full max-w-[350px]">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => hideToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }: { toast: Toast; onClose: () => void }) => {
  const styles = {
    success: "bg-emerald-500 text-white border-emerald-600",
    warning: "bg-orange-500 text-white border-orange-600",
    alert: "bg-red-500 text-white border-red-600",
    loading: "bg-slate-900/95 backdrop-blur text-white border-white/10",
  };

  const icons = {
    success: <CheckCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    alert: <AlertCircle size={20} />,
    loading: <Loader2 size={20} className="animate-spin text-primary" />,
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-2xl shadow-2xl border animate-in fade-in slide-in-from-right-10 duration-300 ${styles[toast.type]}`}>
      <div className="shrink-0">{icons[toast.type]}</div>
      <p className="text-sm font-bold flex-1 tracking-tight">{toast.message}</p>
      <button onClick={onClose} className="hover:opacity-50 transition-opacity p-1">
        <X size={16} />
      </button>
    </div>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};