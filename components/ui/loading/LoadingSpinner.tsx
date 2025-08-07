'use client';

import { forwardRef } from 'react';

interface LoadingSpinnerProps {
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
    color?: 'blue' | 'green' | 'red' | 'purple' | 'orange' | 'gray' | 'white';
    className?: string;
    text?: string;
    textClassName?: string;
}

const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
};

const colorClasses = {
    blue: 'border-blue-500',
    green: 'border-green-500',
    red: 'border-red-500',
    purple: 'border-purple-500',
    orange: 'border-orange-500',
    gray: 'border-gray-500',
    white: 'border-white',
};

const LoadingSpinner = forwardRef<HTMLDivElement, LoadingSpinnerProps>(
    ({ size = 'md', color = 'blue', className = '', text, textClassName = '' }, ref) => {
        const spinnerClasses = `
        animate-spin rounded-full border-2 border-t-transparent
        ${sizeClasses[size]}
        ${colorClasses[color]}
        ${className}
    `.trim();

        if (text) {
            return (
                <div ref={ref} className="flex items-center space-x-2">
                    <div className={spinnerClasses}></div>
                    <span className={`text-gray-600 ${textClassName}`}>{text}</span>
                </div>
            );
        }

        return <div ref={ref} className={spinnerClasses}></div>;
    },
);

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
