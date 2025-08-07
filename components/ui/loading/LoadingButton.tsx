'use client';

import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    loadingText?: string;
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const variantClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white border-blue-500',
    secondary: 'bg-gray-500 hover:bg-gray-600 text-white border-gray-500',
    success: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
    danger: 'bg-red-500 hover:bg-red-600 text-white border-red-500',
    warning: 'bg-orange-500 hover:bg-orange-600 text-white border-orange-500',
    info: 'bg-purple-500 hover:bg-purple-600 text-white border-purple-500',
};

const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
};

const spinnerSizes = {
    xs: 'xs' as const,
    sm: 'xs' as const,
    md: 'sm' as const,
    lg: 'md' as const,
};

const LoadingButton = forwardRef<HTMLButtonElement, LoadingButtonProps>(
    (
        {
            loading = false,
            loadingText,
            children,
            variant = 'primary',
            size = 'md',
            fullWidth = false,
            className = '',
            disabled,
            ...props
        },
        ref,
    ) => {
        const isDisabled = loading || disabled;

        const buttonClasses = `
        inline-flex items-center justify-center
        font-medium rounded-md border
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        disabled:opacity-60 disabled:cursor-not-allowed
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'hover:bg-current' : ''}
        ${className}
    `.trim();

        return (
            <button ref={ref} className={buttonClasses} disabled={isDisabled} {...props}>
                {loading && (
                    <LoadingSpinner size={spinnerSizes[size]} color="white" className="mr-2" />
                )}
                <span className={loading ? 'opacity-75' : ''}>
                    {loading && loadingText ? loadingText : children}
                </span>
            </button>
        );
    },
);

LoadingButton.displayName = 'LoadingButton';

export default LoadingButton;
