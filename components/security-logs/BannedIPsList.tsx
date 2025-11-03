'use client';

import { useState, useEffect } from 'react';
import { BannedIPEntry, BannedIPsResponse, SecurityApiResponse } from '../../types/security-logs';
import { postToNextjsApi } from '../../utils/frontendApiClient';
import { useToast } from '../ToastProvider';

interface BannedIPsListProps {
    refreshTrigger?: number;
}

export default function BannedIPsList({ refreshTrigger = 0 }: BannedIPsListProps) {
    const [bannedIPs, setBannedIPs] = useState<BannedIPEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [copiedCommand, setCopiedCommand] = useState<string | null>(null);
    const { showSuccess, showError } = useToast();

    // 获取已封禁IP列表
    const fetchBannedIPs = async () => {
        setLoading(true);
        try {
            // 无需任何请求参数
            const response = await postToNextjsApi('/api/security-logs/banned-ips', {});

            if (!response.ok) {
                throw new Error(`HTTP错误: ${response.status}`);
            }

            const result: SecurityApiResponse<BannedIPsResponse> = await response.json();

            if (result.success) {
                setBannedIPs(result.data.banned_ips || []);
            } else {
                showError(result.message || '获取封禁IP列表失败');
            }
        } catch (error) {
            console.error('获取封禁IP列表出错:', error);
            showError('获取封禁IP列表失败');
        } finally {
            setLoading(false);
        }
    };

    // 复制命令到剪贴板
    const copyCommand = async (command: string, ip: string) => {
        try {
            await navigator.clipboard.writeText(command);
            setCopiedCommand(ip);
            showSuccess('命令已复制到剪贴板');
            setTimeout(() => setCopiedCommand(null), 2000);
        } catch (error) {
            showError('复制失败');
        }
    };

    // 格式化时间
    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch {
            return dateString;
        }
    };

    useEffect(() => {
        fetchBannedIPs();
    }, [refreshTrigger]);

    return (
        <div className="bg-white rounded-lg shadow">
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <svg className="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                        </svg>
                        <h2 className="text-lg font-semibold text-gray-900">已封禁IP名单</h2>
                        <span className="ml-3 px-2 py-1 text-xs font-medium text-red-700 bg-red-100 rounded-full">
                            {bannedIPs.length} 个
                        </span>
                    </div>
                    <button
                        onClick={fetchBannedIPs}
                        disabled={loading}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                        <svg className={`w-4 h-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        刷新
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center h-64">
                        <div className="flex flex-col items-center">
                            <svg className="animate-spin h-8 w-8 text-blue-600 mb-2" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span className="text-sm text-gray-600">加载中...</span>
                        </div>
                    </div>
                ) : bannedIPs.length === 0 ? (
                    <div className="text-center py-12">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">暂无封禁IP</h3>
                        <p className="mt-1 text-sm text-gray-500">当前没有被封禁的IP地址</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        IP地址
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        位置
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        封禁时间
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        攻击次数
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        封禁原因
                                    </th>
                                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        封禁命令
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bannedIPs.map((entry, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                    {entry.ip}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {entry.country && entry.city ? (
                                                    <span className="flex items-center">
                                                        <svg className="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        </svg>
                                                        {entry.country} {entry.city}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{formatDate(entry.banned_at)}</div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {entry.attack_count ? (
                                                    <span className="text-red-600">{entry.attack_count} 次</span>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-gray-900 max-w-xs truncate" title={entry.reason}>
                                                {entry.reason}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center space-x-2">
                                                <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-800 max-w-xs truncate block" title={entry.ban_command}>
                                                    {entry.ban_command}
                                                </code>
                                                <button
                                                    onClick={() => copyCommand(entry.ban_command, entry.ip)}
                                                    className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                    title="复制命令"
                                                >
                                                    {copiedCommand === entry.ip ? (
                                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    ) : (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                        </svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 说明文字 */}
                {bannedIPs.length > 0 && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">
                                    点击命令旁边的复制按钮可以快速复制封禁命令。请谨慎执行IP封禁操作，确保不会误封正常用户。
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

