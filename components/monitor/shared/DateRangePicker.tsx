'use client';

import { useState, useRef, useEffect } from 'react';

interface DateRangePickerProps {
    value: string;
    onChange: (dateRange: string) => void;
    defaultStartDate?: string;
    defaultEndDate?: string;
}

export default function DateRangePicker({
    value,
    onChange,
    defaultStartDate,
    defaultEndDate
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // 解析当前值
    useEffect(() => {
        if (value) {
            const [start, end] = value.split(',');
            setStartDate(start || '');
            setEndDate(end || '');
        } else if (defaultStartDate && defaultEndDate) {
            setStartDate(defaultStartDate);
            setEndDate(defaultEndDate);
        }
    }, [value, defaultStartDate, defaultEndDate]);

    // 点击外部关闭下拉框
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // 应用日期范围
    const handleApply = () => {
        if (startDate && endDate) {
            onChange(`${startDate},${endDate}`);
            setIsOpen(false);
        }
    };

    // 重置到默认范围
    const handleReset = () => {
        if (defaultStartDate && defaultEndDate) {
            setStartDate(defaultStartDate);
            setEndDate(defaultEndDate);
            onChange(`${defaultStartDate},${defaultEndDate}`);
        } else {
            setStartDate('');
            setEndDate('');
            onChange('');
        }
        setIsOpen(false);
    };

    // 快捷选择选项
    const quickOptions = [
        {
            label: '最近7天',
            getValue: () => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 6);
                return [start.toISOString().split('T')[0], end.toISOString().split('T')[0]];
            }
        },
        {
            label: '最近30天',
            getValue: () => {
                const end = new Date();
                const start = new Date();
                start.setDate(end.getDate() - 29);
                return [start.toISOString().split('T')[0], end.toISOString().split('T')[0]];
            }
        },
        {
            label: '本月',
            getValue: () => {
                const now = new Date();
                const start = new Date(now.getFullYear(), now.getMonth(), 1);
                const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                return [start.toISOString().split('T')[0], end.toISOString().split('T')[0]];
            }
        }
    ];

    // 格式化显示文本
    const getDisplayText = () => {
        if (startDate && endDate) {
            return `${startDate} 至 ${endDate}`;
        }
        return '选择日期范围';
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* 触发按钮 */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
                <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="truncate max-w-48">{getDisplayText()}</span>
                <svg className="w-4 h-4 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* 下拉面板 */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                        {/* 快捷选择 */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                快捷选择
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                                {quickOptions.map((option) => (
                                    <button
                                        key={option.label}
                                        onClick={() => {
                                            const [start, end] = option.getValue();
                                            setStartDate(start);
                                            setEndDate(end);
                                        }}
                                        className="px-3 py-2 text-xs font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 自定义日期选择 */}
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    开始日期
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    结束日期
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    min={startDate}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                            </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                            <button
                                onClick={handleReset}
                                className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                            >
                                重置
                            </button>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                >
                                    取消
                                </button>
                                <button
                                    onClick={handleApply}
                                    disabled={!startDate || !endDate}
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    应用
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}