'use client';

import { useState, useEffect, useCallback } from 'react';
import { TopAttackIP } from '../../types/security-logs';
import { useToast } from '../ToastProvider';
import { postToNextjsApi } from '../../utils/frontendApiClient';
import LoadingSpinner from '../ui/loading/LoadingSpinner';

interface TopIPsListProps {
    refreshTrigger?: number;
}

export default function TopIPsList({ refreshTrigger }: TopIPsListProps) {
    const [topIPs, setTopIPs] = useState<TopAttackIP[]>([]);
    const [loading, setLoading] = useState(false);
    const { showError } = useToast();

    // 获取Top IP数据
    const fetchTopIPs = async () => {
        setLoading(true);
        try {
            console.log('开始获取Top攻击IP数据...');
            
            // 获取今天的数据
            const today = new Date();
            const todayStr = today.toISOString().split('T')[0];
            
            const response = await postToNextjsApi('/api/security-logs/top-ips', {
                start_date: todayStr + ' 00:00:00',
                end_date: todayStr + ' 23:59:59',
                limit: 5 // 只获取前5个IP
            });

            if (!response.ok) {
                throw new Error(`获取Top IP数据失败: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('Top IP数据响应:', result);
            
            if (result.success && result.data) {
                // API 现在直接返回数组
                const topIPsData = Array.isArray(result.data) ? result.data : [];
                setTopIPs(topIPsData);
                console.log('成功获取Top IP数据:', topIPsData);
            } else {
                throw new Error(result.message || '获取Top IP数据失败');
            }
        } catch (error) {
            console.error('获取Top IP数据出错:', error);
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            showError(`获取Top IP数据时发生错误: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    // 初始加载和刷新触发
    useEffect(() => {
        fetchTopIPs();
    }, [refreshTrigger]); // 移除 fetchTopIPs 依赖

    // 威胁等级样式
    const getThreatLevelStyle = (level: string) => {
        switch (level) {
            case 'high':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'low':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    // 威胁等级文本
    const getThreatLevelText = (level: string) => {
        switch (level) {
            case 'high': return '高危';
            case 'medium': return '中危';
            case 'low': return '低危';
            default: return '未知';
        }
    };

    // 格式化时间
    const formatDateTime = (dateTime: string) => {
        return new Date(dateTime).toLocaleString('zh-CN');
    };

    // 格式化地理位置
    const formatLocation = (country?: string, city?: string) => {
        if (country && city) {
            return `${country} - ${city}`;
        } else if (country) {
            return country;
        } else if (city) {
            return city;
        }
        return '未知';
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top 攻击IP</h3>
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Top 攻击IP</h3>
                <button
                    onClick={fetchTopIPs}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    刷新
                </button>
            </div>

            {topIPs.length === 0 ? (
                <div className="flex justify-center items-center h-64 text-gray-500">
                    暂无攻击IP数据
                </div>
            ) : (
                <div className="space-y-3">
                    {Array.isArray(topIPs) ? topIPs.map((ip, index) => (
                        <div 
                            key={ip.ip} 
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center justify-between">
                                {/* 排名和IP */}
                                <div className="flex items-center space-x-3">
                                    <div className={`
                                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                        ${index === 0 ? 'bg-yellow-500 text-white' : 
                                          index === 1 ? 'bg-gray-400 text-white' : 
                                          index === 2 ? 'bg-orange-600 text-white' : 
                                          'bg-gray-200 text-gray-700'}
                                    `}>
                                        {index + 1}
                                    </div>
                                    <div>
                                        <div className="font-mono text-lg font-semibold text-gray-900">
                                            {ip.ip}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {formatLocation(ip.country, ip.city)}
                                        </div>
                                    </div>
                                </div>

                                {/* 攻击次数和威胁等级 */}
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-red-600">
                                        {ip.count.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">次攻击</div>
                                </div>
                            </div>

                            {/* 详细信息 */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                                    <div>
                                        <span className="text-gray-600">威胁等级:</span>
                                        <span className={`ml-2 px-2 py-1 rounded-full text-xs border ${getThreatLevelStyle(ip.threat_level)}`}>
                                            {getThreatLevelText(ip.threat_level)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">首次发现:</span>
                                        <span className="ml-2 text-gray-900">
                                            {formatDateTime(ip.first_seen)}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">最后活动:</span>
                                        <span className="ml-2 text-gray-900">
                                            {formatDateTime(ip.last_seen)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* 进度条显示攻击频率 */}
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                    <span>攻击频率</span>
                                    <span>{((ip.count / (topIPs[0]?.count || 1)) * 100).toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`h-2 rounded-full ${
                                            ip.threat_level === 'high' ? 'bg-red-500' :
                                            ip.threat_level === 'medium' ? 'bg-yellow-500' :
                                            'bg-blue-500'
                                        }`}
                                        style={{ 
                                            width: `${(ip.count / (topIPs[0]?.count || 1)) * 100}%` 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="flex justify-center items-center h-32 text-gray-500">
                            数据格式错误
                        </div>
                    )}
                </div>
            )}

        </div>
    );
}
