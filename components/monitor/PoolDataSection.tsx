'use client';

import { useMemo, useCallback } from 'react';
import { PoolData, PoolInfo, TableRowData, ChartDataPoint } from '../../types/monitor-dashboard';
import MetricCard from './shared/MetricCard';
import DataTable from './shared/DataTable';
import BarChart from './shared/BarChart';

interface PoolDataSectionProps {
    data: PoolData;
}

export default function PoolDataSection({ data }: PoolDataSectionProps) {
    // 投入产出比状态判断函数
    const getRatioStatus = useCallback((ratio: number) => {
        if (ratio < 1.3) {
            return {
                status: 'low',
                color: 'text-red-600',
                bgColor: 'bg-red-500',
                label: '产出偏低',
            };
        } else if (ratio > 1.7) {
            return {
                status: 'high',
                color: 'text-orange-600',
                bgColor: 'bg-orange-500',
                label: '产出较高',
            };
        } else {
            return {
                status: 'optimal',
                color: 'text-green-600',
                bgColor: 'bg-green-500',
                label: '产出良好',
            };
        }
    }, []);

    // 计算总体统计数据
    const totalStats = useMemo(() => {
        if (!data || !data.total_daily || data.total_daily.length === 0) {
            return {
                totalInput: 0,
                totalOutput: 0,
                avgRatio: 0,
                profit: 0,
            };
        }

        const totalInput = data.total_daily.reduce((sum, item) => sum + item.total_input, 0);
        const totalOutput = data.total_daily.reduce((sum, item) => sum + item.total_output, 0);
        const avgRatio =
            data.total_daily.reduce((sum, item) => sum + item.total_ratio, 0) /
            data.total_daily.length;

        return {
            totalInput,
            totalOutput,
            avgRatio,
            profit: totalOutput - totalInput,
        };
    }, [data]);

    // 准备奖池表格数据
    const poolTableData: TableRowData[] = useMemo(() => {
        if (!data || !data.pools || !Array.isArray(data.pools)) {
            return [];
        }

        const result: TableRowData[] = [];

        data.pools.forEach((pool) => {
            pool.daily_data.forEach((dailyData) => {
                result.push({
                    key: `${pool.pool_id}-${dailyData.date}`,
                    pool_name: pool.pool_name,
                    date: dailyData.date,
                    input: dailyData.input,
                    output: dailyData.output,
                    ratio: dailyData.input_output_ratio,
                    participants: dailyData.participants,
                    times: dailyData.times,
                    profit: dailyData.output - dailyData.input,
                });
            });
        });

        return result.sort((a, b) => (a.date as string).localeCompare(b.date as string));
    }, [data]);

    // 准备日总计表格数据
    const dailyTotalTableData: TableRowData[] = useMemo(() => {
        if (!data || !data.total_daily || !Array.isArray(data.total_daily)) {
            return [];
        }
        return data.total_daily.map((item) => ({
            key: item.date,
            date: item.date,
            total_input: item.total_input,
            total_output: item.total_output,
            total_ratio: item.total_ratio,
            profit: item.total_output - item.total_input,
        }));
    }, [data]);

    // 准备图表数据 - 投入产出对比
    const chartData: ChartDataPoint[] = useMemo(() => {
        if (!data || !data.total_daily || !Array.isArray(data.total_daily)) {
            return [];
        }
        return data.total_daily.map((item) => ({
            name: item.date,
            投入: item.total_input,
            产出: item.total_output,
            value: item.total_input,
        }));
    }, [data]);

    // 奖池明细表格列定义
    const poolColumns = useMemo(
        () => [
            {
                key: 'pool_name',
                title: '奖池名称',
                dataIndex: 'pool_name',
                sortable: true,
                width: 120,
                render: (value: string) => (
                    <span className="font-medium text-gray-900">{value}</span>
                ),
            },
            {
                key: 'date',
                title: '日期',
                dataIndex: 'date',
                sortable: true,
                width: 100,
            },
            {
                key: 'input',
                title: '投入',
                dataIndex: 'input',
                sortable: true,
                align: 'right' as const,
                render: (value: number) => (
                    <span className="font-medium text-red-600">{value.toLocaleString()}</span>
                ),
            },
            {
                key: 'output',
                title: '产出',
                dataIndex: 'output',
                sortable: true,
                align: 'right' as const,
                render: (value: number) => (
                    <span className="font-medium text-green-600">{value.toLocaleString()}</span>
                ),
            },
            {
                key: 'ratio',
                title: '投入产出比',
                dataIndex: 'ratio',
                sortable: true,
                align: 'center' as const,
                render: (value: number) => {
                    // 处理 NaN 或无效值，显示为 0
                    const displayValue = typeof value === 'number' && !isNaN(value) ? value : 0;
                    const status = getRatioStatus(displayValue);
                    return (
                        <div className="flex items-center justify-center">
                            <div className="w-20 bg-gray-200 rounded-full h-2 mr-3">
                                <div
                                    className={`h-2 rounded-full ${status.bgColor}`}
                                    style={{ width: `${Math.min((displayValue / 2) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="text-center">
                                <div className={`text-sm font-bold ${status.color}`}>
                                    {displayValue.toFixed(2)}
                                </div>
                                <div className={`text-xs ${status.color}`}>{status.label}</div>
                            </div>
                        </div>
                    );
                },
            },
            {
                key: 'participants',
                title: '参与人数',
                dataIndex: 'participants',
                sortable: true,
                align: 'right' as const,
                render: (value: number) => (
                    <span className="text-gray-700">{value.toLocaleString()}</span>
                ),
            },
            {
                key: 'times',
                title: '参与次数',
                dataIndex: 'times',
                sortable: true,
                align: 'right' as const,
                render: (value: number) => (
                    <span className="text-gray-700">{value.toLocaleString()}</span>
                ),
            },
        ],

        [getRatioStatus],
    );

    // 日总计表格列定义
    const dailyTotalColumns = useMemo(
        () => [
            {
                key: 'date',
                title: '日期',
                dataIndex: 'date',
                sortable: true,
                width: 120,
            },
            {
                key: 'total_input',
                title: '总投入',
                dataIndex: 'total_input',
                sortable: true,
                align: 'right' as const,
                render: (value: number) => (
                    <span className="font-medium text-red-600 text-lg">
                        {value.toLocaleString()}
                    </span>
                ),
            },
            {
                key: 'total_output',
                title: '总产出',
                dataIndex: 'total_output',
                sortable: true,
                align: 'right' as const,
                render: (value: number) => (
                    <span className="font-medium text-green-600 text-lg">
                        {value.toLocaleString()}
                    </span>
                ),
            },
            {
                key: 'total_ratio',
                title: '投入产出比',
                dataIndex: 'total_ratio',
                sortable: true,
                align: 'center' as const,
                render: (value: number) => {
                    // 处理 NaN 或无效值，显示为 0
                    const displayValue = typeof value === 'number' && !isNaN(value) ? value : 0;
                    const status = getRatioStatus(displayValue);
                    return (
                        <div className="flex items-center justify-center">
                            <div className="w-24 bg-gray-200 rounded-full h-3 mr-3">
                                <div
                                    className={`h-3 rounded-full ${status.bgColor}`}
                                    style={{ width: `${Math.min((displayValue / 2) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <div className="text-center">
                                <div className={`text-base font-bold ${status.color}`}>
                                    {displayValue.toFixed(2)}
                                </div>
                                <div className={`text-xs ${status.color}`}>{status.label}</div>
                            </div>
                        </div>
                    );
                },
            },
        ],

        [getRatioStatus],
    );

    // 数据安全检查
    if (
        !data ||
        !data.pools ||
        !data.total_daily ||
        !Array.isArray(data.pools) ||
        !Array.isArray(data.total_daily)
    ) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    <span className="ml-3 text-gray-600">加载奖池数据...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 标题和总览指标 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <svg
                                className="w-6 h-6 text-green-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">奖池投入产出分析</h2>
                            <p className="text-sm text-gray-500">各奖池投入产出数据和盈亏分析</p>
                        </div>
                    </div>
                </div>

                {/* 总览指标卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <MetricCard
                        title="总投入"
                        value={totalStats.totalInput}
                        color="red"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                                />
                            </svg>
                        }
                    />

                    <MetricCard
                        title="总产出"
                        value={totalStats.totalOutput}
                        color="green"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        }
                    />

                    <MetricCard
                        title="平均投入产出比"
                        value={(typeof totalStats.avgRatio === 'number' && !isNaN(totalStats.avgRatio)
                            ? totalStats.avgRatio
                            : 0).toFixed(2)}
                        color={
                            getRatioStatus(totalStats.avgRatio).status === 'optimal'
                                ? 'green'
                                : getRatioStatus(totalStats.avgRatio).status === 'low'
                                  ? 'red'
                                  : 'orange'
                        }
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* 投入产出趋势图 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">每日投入产出趋势</h3>
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                            <span className="text-gray-600">投入</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">产出</span>
                        </div>
                    </div>
                </div>

                <BarChart
                    data={chartData}
                    xAxisKey="name"
                    bars={[
                        {
                            dataKey: '投入',
                            name: '投入',
                            color: '#EF4444',
                        },
                        {
                            dataKey: '产出',
                            name: '产出',
                            color: '#10B981',
                        },
                    ]}
                    height={350}
                    showLegend={true}
                    showGrid={true}
                    xAxisLabel="日期"
                    yAxisLabel="金额"
                />
            </div>

            {/* 每日总计数据表格 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">每日总计数据</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span>所有奖池的每日汇总数据</span>
                    </div>
                </div>

                <DataTable
                    columns={dailyTotalColumns}
                    data={dailyTotalTableData}
                    pagination={false}
                    striped={true}
                    hover={true}
                    size="md"
                />
            </div>

            {/* 奖池明细数据表格 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">奖池明细数据</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2m0 0h14m-14 0a2 2 0 002 2v2a2 2 0 01-2 2"
                            />
                        </svg>
                        <span>各奖池的详细数据，支持排序和筛选</span>
                    </div>
                </div>

                <DataTable
                    columns={poolColumns}
                    data={poolTableData}
                    pagination={poolTableData.length > 15}
                    pageSize={15}
                    striped={true}
                    hover={true}
                    size="md"
                />
            </div>
        </div>
    );
}
