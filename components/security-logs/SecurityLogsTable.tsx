'use client';

import { SecurityLogEntry, THREAT_LEVEL_OPTIONS } from '../../types/security-logs';

type SortField = 'log_time' | 'threat_level';
type SortOrder = 'asc' | 'desc';

interface SecurityLogsTableProps {
    logs: SecurityLogEntry[];
    loading: boolean;
    total: number;
    currentPage: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    sortField: SortField;
    sortOrder: SortOrder;
    onSortChange: (field: SortField) => void;
}

export default function SecurityLogsTable({ 
    logs, 
    loading, 
    total, 
    currentPage, 
    pageSize, 
    onPageChange,
    sortField,
    sortOrder,
    onSortChange
}: SecurityLogsTableProps) {

    // 渲染排序图标
    const renderSortIcon = (field: SortField) => {
        if (sortField !== field) {
            return (
                <svg className="w-4 h-4 ml-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                </svg>
            );
        }
        if (sortOrder === 'desc') {
            return (
                <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            );
        }
        return (
            <svg className="w-4 h-4 ml-1 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        );
    };

    const getThreatLevelStyle = (level: string) => {
        const option = THREAT_LEVEL_OPTIONS.find(opt => opt.value === level);
        return option ? option.color : 'text-gray-600 bg-gray-50';
    };

    const getStatusStyle = (status: number) => {
        if (status >= 200 && status < 300) {
            return 'text-green-600 bg-green-50';
        } else if (status >= 400 && status < 500) {
            return 'text-yellow-600 bg-yellow-50';
        } else if (status >= 500) {
            return 'text-red-600 bg-red-50';
        }
        return 'text-gray-600 bg-gray-50';
    };

    const formatTime = (timeString: string) => {
        const date = new Date(timeString);
        return date.toLocaleString('zh-CN', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatPath = (path: string) => {
        if (path.length > 50) {
            return path.substring(0, 47) + '...';
        }
        return path;
    };

    const totalPages = Math.ceil(total / pageSize);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="animate-pulse">
                    <div className="bg-gray-50 px-6 py-3">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    {[...Array(5)].map((_, index) => (
                        <div key={index} className="border-t border-gray-200 px-6 py-4">
                            <div className="flex space-x-4">
                                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                    onClick={() => onSortChange('log_time')}
                                >
                                    <div className="flex items-center">
                                        时间
                                        {renderSortIcon('log_time')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IP地址
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    方法
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    请求路径
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    状态码
                                </th>
                                <th 
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                    onClick={() => onSortChange('threat_level')}
                                >
                                    <div className="flex items-center">
                                        威胁等级
                                        {renderSortIcon('threat_level')}
                                    </div>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    地理位置
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {Array.isArray(logs) ? logs.map((log) => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {formatTime(log.log_time)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                                        {log.ip}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {log.method}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900" title={log.path}>
                                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                            {formatPath(log.path)}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(log.status)}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getThreatLevelStyle(log.threat_level)}`}>
                                            {THREAT_LEVEL_OPTIONS.find(opt => opt.value === log.threat_level)?.label || log.threat_level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {log.country && log.city ? `${log.country}, ${log.city}` : log.country || log.city || '-'}
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                        数据格式错误
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 分页 */}
                {totalPages > 1 && (
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage <= 1}
                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                上一页
                            </button>
                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage >= totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                下一页
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-gray-700">
                                    显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到{' '}
                                    <span className="font-medium">{Math.min(currentPage * pageSize, total)}</span> 条，
                                    共 <span className="font-medium">{total}</span> 条记录
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                    <button
                                        onClick={() => onPageChange(currentPage - 1)}
                                        disabled={currentPage <= 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        上一页
                                    </button>
                                    
                                    {/* 页码按钮 */}
                                    {[...Array(Math.min(5, totalPages))].map((_, index) => {
                                        let pageNum;
                                        if (totalPages <= 5) {
                                            pageNum = index + 1;
                                        } else if (currentPage <= 3) {
                                            pageNum = index + 1;
                                        } else if (currentPage >= totalPages - 2) {
                                            pageNum = totalPages - 4 + index;
                                        } else {
                                            pageNum = currentPage - 2 + index;
                                        }
                                        
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => onPageChange(pageNum)}
                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                                                    currentPage === pageNum
                                                        ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    })}
                                    
                                    <button
                                        onClick={() => onPageChange(currentPage + 1)}
                                        disabled={currentPage >= totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        下一页
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
