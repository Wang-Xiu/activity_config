'use client';

import { ReactNode } from 'react';

interface MetricCardProps {
    title: string;
    value: string | number;
    unit?: string;
    icon?: ReactNode;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
    size?: 'sm' | 'md' | 'lg';
}

const colorClasses = {
    blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-900',
        icon: 'text-blue-600',
        border: 'border-blue-200',
    },
    green: {
        bg: 'bg-green-50',
        text: 'text-green-900',
        icon: 'text-green-600',
        border: 'border-green-200',
    },
    purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-900',
        icon: 'text-purple-600',
        border: 'border-purple-200',
    },
    orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-900',
        icon: 'text-orange-600',
        border: 'border-orange-200',
    },
    red: {
        bg: 'bg-red-50',
        text: 'text-red-900',
        icon: 'text-red-600',
        border: 'border-red-200',
    },
};

const sizeClasses = {
    sm: {
        container: 'p-4',
        title: 'text-sm',
        value: 'text-2xl',
        icon: 'w-8 h-8',
    },
    md: {
        container: 'p-6',
        title: 'text-base',
        value: 'text-3xl',
        icon: 'w-10 h-10',
    },
    lg: {
        container: 'p-8',
        title: 'text-lg',
        value: 'text-4xl',
        icon: 'w-12 h-12',
    },
};

export default function MetricCard({
    title,
    value,
    unit = '',
    icon,
    trend,
    color = 'blue',
    size = 'md',
}: MetricCardProps) {
    const colorClass = colorClasses[color];
    const sizeClass = sizeClasses[size];

    // 格式化数值
    const formatValue = (val: string | number): string => {
        if (typeof val === 'number') {
            // 对大数字进行格式化
            if (val >= 10000) {
                return (val / 10000).toFixed(1) + '万';
            }
            return val.toLocaleString();
        }
        return val;
    };

    return (
        <div
            className={`
            ${colorClass.bg} ${colorClass.border} ${sizeClass.container}
            border rounded-xl shadow-sm hover:shadow-md transition-all duration-300 
            transform hover:scale-[1.02] cursor-default
        `}
        >
            <div className="flex items-start justify-between">
                <div className="flex-1">
                    <p
                        className={`${sizeClass.title} font-medium ${colorClass.text} opacity-80 mb-2`}
                    >
                        {title}
                    </p>
                    <div className="flex items-baseline space-x-2">
                        <p
                            className={`${sizeClass.value} font-bold ${colorClass.text} leading-none`}
                        >
                            {formatValue(value)}
                        </p>
                        {unit && (
                            <span className={`text-sm font-medium ${colorClass.text} opacity-70`}>
                                {unit}
                            </span>
                        )}
                    </div>

                    {/* 趋势指示器 */}
                    {trend && (
                        <div
                            className={`flex items-center mt-3 text-sm ${
                                trend.isPositive ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                            <svg
                                className={`w-4 h-4 mr-1 ${
                                    trend.isPositive ? 'rotate-0' : 'rotate-180'
                                }`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <span className="font-medium">
                                {Math.abs(trend.value)}%{trend.isPositive ? '增长' : '下降'}
                            </span>
                        </div>
                    )}
                </div>

                {/* 图标 */}
                {icon && (
                    <div className={`${sizeClass.icon} ${colorClass.icon} flex-shrink-0 ml-4`}>
                        {icon}
                    </div>
                )}
            </div>
        </div>
    );
}
