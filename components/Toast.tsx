'use client';

import { useState, useEffect, useRef } from 'react';

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
    const [isVisible, setIsVisible] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        // 延迟一点显示动画
        setTimeout(() => setIsVisible(true), 10);

        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onRemove(toast.id), 300); // 等待动画完成后再移除
        }, toast.duration || 3000);

        return () => clearTimeout(timer);
    }, [toast.id, toast.duration, onRemove]);

    // 服务器端渲染时不显示
    if (!isMounted) {
        return null;
    }

    const getToastStyles = () => {
        const baseStyles = `
      inline-flex items-center px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm
      transform transition-all duration-300 ease-in-out max-w-md min-w-80
      border border-opacity-20 font-medium text-sm
      ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}
    `;

        switch (toast.type) {
            case 'success':
                return `${baseStyles} bg-green-50 text-green-800 border-green-200`;
            case 'error':
                return `${baseStyles} bg-red-50 text-red-800 border-red-200`;
            case 'warning':
                return `${baseStyles} bg-amber-50 text-amber-800 border-amber-200`;
            case 'info':
                return `${baseStyles} bg-blue-50 text-blue-800 border-blue-200`;
            default:
                return `${baseStyles} bg-gray-50 text-gray-800 border-gray-200`;
        }
    };

    const getIcon = () => {
        const iconClass = 'w-5 h-5 mr-3 flex-shrink-0';
        switch (toast.type) {
            case 'success':
                return (
                    <svg
                        className={`${iconClass} text-green-500`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                        />
                    </svg>
                );

            case 'error':
                return (
                    <svg
                        className={`${iconClass} text-red-500`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                            clipRule="evenodd"
                        />
                    </svg>
                );

            case 'warning':
                return (
                    <svg
                        className={`${iconClass} text-amber-500`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                        />
                    </svg>
                );

            case 'info':
                return (
                    <svg
                        className={`${iconClass} text-blue-500`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clipRule="evenodd"
                        />
                    </svg>
                );

            default:
                return null;
        }
    };

    return (
        <div className={getToastStyles()}>
            {getIcon()}
            <span className="flex-1 leading-5">{toast.message}</span>
            <button
                onClick={() => onRemove(toast.id)}
                className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none"
            >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
        </div>
    );
}

interface ToastContainerProps {
    toasts: ToastType[];
    onRemove: (id: string) => void;
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // 服务器端渲染时不显示
    if (!isMounted) {
        return null;
    }

    return (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 space-y-3 z-50 pointer-events-none">
            {toasts.map((toast) => (
                <div key={toast.id} className="pointer-events-auto flex justify-center">
                    <Toast toast={toast} onRemove={onRemove} />
                </div>
            ))}
        </div>
    );
}

// Toast管理Hook
export function useToast() {
    const [toasts, setToasts] = useState<ToastType[]>([]);

    // 使用ref确保ID唯一性
    const counterRef = useRef(0);

    const addToast = (message: string, type: ToastType['type'] = 'info', duration?: number) => {
        // 使用时间戳 + 计数器确保唯一性
        const id = `${Date.now()}-${++counterRef.current}`;
        const toast: ToastType = { id, message, type, duration };

        setToasts((prev) => [...prev, toast]);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const showSuccess = (message: string, duration?: number) =>
        addToast(message, 'success', duration);
    const showError = (message: string, duration?: number) => addToast(message, 'error', duration);
    const showWarning = (message: string, duration?: number) =>
        addToast(message, 'warning', duration);
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
