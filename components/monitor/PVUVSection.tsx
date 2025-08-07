'use client';

import { useMemo } from 'react';
import {
    PVUVData,
    DailyPVUVData,
    TableRowData,
    ChartDataPoint,
} from '../../types/monitor-dashboard';
import MetricCard from './shared/MetricCard';
import DataTable from './shared/DataTable';
import BarChart from './shared/BarChart';
import LineChart from './shared/LineChart';

interface PVUVSectionProps {
    data: PVUVData;
}

export default function PVUVSection({ data }: PVUVSectionProps) {
    // 准备表格数据
    const tableData: TableRowData[] = useMemo(() => {
        if (!data || !data.daily_data || !Array.isArray(data.daily_data)) {
            return [];
        }
        return data.daily_data.map((item, index) => {
            const totalPV = item.entrance_breakdown
                ? Object.values(item.entrance_breakdown).reduce((sum, entry) => sum + entry.pv, 0)
                : item.pv;
            const totalUV = item.entrance_breakdown
                ? Object.values(item.entrance_breakdown).reduce((sum, entry) => sum + entry.uv, 0)
                : item.uv;

            return {
                key: item.date,
                date: item.date,
                pv: item.pv,
                uv: item.uv,
                totalPV: totalPV,
                totalUV: totalUV,
                hasBreakdown: !!item.entrance_breakdown,
                breakdownData: item.entrance_breakdown,
            };
        });
    }, [data]);

    // 准备图表数据
    const chartData: ChartDataPoint[] = useMemo(() => {
        if (!data || !data.daily_data || !Array.isArray(data.daily_data)) {
            return [];
        }
        return data.daily_data.map((item) => ({
            name: item.date,
            PV: item.pv,
            UV: item.uv,
            value: item.pv,
        }));
    }, [data]);

    // 表格列定义
    const columns = useMemo(
        () => [
            {
                key: 'date',
                title: '日期',
                dataIndex: 'date',
                sortable: true,
                width: 120,
            },
            {
                key: 'pv',
                title: 'PV',
                dataIndex: 'pv',
                sortable: true,
                render: (value: number) => (
                    <span className="font-medium text-blue-600">{value.toLocaleString()}</span>
                ),
            },
            {
                key: 'uv',
                title: 'UV',
                dataIndex: 'uv',
                sortable: true,
                render: (value: number) => (
                    <span className="font-medium text-green-600">{value.toLocaleString()}</span>
                ),
            },
            {
                key: 'ratio',
                title: 'PV/UV比值',
                dataIndex: 'ratio',
                render: (_: any, record: TableRowData) => {
                    const ratio = (record.pv as number) / (record.uv as number);
                    return <span className="text-gray-600">{ratio.toFixed(2)}</span>;
                },
            },
            {
                key: 'breakdown',
                title: '入口分解',
                dataIndex: 'hasBreakdown',
                align: 'center' as const,
                render: (hasBreakdown: boolean, record: TableRowData) => {
                    if (!hasBreakdown) {
                        return (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                无分解数据
                            </span>
                        );
                    }

                    const breakdownData = record.breakdownData as any;
                    const entries = Object.entries(breakdownData);

                    return (
                        <div className="space-y-1">
                            {entries.map(([key, value]: [string, any]) => (
                                <div key={key} className="text-xs text-gray-600">
                                    <span className="font-medium">{key}:</span>
                                    <span className="ml-1 text-blue-600">
                                        {value.pv.toLocaleString()}
                                    </span>
                                    <span className="mx-1 text-gray-400">/</span>
                                    <span className="text-green-600">
                                        {value.uv.toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    );
                },
            },
        ],

        [],
    );

    // 数据安全检查
    if (!data || !data.total || !data.daily_data || !Array.isArray(data.daily_data)) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-gray-600">加载PV/UV数据...</span>
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
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <svg
                                className="w-6 h-6 text-blue-600"
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
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">PV/UV 数据分析</h2>
                            <p className="text-sm text-gray-500">页面访问量和独立访客数据统计</p>
                        </div>
                    </div>
                </div>

                {/* 总览指标卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <MetricCard
                        title="总PV"
                        value={data.total.total_pv}
                        color="blue"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />

                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                            </svg>
                        }
                    />

                    <MetricCard
                        title="总UV"
                        value={data.total.total_uv}
                        color="green"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                                />
                            </svg>
                        }
                    />

                    <MetricCard
                        title="平均PV/UV"
                        value={(data.total.total_pv / data.total.total_uv).toFixed(2)}
                        color="purple"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                />
                            </svg>
                        }
                    />

                    <MetricCard
                        title="日均PV"
                        value={Math.round(data.total.total_pv / data.daily_data.length)}
                        color="orange"
                        icon={
                            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                            </svg>
                        }
                    />
                </div>
            </div>

            {/* 趋势图表 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">PV/UV 趋势分析</h3>
                    <div className="flex items-center space-x-4 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span className="text-gray-600">PV</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            <span className="text-gray-600">UV</span>
                        </div>
                    </div>
                </div>

                {/* 折线图 - 趋势展示 */}
                <div className="mb-8">
                    <div className="flex items-center space-x-2 mb-4">
                        <svg
                            className="w-5 h-5 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                            />
                        </svg>
                        <h4 className="text-base font-medium text-gray-900">趋势变化图</h4>
                        <span className="text-sm text-gray-500">（更清晰地展示变化趋势）</span>
                    </div>
                    <LineChart
                        data={chartData}
                        xAxisKey="name"
                        lines={[
                            {
                                dataKey: 'PV',
                                name: 'PV',
                                color: '#3B82F6',
                                strokeWidth: 3,
                            },
                            {
                                dataKey: 'UV',
                                name: 'UV',
                                color: '#10B981',
                                strokeWidth: 3,
                            },
                        ]}
                        height={300}
                        showLegend={true}
                        showGrid={true}
                        xAxisLabel="日期"
                        yAxisLabel="访问量"
                    />
                </div>

                {/* 柱状图 - 数量对比 */}
                <div>
                    <div className="flex items-center space-x-2 mb-4">
                        <svg
                            className="w-5 h-5 text-orange-600"
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
                        <h4 className="text-base font-medium text-gray-900">数量对比图</h4>
                        <span className="text-sm text-gray-500">（便于比较每日具体数量）</span>
                    </div>
                    <BarChart
                        data={chartData}
                        xAxisKey="name"
                        bars={[
                            {
                                dataKey: 'PV',
                                name: 'PV',
                                color: '#3B82F6',
                            },
                            {
                                dataKey: 'UV',
                                name: 'UV',
                                color: '#10B981',
                            },
                        ]}
                        height={320}
                        showLegend={true}
                        showGrid={true}
                        xAxisLabel="日期"
                        yAxisLabel="访问量"
                    />
                </div>
            </div>

            {/* 详细数据表格 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-gray-900">每日明细数据</h3>
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
                        <span>点击列标题进行排序</span>
                    </div>
                </div>

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
        </div>
    );
}
