'use client';

import { forwardRef, ReactNode } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
    visible: boolean;
    children?: ReactNode;
    text?: string;
    className?: string;
    overlayClassName?: string;
    spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
    blur?: boolean;
}

const LoadingOverlay = forwardRef<HTMLDivElement, LoadingOverlayProps>(({
    visible,
    children,
    text = '加载中...',
    className = '',
    overlayClassName = '',
    spinnerSize = 'lg',
    blur = true
}, ref) => {
    if (!visible) {
        return children ? <>{children}</> : null;
    }

    const overlayClasses = `
        fixed inset-0 z-50 flex items-center justify-center
        bg-black bg-opacity-50
        ${blur ? 'backdrop-blur-sm' : ''}
        ${overlayClassName}
    `.trim();

    const contentClasses = `
        bg-white rounded-lg shadow-xl p-6
        flex flex-col items-center space-y-4
        max-w-sm mx-4
        ${className}
    `.trim();

    return (
        <div ref={ref} className={overlayClasses}>
            <div className={contentClasses}>
                <LoadingSpinner 
                    size={spinnerSize} 
                    color="blue"
                />
                {text && (
                    <p className="text-gray-600 text-center font-medium">
                        {text}
                    </p>
                )}
            </div>
            {children}
        </div>
    );
});

LoadingOverlay.displayName = 'LoadingOverlay';

export default LoadingOverlay;