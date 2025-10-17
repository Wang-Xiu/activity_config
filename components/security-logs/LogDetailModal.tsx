'use client';

import { SecurityLogEntry, THREAT_LEVEL_OPTIONS, THREAT_TYPE_OPTIONS } from '../../types/security-logs';

interface LogDetailModalProps {
    log: SecurityLogEntry | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function LogDetailModal({ log, isOpen, onClose }: LogDetailModalProps) {
    if (!isOpen || !log) return null;

    const getThreatLevelInfo = (level: string) => {
        return THREAT_LEVEL_OPTIONS.find(opt => opt.value === level) || { label: level, color: 'text-gray-600 bg-gray-50' };
    };

    const getThreatTypeInfo = (type: string) => {
        return THREAT_TYPE_OPTIONS.find(opt => opt.value === type) || { label: type };
    };

    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const getStatusDescription = (status: number) => {
        const statusMap: { [key: number]: string } = {
            200: '成功',
            301: '永久重定向',
            302: '临时重定向',
            400: '请求错误',
            401: '未授权',
            403: '禁止访问',
            404: '未找到',
            405: '方法不允许',
            500: '服务器内部错误',
            502: '网关错误',
            503: '服务不可用'
        };
        return statusMap[status] || '未知状态';
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    {/* 头部 */}
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-gray-900">
                            安全日志详情
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* 基本信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    攻击时间
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {formatDateTime(log.log_time)}
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    IP地址
                                </label>
                                <div className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
                                    {log.ip}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    地理位置
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {log.country && log.city ? `${log.country}, ${log.city}` : log.country || log.city || '未知'}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    请求方法
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {log.method}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    HTTP状态码
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    <span className="font-mono">{log.status}</span>
                                    <span className="ml-2 text-gray-600">({getStatusDescription(log.status)})</span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    威胁等级
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getThreatLevelInfo(log.threat_level).color}`}>
                                        {getThreatLevelInfo(log.threat_level).label}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    威胁类型
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {getThreatTypeInfo(log.threat_type).label}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    记录创建时间
                                </label>
                                <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded">
                                    {formatDateTime(log.created_at)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 请求路径 */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            请求路径
                        </label>
                        <div className="text-sm font-mono text-gray-900 bg-gray-50 p-3 rounded border break-all">
                            {log.path}
                        </div>
                    </div>

                    {/* 原始日志 */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            原始Nginx日志
                        </label>
                        <div className="text-xs font-mono text-gray-700 bg-gray-100 p-3 rounded border max-h-40 overflow-y-auto whitespace-pre-wrap">
                            {log.other}
                        </div>
                    </div>

                    {/* 威胁分析 */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            威胁分析
                        </label>
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-yellow-800">
                                        安全提示
                                    </h3>
                                    <div className="mt-2 text-sm text-yellow-700">
                                        <p>
                                            该请求被标记为 <strong>{getThreatLevelInfo(log.threat_level).label}</strong> 威胁，
                                            类型为 <strong>{getThreatTypeInfo(log.threat_type).label}</strong>。
                                            建议关注此IP地址的后续活动，必要时考虑加入黑名单。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex justify-end space-x-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            关闭
                        </button>
                        <button
                            onClick={() => {
                                // 这里可以添加加入黑名单的逻辑
                                alert(`将IP ${log.ip} 加入黑名单功能待实现`);
                            }}
                            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            加入黑名单
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
