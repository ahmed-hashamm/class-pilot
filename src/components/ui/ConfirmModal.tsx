"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, HelpCircle, AlertTriangle } from "lucide-react";
import { Button } from "./button";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "info",
  isLoading = false,
}: ConfirmModalProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: <AlertCircle className="text-red-600" size={24} />,
          bg: "bg-red-50",
          button: "bg-red-600 hover:bg-red-700 text-white",
          border: "border-red-100",
        };
      case "warning":
        return {
          icon: <AlertTriangle className="text-yellow-600" size={24} />,
          bg: "bg-yellow-50",
          button: "bg-yellow hover:bg-yellow/90 text-navy",
          border: "border-yellow-100",
        };
      default:
        return {
          icon: <HelpCircle className="text-navy" size={24} />,
          bg: "bg-navy/5",
          button: "bg-navy hover:bg-navy/90 text-white",
          border: "border-navy/10",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-border overflow-hidden"
          >
            <div className="p-6 pb-2">
              <div className="flex items-start gap-4">
                <div className={`shrink-0 size-12 rounded-xl flex items-center justify-center ${styles.bg} border ${styles.border}`}>
                  {styles.icon}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-[17px] font-black tracking-tight text-navy leading-tight">
                    {title}
                  </h3>
                  <p className="mt-2 text-[13px] font-medium text-muted-foreground leading-relaxed">
                    {message}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 pt-4 flex gap-3">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 py-2.5 text-[13px] font-bold text-muted-foreground hover:bg-secondary rounded-xl transition cursor-pointer bg-transparent border-none outline-none disabled:opacity-50"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 ${styles.button} py-2.5 text-[13px] font-bold rounded-xl shadow-lg transition flex items-center justify-center cursor-pointer border-none outline-none disabled:opacity-50`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
