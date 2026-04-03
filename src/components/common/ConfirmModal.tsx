'use client'

import React from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { FeatureButton } from './FeatureButton'
import { cn } from '@/lib/utils'

interface ConfirmModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'danger' | 'warning' | 'info'
  isLoading?: boolean
}

/**
 * ConfirmModal is a standardized dialog for destructive or important actions.
 */
export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = 'danger',
  isLoading = false
}: ConfirmModalProps) {
  if (!isOpen) return null

  const variantStyles = {
    danger: {
      icon: <AlertTriangle className="text-red-600" size={24} />,
      bg: "bg-red-50",
      button: "danger" as const
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-600" size={24} />,
      bg: "bg-yellow-50",
      button: "secondary" as const
    },
    info: {
      icon: <AlertTriangle className="text-navy" size={24} />,
      bg: "bg-blue-50",
      button: "primary" as const
    }
  }

  const style = variantStyles[variant]

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className={cn("size-12 rounded-2xl flex items-center justify-center", style.bg)}>
                {style.icon}
              </div>
              <button 
                onClick={onClose}
                className="p-2 text-muted-foreground hover:text-navy hover:bg-secondary rounded-xl transition-all border-none bg-transparent cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="text-[20px] font-black tracking-tight text-navy mb-3 uppercase">
              {title}
            </h3>
            <p className="text-[14px] text-muted-foreground font-medium leading-relaxed">
              {message}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mt-10">
              <FeatureButton
                label={confirmLabel}
                variant={style.button}
                onClick={onConfirm}
                loading={isLoading}
                className="flex-1"
              />
              <FeatureButton
                label={cancelLabel}
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="flex-1"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
