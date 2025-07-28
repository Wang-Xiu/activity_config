'use client';

import { useState, useEffect } from 'react';

export interface ToastType {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

interface ToastProps {
  toast: ToastType;
  onRemove: (id: string) => void;
}

function Toast({ toast, onRemove }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, toast.duration || 3000);

    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const getToastStyles = () => {
    const baseStyles = "fixed right-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out max-w-sm z-50";
    
    switch (toast.type) {
      case 'success':
        return `${baseStyles} bg-green-500 text-white`;
      case 'error':
        return `${baseStyles} bg-red-500 text-white`;
      case 'warning':
        return `${baseStyles} bg-yellow-500 text-black`;
      case 'info':
        return `${baseStyles} bg-blue-500 text-white`;
      default:
        return `${baseStyles} bg-gray-500 text-white`;
    }
  };

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-center">
        <span className="text-lg mr-2">{getIcon()}</span>
        <span className="flex-1">{toast.message}</span>
        <button
          onClick={() => onRemove(toast.id)}
          className="ml-2 text-lg hover:opacity-70"
        >
          ×
        </button>
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: ToastType[];
  onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 space-y-2 z-50">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{ top: `${index * 80}px` }}
          className="relative"
        >
          <Toast toast={toast} onRemove={onRemove} />
        </div>
      ))}
    </div>
  );
}

// Toast管理Hook
export function useToast() {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (message: string, type: ToastType['type'] = 'info', duration?: number) => {
    const id = Date.now().toString();
    const toast: ToastType = { id, message, type, duration };
    
    setToasts(prev => [...prev, toast]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message: string, duration?: number) => addToast(message, 'success', duration);
  const showError = (message: string, duration?: number) => addToast(message, 'error', duration);
  const showWarning = (message: string, duration?: number) => addToast(message, 'warning', duration);
  const showInfo = (message: string, duration?: number) => addToast(message, 'info', duration);

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}