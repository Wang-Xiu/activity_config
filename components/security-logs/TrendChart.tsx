'use client';

import { useState, useEffect, useCallback } from 'react';
import { SecurityTrend } from '../../types/security-logs';
import { useToast } from '../ToastProvider';
import { postToNextjsApi } from '../../utils/frontendApiClient';
import LoadingSpinner from '../ui/loading/LoadingSpinner';

interface TrendChartProps {
    refreshTrigger?: number;
}

export default function TrendChart({ refreshTrigger }: TrendChartProps) {
    const [trends, setTrends] = useState<SecurityTrend[]>([]);
    const [loading, setLoading] = useState(false);
    const { showError } = useToast();

    // 获取趋势数据
    const fetchTrends = async () => {
        setLoading(true);
        try {
            console.log('开始获取24小时趋势数据...');
            
            // 计算24小时前的时间
            const endDate = new Date();
            const startDate = new Date(endDate.getTime() - 24 * 60 * 60 * 1000);
            
            const response = await postToNextjsApi('/api/security-logs/trends', {
                start_date: startDate.toISOString().split('T')[0] + ' ' + startDate.toTimeString().split(' ')[0],
                end_date: endDate.toISOString().split('T')[0] + ' ' + endDate.toTimeString().split(' ')[0],
                interval: 'hour'
            });

            if (!response.ok) {
                throw new Error(`获取趋势数据失败: ${response.status} ${response.statusText}`);
            }

            const result = await response.json();
            console.log('趋势数据响应:', result);
            
            if (result.success && result.data) {
                // API 现在直接返回数组
                const trendsData = Array.isArray(result.data) ? result.data : [];
                setTrends(trendsData);
                console.log('成功获取趋势数据:', trendsData);
            } else {
                throw new Error(result.message || '获取趋势数据失败');
            }
        } catch (error) {
            console.error('获取趋势数据出错:', error);
            const errorMsg = error instanceof Error ? error.message : '未知错误';
            showError(`获取趋势数据时发生错误: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    // 初始加载和刷新触发
    useEffect(() => {
        fetchTrends();
    }, [refreshTrigger]); // 移除 fetchTrends 依赖

    // 格式化时间显示
    const formatTime = (timeStr: string) => {
        const date = new Date(timeStr);
        return date.toLocaleTimeString('zh-CN', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // 获取最大值用于计算高度比例
    const maxValue = Array.isArray(trends) && trends.length > 0 
        ? Math.max(...trends.map(t => t.total_count), 1)
        : 1;

    // 威胁等级颜色
    const getThreatColor = (level: string) => {
        switch (level) {
            case 'high': return 'bg-red-500';
            case 'medium': return 'bg-yellow-500';
            case 'low': return 'bg-blue-500';
            default: return 'bg-gray-400';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">24小时攻击趋势</h3>
                <div className="flex justify-center items-center h-64">
                    <LoadingSpinner size="lg" />
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">24小时攻击趋势</h3>
                <button
                    onClick={fetchTrends}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                    刷新
                </button>
            </div>

            {trends.length === 0 ? (
                <div className="flex justify-center items-center h-64 text-gray-500">
                    暂无趋势数据
                </div>
            ) : (
                <div className="space-y-4">
                    {/* 图例 */}
                    <div className="flex justify-center space-x-6 text-sm">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                            <span>高危</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                            <span>中危</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                            <span>低危</span>
                        </div>
                    </div>

                    {/* 图表区域 - 添加水平滚动 */}
                    <div className="relative">
                        {/* 滚动提示 */}
                        {Array.isArray(trends) && trends.length > 12 && (
                            <div className="absolute top-2 right-4 text-xs text-gray-500 bg-white px-2 py-1 rounded shadow-sm z-10">
                                ← 可左右滑动查看更多数据 →
                            </div>
                        )}
                        <div className="h-64 overflow-x-auto" style={{ 
                            scrollbarWidth: 'thin',
                            scrollbarColor: '#d1d5db #f3f4f6'
                        }}>
                            <style jsx>{`
                                div::-webkit-scrollbar {
                                    height: 8px;
                                }
                                div::-webkit-scrollbar-track {
                                    background: #f3f4f6;
                                    border-radius: 4px;
                                }
                                div::-webkit-scrollbar-thumb {
                                    background: #d1d5db;
                                    border-radius: 4px;
                                }
                                div::-webkit-scrollbar-thumb:hover {
                                    background: #9ca3af;
                                }
                            `}</style>
                            <div className="flex items-end space-x-2 px-4 min-w-max" style={{ minWidth: `${Math.max(trends.length * 60, 1000)}px` }}>
                        {Array.isArray(trends) ? trends.map((trend, index) => {
                            const totalHeight = (trend.total_count / maxValue) * 200;
                            const highHeight = (trend.high_risk_count / maxValue) * 200;
                            const mediumHeight = (trend.medium_risk_count / maxValue) * 200;
                            const lowHeight = (trend.low_risk_count / maxValue) * 200;

                            return (
                                <div key={index} className="flex flex-col items-center group relative flex-shrink-0">
                                    {/* 柱状图 */}
                                    <div 
                                        className="w-10 flex flex-col justify-end bg-gray-100 rounded-t"
                                        style={{ height: `${Math.max(totalHeight, 4)}px` }}
                                    >
                                        {/* 高危部分 */}
                                        {trend.high_risk_count > 0 && (
                                            <div 
                                                className="bg-red-500 rounded-t"
                                                style={{ height: `${highHeight}px` }}
                                            ></div>
                                        )}
                                        {/* 中危部分 */}
                                        {trend.medium_risk_count > 0 && (
                                            <div 
                                                className="bg-yellow-500"
                                                style={{ height: `${mediumHeight}px` }}
                                            ></div>
                                        )}
                                        {/* 低危部分 */}
                                        {trend.low_risk_count > 0 && (
                                            <div 
                                                className="bg-blue-500"
                                                style={{ height: `${lowHeight}px` }}
                                            ></div>
                                        )}
                                    </div>

                                    {/* 时间标签 */}
                                    <div className="text-xs text-gray-600 mt-2 text-center w-12">
                                        <div className="transform -rotate-45 origin-center whitespace-nowrap">
                                            {formatTime(trend.time)}
                                        </div>
                                    </div>

                                    {/* 悬停提示 */}
                                    <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                                        <div>时间: {formatTime(trend.time)}</div>
                                        <div>总计: {trend.total_count}</div>
                                        <div>高危: {trend.high_risk_count}</div>
                                        <div>中危: {trend.medium_risk_count}</div>
                                        <div>低危: {trend.low_risk_count}</div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="flex justify-center items-center h-full text-gray-500">
                                暂无趋势数据
                            </div>
                        )}
                            </div>
                        </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="border-t pt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                            <div className="text-2xl font-bold text-gray-900">
                                {Array.isArray(trends) ? trends.reduce((sum, t) => sum + t.total_count, 0) : 0}
                            </div>
                            <div className="text-sm text-gray-600">总攻击次数</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-red-600">
                                {Array.isArray(trends) ? trends.reduce((sum, t) => sum + t.high_risk_count, 0) : 0}
                            </div>
                            <div className="text-sm text-gray-600">高危攻击</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-yellow-600">
                                {Array.isArray(trends) ? trends.reduce((sum, t) => sum + t.medium_risk_count, 0) : 0}
                            </div>
                            <div className="text-sm text-gray-600">中危攻击</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {Array.isArray(trends) ? trends.reduce((sum, t) => sum + t.low_risk_count, 0) : 0}
                            </div>
                            <div className="text-sm text-gray-600">低危攻击</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
