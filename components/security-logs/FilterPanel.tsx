'use client';

import { SecurityLogListParams, HTTP_METHOD_OPTIONS, STATUS_CODE_OPTIONS } from '../../types/security-logs';

interface FilterPanelProps {
    filters: SecurityLogListParams;
    onFiltersChange: (filters: SecurityLogListParams) => void;
    onSearch: () => void;
    loading: boolean;
}

export default function FilterPanel({ filters, onFiltersChange, onSearch, loading }: FilterPanelProps) {
    const handleFilterChange = (key: keyof SecurityLogListParams, value: any) => {
        onFiltersChange({
            ...filters,
            [key]: value || undefined,
            page: 1 // 重置到第一页
        });
    };

    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const getYesterdayDate = () => {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return yesterday.toISOString().split('T')[0];
    };

    const getWeekAgoDate = () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return weekAgo.toISOString().split('T')[0];
    };

    const getMonthAgoDate = () => {
        const monthAgo = new Date();
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return monthAgo.toISOString().split('T')[0];
    };

    const setQuickDateRange = (range: 'today' | 'yesterday' | 'week' | 'month') => {
        const today = getTodayDate();
        switch (range) {
            case 'today':
                onFiltersChange({
                    ...filters,
                    start_date: today,
                    end_date: today,
                    page: 1
                });
                break;
            case 'yesterday':
                const yesterday = getYesterdayDate();
                onFiltersChange({
                    ...filters,
                    start_date: yesterday,
                    end_date: yesterday,
                    page: 1
                });
                break;
            case 'week':
                onFiltersChange({
                    ...filters,
                    start_date: getWeekAgoDate(),
                    end_date: today,
                    page: 1
                });
                break;
            case 'month':
                onFiltersChange({
                    ...filters,
                    start_date: getMonthAgoDate(),
                    end_date: today,
                    page: 1
                });
                break;
        }
    };

    const clearFilters = () => {
        onFiltersChange({
            page: 1,
            page_size: filters.page_size
        });
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">筛选条件</h3>
                <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700"
                >
                    清空筛选
                </button>
            </div>

            {/* 快速日期选择 */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    快速选择时间范围
                </label>
                <div className="flex space-x-2">
                    <button
                        onClick={() => setQuickDateRange('today')}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                    >
                        今天
                    </button>
                    <button
                        onClick={() => setQuickDateRange('yesterday')}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                    >
                        昨天
                    </button>
                    <button
                        onClick={() => setQuickDateRange('week')}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                    >
                        最近7天
                    </button>
                    <button
                        onClick={() => setQuickDateRange('month')}
                        className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                    >
                        最近1个月
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* 开始日期 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        开始日期
                    </label>
                    <input
                        type="date"
                        value={filters.start_date || ''}
                        onChange={(e) => handleFilterChange('start_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 结束日期 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        结束日期
                    </label>
                    <input
                        type="date"
                        value={filters.end_date || ''}
                        onChange={(e) => handleFilterChange('end_date', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* IP地址搜索 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        IP地址
                    </label>
                    <input
                        type="text"
                        placeholder="输入IP地址"
                        value={filters.ip || ''}
                        onChange={(e) => handleFilterChange('ip', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* 路径关键词 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        路径关键词
                    </label>
                    <input
                        type="text"
                        placeholder="输入路径关键词"
                        value={filters.path_keyword || ''}
                        onChange={(e) => handleFilterChange('path_keyword', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* 请求方法 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        请求方法
                    </label>
                    <select
                        value={filters.method || ''}
                        onChange={(e) => handleFilterChange('method', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">全部方法</option>
                        {HTTP_METHOD_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* 状态码 */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        状态码
                    </label>
                    <select
                        value={filters.status || ''}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">全部状态码</option>
                        {STATUS_CODE_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>


                {/* 搜索按钮 */}
                <div className="flex items-end">
                    <button
                        onClick={onSearch}
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                搜索中...
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                搜索
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* 当前筛选条件显示 */}
            <div className="flex flex-wrap gap-2">
                {filters.start_date && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        开始: {filters.start_date}
                        <button
                            onClick={() => handleFilterChange('start_date', '')}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                            ×
                        </button>
                    </span>
                )}
                {filters.end_date && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        结束: {filters.end_date}
                        <button
                            onClick={() => handleFilterChange('end_date', '')}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                            ×
                        </button>
                    </span>
                )}
                {filters.ip && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        IP: {filters.ip}
                        <button
                            onClick={() => handleFilterChange('ip', '')}
                            className="ml-1 text-green-600 hover:text-green-800"
                        >
                            ×
                        </button>
                    </span>
                )}
                {filters.method && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        方法: {filters.method}
                        <button
                            onClick={() => handleFilterChange('method', '')}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                            ×
                        </button>
                    </span>
                )}
                {filters.status && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        状态: {filters.status}
                        <button
                            onClick={() => handleFilterChange('status', '')}
                            className="ml-1 text-yellow-600 hover:text-yellow-800"
                        >
                            ×
                        </button>
                    </span>
                )}
                {filters.threat_level && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        威胁: {THREAT_LEVEL_OPTIONS.find(opt => opt.value === filters.threat_level)?.label}
                        <button
                            onClick={() => handleFilterChange('threat_level', '')}
                            className="ml-1 text-red-600 hover:text-red-800"
                        >
                            ×
                        </button>
                    </span>
                )}
                {filters.path_keyword && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        路径: {filters.path_keyword}
                        <button
                            onClick={() => handleFilterChange('path_keyword', '')}
                            className="ml-1 text-gray-600 hover:text-gray-800"
                        >
                            ×
                        </button>
                    </span>
                )}
            </div>
        </div>
    );
}
