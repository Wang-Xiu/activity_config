'use client';

import { forwardRef } from 'react';

interface LoadingSkeletonProps {
    className?: string;
    width?: string | number;
    height?: string | number;
    variant?: 'text' | 'rectangular' | 'circular';
    animation?: 'pulse' | 'wave' | 'none';
    lines?: number; // For text variant
}

const LoadingSkeleton = forwardRef<HTMLDivElement, LoadingSkeletonProps>(
    (
        { className = '', width, height, variant = 'rectangular', animation = 'pulse', lines = 1 },
        ref,
    ) => {
        const baseClasses = 'bg-gray-200';

        const animationClasses = {
            pulse: 'animate-pulse',
            wave: 'animate-pulse', // 可以后续扩展为wave动画
            none: '',
        };

        const variantClasses = {
            text: 'rounded',
            rectangular: 'rounded',
            circular: 'rounded-full',
        };

        const getDefaultDimensions = () => {
            switch (variant) {
                case 'text':
                    return { width: '100%', height: '1rem' };
                case 'circular':
                    return { width: '2.5rem', height: '2.5rem' };
                default:
                    return { width: '100%', height: '2rem' };
            }
        };

        const defaults = getDefaultDimensions();
        const finalWidth = width || defaults.width;
        const finalHeight = height || defaults.height;

        const style = {
            width: typeof finalWidth === 'number' ? `${finalWidth}px` : finalWidth,
            height: typeof finalHeight === 'number' ? `${finalHeight}px` : finalHeight,
        };

        if (variant === 'text' && lines > 1) {
            return (
                <div ref={ref} className={`space-y-2 ${className}`}>
                    {Array.from({ length: lines }).map((_, index) => (
                        <div
                            key={index}
                            className={`
                            ${baseClasses}
                            ${animationClasses[animation]}
                            ${variantClasses[variant]}
                        `.trim()}
                            style={{
                                ...style,
                                width: index === lines - 1 ? '75%' : style.width, // 最后一行稍短
                            }}
                        />
                    ))}
                </div>
            );
        }

        return (
            <div
                ref={ref}
                className={`
                ${baseClasses}
                ${animationClasses[animation]}
                ${variantClasses[variant]}
                ${className}
            `.trim()}
                style={style}
            />
        );
    },
);

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton;
