'use client';

import { useState, useEffect } from 'react';
import { MonitorDashboardData, MonitorDataRequest } from '../../types/monitor-dashboard';
import { useToast } from '../Toast';
import PVUVSection from './PVUVSection';
import PoolDataSection from './PoolDataSection';
import SummarySection from './SummarySection';
import DateRangePicker from './shared/DateRangePicker';

interface MonitorDashboardProps {
    activityId: string;
}

export default function MonitorDashboard({ activityId }: MonitorDashboardProps) {
    const [data, setData] = useState<MonitorDashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState<string>('');
    const [refreshing, setRefreshing] = useState(false);
    const { showSuccess, showError, showWarning } = useToast();
    
    // 获取监控数据
    const fetchMonitorData = async (customDateRange?: string) => {
        try {
            setRefreshing(true);
            const requestData: MonitorDataRequest = {
                act_id: activityId,
                date_range: customDateRange || dateRange || undefined
            };

            const response = await fetch('/api/universal/monitor-data', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            
            if (result.success) {
                setData(result.data);
                showSuccess('监控数据加载成功');
            } else {
                throw new Error(result.message || '获取监控数据失败');
            }
        } catch (error) {
            console.error('获取监控数据失败:', error);
            showError('获取监控数据失败: ' + (error instanceof Error ? error.message : '未知错误'));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // 初始化加载数据
    useEffect(() => {
        if (activityId) {
            fetchMonitorData();
        }
    }, [activityId]); // eslint-disable-line react-hooks/exhaustive-deps

    // 处理日期范围变更
    const handleDateRangeChange = (newDateRange: string) => {
        setDateRange(newDateRange);
        fetchMonitorData(newDateRange);
    };

    // 手动刷新
    const handleRefresh = () => {
        fetchMonitorData();
    };

    // 加载状态
    if (loading) {
        return (
            <div className="space-y-8">
                {/* 顶部控制栏骨架屏 */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between">
                        <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                        <div className="flex items-center space-x-4">
                            <div className="h-10 bg-gray-200 rounded w-48 animate-pulse"></div>
                            <div className="h-10 bg-gray-200 rounded w-24 animate-pulse"></div>
                        </div>
                    </div>
                </div>

                {/* 内容区域骨架屏 */}
                <div className="grid grid-cols-1 gap-8">
                    {[1, 2, 3].map((index) => (
                        <div key={index} className="bg-white p-6 rounded-lg shadow">
                            <div className="h-6 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="bg-white p-12 rounded-lg shadow text-center">
                <div className="text-6xl text-gray-300 mb-4">📊</div>
                <h3 className="text-xl font-medium text-gray-700 mb-3">暂无监控数据</h3>
                <p className="text-gray-500 mb-6">
                    无法获取活动 #{activityId} 的监控数据
                </p>
                <button
                    onClick={handleRefresh}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                    重新加载
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* 顶部控制栏 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {data.activity_info.name} - 监控仪表盘
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            活动期间：{data.activity_info.start_date} 至 {data.activity_info.end_date} 
                            （共 {data.activity_info.duration_days} 天）
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <DateRangePicker
                            value={dateRange}
                            onChange={handleDateRangeChange}
                            defaultStartDate={data.activity_info.start_date}
                            defaultEndDate={data.activity_info.end_date}
                        />
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <svg 
                                className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {refreshing ? '刷新中...' : '刷新数据'}
                        </button>
                    </div>
                </div>
            </div>

            {/* PV/UV数据区域 */}
            <PVUVSection data={data.pv_uv_data} />

            {/* 奖池投入产出数据区域 */}
            <PoolDataSection data={data.pool_data} />

            {/* 活动总体数据区域 */}
            <SummarySection data={data.summary_data} />
        </div>
    );
}