'use client';

import { useState, useMemo } from 'react';
import { TableRowData } from '../../../types/monitor-dashboard';

interface Column {
    key: string;
    title: string;
    dataIndex: string;
    render?: (value: any, record: TableRowData) => React.ReactNode;
    sortable?: boolean;
    width?: number;
    align?: 'left' | 'center' | 'right';
}

interface DataTableProps {
    columns: Column[];
    data: TableRowData[];
    loading?: boolean;
    pagination?: boolean;
    pageSize?: number;
    striped?: boolean;
    hover?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

type SortOrder = 'asc' | 'desc' | null;

export default function DataTable({
    columns,
    data,
    loading = false,
    pagination = false,
    pageSize = 10,
    striped = true,
    hover = true,
    size = 'md',
}: DataTableProps) {
    const [sortKey, setSortKey] = useState<string>('');
    const [sortOrder, setSortOrder] = useState<SortOrder>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // 尺寸样式
    const sizeClasses = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-sm',
        lg: 'px-6 py-4 text-base',
    };

    // 排序处理
    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : sortOrder === 'desc' ? null : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('asc');
        }
    };

    // 排序后的数据
    const sortedData = useMemo(() => {
        if (!sortKey || !sortOrder) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            if (typeof aVal === 'number' && typeof bVal === 'number') {
                return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
            }

            const aStr = String(aVal).toLowerCase();
            const bStr = String(bVal).toLowerCase();

            if (sortOrder === 'asc') {
                return aStr.localeCompare(bStr);
            } else {
                return bStr.localeCompare(aStr);
            }
        });
    }, [data, sortKey, sortOrder]);

    // 分页数据
    const paginatedData = useMemo(() => {
        if (!pagination) return sortedData;

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        return sortedData.slice(startIndex, endIndex);
    }, [sortedData, currentPage, pageSize, pagination]);

    // 总页数
    const totalPages = Math.ceil(data.length / pageSize);

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="animate-pulse">
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <div className="flex space-x-4">
                            {columns.map((_, index) => (
                                <div key={index} className="h-4 bg-gray-200 rounded flex-1"></div>
                            ))}
                        </div>
                    </div>
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="px-4 py-3 border-b border-gray-200">
                            <div className="flex space-x-4">
                                {columns.map((_, colIndex) => (
                                    <div
                                        key={colIndex}
                                        className="h-4 bg-gray-100 rounded flex-1"
                                    ></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {columns.map((column) => (
                                <th
                                    key={column.key}
                                    className={`
                                        ${sizeClasses[size]} font-medium text-gray-700 uppercase tracking-wider
                                        ${
                                            column.align === 'center'
                                                ? 'text-center'
                                                : column.align === 'right'
                                                  ? 'text-right'
                                                  : 'text-left'
                                        }
                                        ${
                                            column.sortable
                                                ? 'cursor-pointer hover:bg-gray-100 transition-colors'
                                                : ''
                                        }
                                    `}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable && handleSort(column.dataIndex)}
                                >
                                    <div className="flex items-center space-x-1">
                                        <span>{column.title}</span>
                                        {column.sortable && (
                                            <div className="flex flex-col">
                                                <svg
                                                    className={`w-3 h-3 ${
                                                        sortKey === column.dataIndex &&
                                                        sortOrder === 'asc'
                                                            ? 'text-blue-600'
                                                            : 'text-gray-400'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                                <svg
                                                    className={`w-3 h-3 -mt-1 ${
                                                        sortKey === column.dataIndex &&
                                                        sortOrder === 'desc'
                                                            ? 'text-blue-600'
                                                            : 'text-gray-400'
                                                    }`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedData.map((record, index) => (
                            <tr
                                key={record.key || index}
                                className={`
                                    ${striped && index % 2 === 1 ? 'bg-gray-50' : 'bg-white'}
                                    ${hover ? 'hover:bg-blue-50 transition-colors' : ''}
                                `}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={`
                                            ${sizeClasses[size]} text-gray-900
                                            ${
                                                column.align === 'center'
                                                    ? 'text-center'
                                                    : column.align === 'right'
                                                      ? 'text-right'
                                                      : 'text-left'
                                            }
                                        `}
                                    >
                                        {column.render
                                            ? column.render(record[column.dataIndex], record)
                                            : (() => {
                                                const value = record[column.dataIndex];
                                                // 处理 NaN 或无效值，显示为 0
                                                if (typeof value === 'number' && isNaN(value)) {
                                                    return 0;
                                                }
                                                return value;
                                            })()}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 分页控件 */}
            {pagination && totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            上一页
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            下一页
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-700">
                                显示第{' '}
                                <span className="font-medium">
                                    {(currentPage - 1) * pageSize + 1}
                                </span>{' '}
                                到{' '}
                                <span className="font-medium">
                                    {Math.min(currentPage * pageSize, data.length)}
                                </span>{' '}
                                条，共 <span className="font-medium">{data.length}</span> 条记录
                            </p>
                        </div>
                        <div>
                            <nav
                                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                                aria-label="Pagination"
                            >
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Previous</span>
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                {/* 页码按钮 */}
                                {[...Array(totalPages)].map((_, index) => {
                                    const page = index + 1;
                                    if (
                                        page === 1 ||
                                        page === totalPages ||
                                        (page >= currentPage - 1 && page <= currentPage + 1)
                                    ) {
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`
                                                    relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                                    ${
                                                        currentPage === page
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                    }
                                                `}
                                            >
                                                {page}
                                            </button>
                                        );
                                    } else if (
                                        page === currentPage - 2 ||
                                        page === currentPage + 2
                                    ) {
                                        return (
                                            <span
                                                key={page}
                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                            >
                                                ...
                                            </span>
                                        );
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() =>
                                        setCurrentPage(Math.min(totalPages, currentPage + 1))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <span className="sr-only">Next</span>
                                    <svg
                                        className="h-5 w-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
