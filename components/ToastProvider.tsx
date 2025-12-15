'use client';

import { useState, useRef, createContext, useContext, useCallback } from 'react';
import { ToastType, ToastContainer } from './Toast';

interface ToastContextType {
    toasts: ToastType[];
    addToast: (message: string, type?: ToastType['type'], duration?: number) => void;
    removeToast: (id: string) => void;
    showSuccess: (message: string, duration?: number) => void;
    showError: (message: string, duration?: number) => void;
    showWarning: (message: string, duration?: number) => void;
    showInfo: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast(): ToastContextType {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

interface ToastProviderProps {
    children: React.ReactNode;
}

export default function ToastProvider({ children }: ToastProviderProps) {
    const [toasts, setToasts] = useState<ToastType[]>([]);
    const counterRef = useRef(0);

    const addToast = useCallback((message: string, type: ToastType['type'] = 'info', duration?: number) => {
        const id = `${Date.now()}-${++counterRef.current}`;
        const toast: ToastType = { id, message, type, duration };
        
        console.log('添加Toast:', toast);
        setToasts((prev) => [...prev, toast]);
    }, []);

    const removeToast = useCallback((id: string) => {
        console.log('移除Toast:', id);
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showSuccess = useCallback((message: string, duration?: number) => {
        console.log('显示成功Toast:', message);
        addToast(message, 'success', duration);
    }, [addToast]);
    
    const showError = useCallback((message: string, duration?: number) => {
        console.log('显示错误Toast:', message);
        addToast(message, 'error', duration);
    }, [addToast]);
    
    const showWarning = useCallback((message: string, duration?: number) => {
        console.log('显示警告Toast:', message);
        addToast(message, 'warning', duration);
    }, [addToast]);
    
    const showInfo = useCallback((message: string, duration?: number) => {
        console.log('显示信息Toast:', message);
        addToast(message, 'info', duration);
    }, [addToast]);

    const contextValue: ToastContextType = {
        toasts,
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo,
    };

    return (
        <ToastContext.Provider value={contextValue}>
            {children}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </ToastContext.Provider>
    );
}
