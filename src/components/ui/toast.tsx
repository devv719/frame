"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}

// Global dispatcher helper
export function toast(message: string, type: ToastType = "success") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("frame-toast", {
        detail: { message, type },
      })
    );
  }
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    const handleToastEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ message: string; type: ToastType }>;
      const { message, type } = customEvent.detail;
      const id = Math.random().toString(36).substring(2, 9);
      
      setToasts((prev) => [...prev, { id, message, type }]);

      // Auto-remove after 4 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    };

    window.addEventListener("frame-toast", handleToastEvent);
    return () => {
      window.removeEventListener("frame-toast", handleToastEvent);
    };
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-[500] flex flex-col gap-3 max-w-sm w-full px-4 md:px-0 pointer-events-none select-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-[#161410] border border-[#292524] shadow-2xl text-[0.8125rem] text-[#f4f2ed] rounded-none`}
          >
            {t.type === "success" ? (
              <CheckCircle2 size={16} className="text-[#e8d5b0] shrink-0 mt-0.5" />
            ) : t.type === "error" ? (
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle size={16} className="text-[#a8a29e] shrink-0 mt-0.5" />
            )}
            
            <div className="flex-grow font-sans tracking-wide">
              {t.message}
            </div>

            <button
              onClick={() => removeToast(t.id)}
              className="p-0.5 text-[#57534e] hover:text-[#f4f2ed] transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
