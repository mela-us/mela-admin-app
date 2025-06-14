"use client"

import { useToast } from "@/components/ui/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { cn } from "@/lib/utils"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider swipeDirection="right" duration={2300}>
      {toasts.map(({ id, title, description, action, variant, ...props }) => (
        <Toast
          key={id}
          variant={variant}
          {...props}
          className={cn(
            "flex items-center gap-3 p-4 border rounded-lg shadow-sm bg-white dark:bg-zinc-800 transition-all duration-300",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-80 data-[state=open]:fade-in",
            "data-[state=open]:slide-in-from-right-5",
            "data-[state=closed]:slide-out-to-right-5"
          )}
        >
          <div className="flex-1 grid gap-0.5">
            {title && <ToastTitle className="font-medium text-sm">{title}</ToastTitle>}
            {description && (
              <ToastDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                {description}
              </ToastDescription>
            )}
          </div>
          {action}
        </Toast>
      ))}
      <ToastViewport className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 w-[360px] max-w-[100vw] outline-none" />
    </ToastProvider>
  )
}
