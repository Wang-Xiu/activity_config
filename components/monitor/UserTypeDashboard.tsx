'use client';

import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from 'recharts';
import { ActUserTypeData } from '../../types/user-type';
import { useToast } from '../ToastProvider';
import { LoadingSpinner } from '../ui/loading';

interface UserTypeDashboardProps {
    activityId: string;
}

export default function UserTypeDashboard({ activityId }: UserTypeDashboardProps) {
    const [data, setData] = useState<ActUserTypeData | null>(null);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();

    const fetchData = useCallback(async () => {
        if (!activityId) {
            return;
        }
        
        try {
            setLoading(true);
            
            const { postToNextjsApi } = await import('../../utils/frontendApiClient');
            const response = await postToNextjsApi('/api/activity/act-common/get-act-user-type', {
                act_id: activityId,
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                if (!result.data) {
                    setData(null);
                    showError('返回的数据为空');
                    return;
                }
                
                setData(result.data);
                showSuccess('用户群体数据加载成功');
            } else {
                throw new Error(result.message || '获取用户群体数据失败');
            }
        } catch (error) {
            console.error('获取用户群体数据失败:', error);
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            showError('获取用户群体数据失败: ' + errorMessage);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [activityId, showSuccess, showError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-md mx-4 text-center">
                    <LoadingSpinner size="xl" color="purple" className="mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">正在加载用户群体数据</h2>
                    <p className="text-gray-600">活动ID: <span className="font-semibold text-purple-600">{activityId}</span></p>
                </div>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-md mx-4 text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">暂无用户群体数据</h3>
                    <p className="text-gray-500">无法获取活动 #{activityId} 的用户群体数据</p>
                </div>
            </div>
        );
    }

    // 计算用户注册时间分布的总和
    const monthDataEntries = Object.entries(data.month_data || {});
    const totalMonthData = monthDataEntries.reduce((sum, [, value]) => sum + value, 0);

    // 格式化注册时间数据键名
    const formatMonthKey = (key: string): string => {
        if (key === 'year_Ago') return '一年前';
        if (key === '0') return '当月';
        return `${key}个月前`;
    };

    // 计算百分比
    const calculatePercentage = (value: number, total: number): number => {
        if (total === 0) return 0;
        return (value / total) * 100;
    };

    // 准备环形图数据
    const chartData = monthDataEntries.map(([key, value]) => ({
        name: formatMonthKey(key),
        value: value,
        percentage: calculatePercentage(value, totalMonthData)
    }));

    // 定义颜色方案（紫色系渐变）
    const COLORS = ['#8B5CF6', '#6366F1', '#4F46E5', '#4338CA', '#3730A3', '#312E81', '#1E1B4B'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* 标题区域 */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
                        <h1 className="text-4xl font-bold mb-2 flex items-center">
                            <svg
                                className="w-10 h-10 mr-3"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                />
                            </svg>
                            参与活动用户基本群体
                        </h1>
                        <p className="text-purple-100 text-lg">活动ID: {activityId}</p>
                    </div>
                </div>

                {/* 数据卡片网格 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                    {/* 总用户数卡片 */}
                    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-blue-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">总参与用户数</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {data.total_user?.length || 0}
                                </p>
                            </div>
                            <div className="bg-blue-100 rounded-full p-4">
                                <svg
                                    className="w-8 h-8 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 无小号用户数卡片 */}
                    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">无小号用户数</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {data.small_data || 0}
                                </p>
                            </div>
                            <div className="bg-green-100 rounded-full p-4">
                                <svg
                                    className="w-8 h-8 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* 用户注册时间分布总和卡片 */}
                    <div className="bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all duration-300 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">用户注册时间分布总和</p>
                                <p className="text-3xl font-bold text-gray-900">
                                    {totalMonthData}
                                </p>
                            </div>
                            <div className="bg-purple-100 rounded-full p-4">
                                <svg
                                    className="w-8 h-8 text-purple-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 用户注册时间分布 */}
                {monthDataEntries.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg
                                className="w-6 h-6 mr-2 text-purple-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            用户注册时间分布
                        </h2>
                        <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                            {/* 环形图 */}
                            <div className="w-full lg:w-1/2">
                                <ResponsiveContainer width="100%" height={400}>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ percentage }) => `${percentage.toFixed(1)}%`}
                                            outerRadius={120}
                                            innerRadius={60}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: number, name: string, props: any) => [
                                                `${value} (${props.payload.percentage.toFixed(1)}%)`,
                                                props.payload.name
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            {/* 图例 */}
                            <div className="w-full lg:w-1/2">
                                <div className="space-y-3">
                                    {chartData.map((entry, index) => (
                                        <div key={index} className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <div
                                                    className="w-4 h-4 rounded-full"
                                                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                />
                                                <span className="text-sm font-medium text-gray-700">
                                                    {entry.name}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-sm font-bold text-gray-900">
                                                    {entry.value}
                                                </span>
                                                <span className="text-sm text-gray-500 ml-2">
                                                    ({entry.percentage.toFixed(1)}%)
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 用户ID列表 */}
                {data.total_user && data.total_user.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                            <svg
                                className="w-6 h-6 mr-2 text-indigo-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                />
                            </svg>
                            参与用户列表 ({data.total_user.length} 人)
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {data.total_user.map((userId, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 text-center border border-indigo-200 hover:shadow-md transition-all duration-200 hover:scale-105"
                                >
                                    <span className="text-sm font-medium text-gray-700">
                                        {userId}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

