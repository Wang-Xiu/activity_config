'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { UserSpendData } from '../../types/user-spend';
import { useToast } from '../ToastProvider';
import { LoadingSpinner } from '../ui/loading';
import DataTable from './shared/DataTable';
import { TableRowData } from '../../types/monitor-dashboard';

interface UserSpendDashboardProps {
    activityId: string;
}

export default function UserSpendDashboard({ activityId }: UserSpendDashboardProps) {
    const [data, setData] = useState<UserSpendData[]>([]);
    const [loading, setLoading] = useState(true);
    const { showSuccess, showError } = useToast();

    const fetchData = useCallback(async () => {
        if (!activityId) {
            return;
        }
        
        try {
            setLoading(true);
            
            const { getFromNextjsApi } = await import('../../utils/frontendApiClient');
            const response = await getFromNextjsApi(`/api/activity/act-common/check-act-user-spend?act_id=${activityId}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            if (result.success) {
                if (!result.data || !Array.isArray(result.data)) {
                    setData([]);
                    showError('返回的数据格式不正确');
                    return;
                }
                
                setData(result.data);
                if (result.data.length > 0) {
                    showSuccess(`成功加载 ${result.data.length} 条数据`);
                }
            } else {
                throw new Error(result.message || '获取用户充值和积分数据失败');
            }
        } catch (error) {
            console.error('获取用户充值和积分数据失败:', error);
            const errorMessage = error instanceof Error ? error.message : '未知错误';
            showError('获取用户充值和积分数据失败: ' + errorMessage);
            setData([]);
        } finally {
            setLoading(false);
        }
    }, [activityId, showSuccess, showError]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // 格式化时间戳数组
    const formatTimestampArray = (timestamps: number[]): string => {
        if (!timestamps || timestamps.length === 0) {
            return '-';
        }
        return timestamps.map(ts => {
            const date = new Date(ts * 1000);
            return date.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });
        }).join(', ');
    };

    // 准备表格数据
    const tableData: TableRowData[] = useMemo(() => {
        return data.map((item, index) => ({
            key: `${item.uid}-${index}`,
            uid: item.uid,
            has_recharge: item.has_recharge === 1 ? '是' : '否',
            act_time: formatTimestampArray(item.act_time),
            action_time: formatTimestampArray(item.action_time),
            action_num: item.action_num,
        }));
    }, [data]);

    // 定义表格列
    const columns = [
        {
            key: 'uid',
            title: '用户ID',
            dataIndex: 'uid',
            sortable: true,
        },
        {
            key: 'has_recharge',
            title: '是否有充值',
            dataIndex: 'has_recharge',
            sortable: true,
            render: (value: string) => (
                <span className={value === '是' ? 'text-green-600 font-medium' : 'text-gray-500'}>
                    {value}
                </span>
            ),
        },
        {
            key: 'act_time',
            title: '活动时间',
            dataIndex: 'act_time',
            sortable: false,
            render: (value: string) => (
                <div className="max-w-md">
                    <span className="text-sm text-gray-700 whitespace-normal break-words">
                        {value}
                    </span>
                </div>
            ),
        },
        {
            key: 'action_time',
            title: '操作时间',
            dataIndex: 'action_time',
            sortable: false,
            render: (value: string) => (
                <div className="max-w-md">
                    <span className="text-sm text-gray-700 whitespace-normal break-words">
                        {value}
                    </span>
                </div>
            ),
        },
        {
            key: 'action_num',
            title: '操作次数',
            dataIndex: 'action_num',
            sortable: true,
            render: (value: number) => (
                <span className="font-medium text-gray-900">
                    {value}
                </span>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 flex items-center justify-center">
                <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-md mx-4 text-center">
                    <LoadingSpinner size="xl" color="purple" className="mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">正在加载用户充值和积分数据</h2>
                    <p className="text-gray-600">活动ID: <span className="font-semibold text-purple-600">{activityId}</span></p>
                </div>
            </div>
        );
    }

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
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            参与活动用户充值和积分情况
                        </h1>
                        <p className="text-purple-100 text-lg">活动ID: {activityId}</p>
                    </div>
                </div>

                {/* 数据统计卡片 */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm font-medium mb-1">数据总条数</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {data.length}
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
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 数据表格 */}
                {data.length > 0 ? (
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
                                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                            </svg>
                            用户充值和积分行为记录
                        </h2>
                        <DataTable
                            columns={columns}
                            data={tableData}
                            pagination={tableData.length > 10}
                            pageSize={10}
                            striped={true}
                            hover={true}
                            size="md"
                        />
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📊</div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-3">暂无数据</h3>
                        <p className="text-gray-500">当前活动暂无用户充值和积分数据</p>
                    </div>
                )}
            </div>
        </div>
    );
}

