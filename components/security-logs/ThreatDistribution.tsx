'use client';

import { SecurityStatistics } from '../../types/security-logs';

interface ThreatDistributionProps {
    statistics: SecurityStatistics | null;
    loading?: boolean;
}

export default function ThreatDistribution({ statistics, loading }: ThreatDistributionProps) {
    if (loading || !statistics) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">威胁分布</h3>
                <div className="flex justify-center items-center h-64 text-gray-500">
                    {loading ? '加载中...' : '暂无数据'}
                </div>
            </div>
        );
    }

    // 威胁类型分布数据
    const threatData = Object.entries(statistics.threat_distribution || {}).map(([type, count]) => ({
        type,
        count: Number(count) || 0,
        percentage: statistics.malicious_requests > 0 ? (Number(count) / Number(statistics.malicious_requests) * 100) : 0
    }));

    // HTTP状态码分布数据
    const statusData = Object.entries(statistics.status_distribution || {}).map(([status, count]) => ({
        status,
        count: Number(count) || 0,
        percentage: statistics.malicious_requests > 0 ? (Number(count) / Number(statistics.malicious_requests) * 100) : 0
    }));

    // HTTP方法分布数据
    const methodData = Object.entries(statistics.method_distribution || {}).map(([method, count]) => ({
        method,
        count: Number(count) || 0,
        percentage: statistics.malicious_requests > 0 ? (Number(count) / Number(statistics.malicious_requests) * 100) : 0
    }));

    // 威胁类型颜色映射
    const getThreatTypeColor = (type: string) => {
        const colors: { [key: string]: string } = {
            'sensitive_file_access': 'bg-red-500',
            'admin_panel_access': 'bg-red-400',
            'injection_attack': 'bg-red-600',
            'brute_force': 'bg-yellow-500',
            'suspicious_crawling': 'bg-blue-500',
            'abnormal_method': 'bg-purple-500',
            'other': 'bg-gray-400'
        };
        return colors[type] || 'bg-gray-400';
    };

    // 威胁类型名称映射
    const getThreatTypeName = (type: string) => {
        const names: { [key: string]: string } = {
            'sensitive_file_access': '敏感文件访问',
            'admin_panel_access': '管理面板访问',
            'injection_attack': '注入攻击',
            'brute_force': '暴力破解',
            'suspicious_crawling': '可疑爬取',
            'abnormal_method': '异常请求方法',
            'other': '其他'
        };
        return names[type] || type;
    };

    // 状态码颜色映射
    const getStatusColor = (status: string) => {
        const statusCode = parseInt(status);
        if (statusCode >= 500) return 'bg-red-500';
        if (statusCode >= 400) return 'bg-yellow-500';
        if (statusCode >= 300) return 'bg-blue-500';
        if (statusCode >= 200) return 'bg-green-500';
        return 'bg-gray-400';
    };

    // 方法颜色映射
    const getMethodColor = (method: string) => {
        const colors: { [key: string]: string } = {
            'GET': 'bg-green-500',
            'POST': 'bg-blue-500',
            'PUT': 'bg-yellow-500',
            'DELETE': 'bg-red-500',
            'PATCH': 'bg-purple-500',
            'HEAD': 'bg-gray-500'
        };
        return colors[method] || 'bg-gray-400';
    };

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">威胁分布</h3>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 威胁类型分布 */}
                <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">威胁类型分布</h4>
                    <div className="space-y-3">
                        {threatData
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 6)
                            .map((item) => (
                            <div key={item.type} className="flex items-center">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            {getThreatTypeName(item.type)}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {item.count} ({item.percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${getThreatTypeColor(item.type)}`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* HTTP状态码分布 */}
                <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">状态码分布</h4>
                    <div className="space-y-3">
                        {statusData
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 6)
                            .map((item) => (
                            <div key={item.status} className="flex items-center">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.status}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {item.count} ({item.percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${getStatusColor(item.status)}`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* HTTP方法分布 */}
                <div>
                    <h4 className="text-md font-medium text-gray-800 mb-4">请求方法分布</h4>
                    <div className="space-y-3">
                        {methodData
                            .sort((a, b) => b.count - a.count)
                            .slice(0, 6)
                            .map((item) => (
                            <div key={item.method} className="flex items-center">
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-sm font-medium text-gray-700">
                                            {item.method}
                                        </span>
                                        <span className="text-sm text-gray-600">
                                            {item.count} ({item.percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full ${getMethodColor(item.method)}`}
                                            style={{ width: `${item.percentage}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}
