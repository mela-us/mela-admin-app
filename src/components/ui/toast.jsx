'use client';

import React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva } from 'class-variance-authority';
import { AlertTriangle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn('fixed bottom-4 right-4 z-[100] flex flex-col gap-2 w-[360px] max-w-[100vw] p-4', className)}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  'group pointer-events-auto relative flex w-full items-center gap-4 rounded-lg border p-4 shadow-sm bg-white dark:bg-zinc-800 transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=cancel]:translate-x-0 data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-5',
  {
    variants: {
      variant: {
        success: 'border-green-200 bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-200',
        error: 'border-red-200 bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-200',
        warning: 'border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-200',
        info: 'border-blue-200 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  },
);

const getIconForVariant = (variant) => {
  switch (variant) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />;
    case 'info':
    default:
      return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
  }
};

const Toast = React.forwardRef(({ className, variant = 'success', children, ...props }, ref) => {
  const iconVariant = variant === null ? undefined : variant;
  return (
    <ToastPrimitives.Root
      ref={ref}
      duration={2300}
      className={cn(toastVariants({ variant: iconVariant }), className)}
      {...props}
    >
      <div className="flex items-center justify-between w-full gap-4">
        <div className="flex items-center gap-3">
          {getIconForVariant(iconVariant)}
          <div className="flex flex-col space-y-1">{children}</div>
        </div>
        <ToastClose />
      </div>
    </ToastPrimitives.Root>
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      'inline-flex h-7 shrink-0 items-center justify-center rounded-md border border-zinc-200 bg-transparent px-2.5 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-700',
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

const ToastClose = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'rounded-md p-1 text-zinc-400 opacity-0 transition-opacity hover:text-zinc-600 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-400 group-hover:opacity-100 dark:hover:text-zinc-200',
      className,
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Title ref={ref} className={cn('text-sm font-medium', className)} {...props} />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

const ToastDescription = React.forwardRef(({ className, ...props }, ref) => (
  <ToastPrimitives.Description ref={ref} className={cn('text-xs opacity-80', className)} {...props} />
));
ToastDescription.displayName = ToastPrimitives.Description.displayName;

export { ToastProvider, ToastViewport, Toast, ToastTitle, ToastDescription, ToastClose, ToastAction };
