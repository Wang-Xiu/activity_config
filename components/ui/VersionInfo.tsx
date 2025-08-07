'use client';

import { ConfigVersionInfo } from '../../types/config';

interface VersionInfoProps {
    versionInfo?: ConfigVersionInfo | null;
    isLoading?: boolean;
    className?: string;
}

export default function VersionInfo({
    versionInfo,
    isLoading = false,
    className = '',
}: VersionInfoProps) {
    // 格式化时间显示
    const formatTime = (timeString?: string): string => {
        if (!timeString) return '暂无';

        try {
            const date = new Date(timeString);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
            });
        } catch (error) {
            return timeString;
        }
    };

    // 获取版本状态颜色
    const getVersionStatusColor = (version?: string): string => {
        if (!version) return 'text-gray-500 bg-gray-100';

        // 根据版本号或时间戳判断新旧程度
        const timestamp = parseInt(version);
        if (!isNaN(timestamp)) {
            const versionDate = new Date(timestamp * 1000);
            const now = new Date();
            const hoursDiff = (now.getTime() - versionDate.getTime()) / (1000 * 60 * 60);

            if (hoursDiff < 1) return 'text-green-700 bg-green-100';
            if (hoursDiff < 24) return 'text-blue-700 bg-blue-100';
            if (hoursDiff < 168) return 'text-yellow-700 bg-yellow-100';
        }

        return 'text-gray-700 bg-gray-100';
    };

    if (isLoading) {
        return (
            <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">配置版本信息</h3>
                    <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
                </div>
                <div className="space-y-2">
                    <div className="animate-pulse bg-gray-200 h-4 w-32 rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-40 rounded"></div>
                    <div className="animate-pulse bg-gray-200 h-4 w-28 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white border border-gray-200 rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900 flex items-center">
                    <svg
                        className="w-4 h-4 mr-2 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                    </svg>
                    配置版本信息
                </h3>
                {versionInfo?.version && (
                    <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getVersionStatusColor(versionInfo.version)}`}
                    >
                        v{versionInfo.version}
                    </span>
                )}
            </div>

            <div className="space-y-3">
                {/* 版本号 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-1.414 0l-7-7A1.997 1.997 0 013 12V7a4 4 0 014-4z"
                            />
                        </svg>
                        版本号:
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                        {versionInfo?.version || '暂无'}
                    </span>
                </div>

                {/* 最后修改时间 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        修改时间:
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                        {formatTime(versionInfo?.update_time)}
                    </span>
                </div>

                {/* 操作人 */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                        操作人:
                    </div>
                    <div className="flex items-center">
                        {versionInfo?.operator && (
                            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mr-2">
                                <span className="text-white text-xs font-medium">
                                    {versionInfo.operator.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <span className="text-sm font-medium text-gray-900">
                            {versionInfo?.operator || '暂无'}
                        </span>
                    </div>
                </div>
            </div>

            {/* 警告信息 */}
            {versionInfo?.version && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg
                                className="w-5 h-5 text-yellow-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-yellow-800">
                                保存配置时将检查版本号，避免并发修改冲突
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
