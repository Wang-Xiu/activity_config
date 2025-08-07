'use client';

import { useMemo } from 'react';
import { SummaryData, TableRowData } from '../../types/monitor-dashboard';
import MetricCard from './shared/MetricCard';
import DataTable from './shared/DataTable';

interface SummarySectionProps {
    data: SummaryData;
}

export default function SummarySection({ data }: SummarySectionProps) {
    // 准备额外指标表格数据
    const additionalMetricsTableData: TableRowData[] = useMemo(() => {
        if (!data || !data.additional_metrics || !Array.isArray(data.additional_metrics)) {
            return [];
        }
        return data.additional_metrics.map((metric, index) => ({
            key: `metric-${index}`,
            metric_name: metric.metric_name,
            metric_value: metric.metric_value,
            metric_unit: metric.metric_unit,
            formatted_value: `${metric.metric_value.toLocaleString()} ${metric.metric_unit}`,
        }));
    }, [data]);

    // 核心指标数据
    const coreMetrics = useMemo(() => {
        if (!data || !data.period_total) {
            return [];
        }

        return [
            {
                title: '总消耗',
                value: data.period_total.total_consumption,
                color: 'red' as const,
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                        />
                    </svg>
                ),
            },
            {
                title: '总产出',
                value: data.period_total.total_production,
                color: 'green' as const,
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                    </svg>
                ),
            },
            {
                title: '总体投入产出比',
                value: (data.period_total.overall_ratio * 100).toFixed(1),
                unit: '%',
                color: 'purple' as const,
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                    </svg>
                ),
            },
            {
                title: '总参与人数',
                value: data.period_total.total_participants,
                color: 'blue' as const,
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                        />
                    </svg>
                ),
            },
            {
                title: '总参与次数',
                value: data.period_total.total_participation_times,
                color: 'orange' as const,
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                        />
                    </svg>
                ),
            },
            {
                title: '日均参与人数',
                value: data.period_total.avg_daily_participants,
                color: 'green' as const,
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                ),
            },
            {
                title: '日均参与次数',
                value: data.period_total.avg_daily_times,
                color: 'purple' as const,
                icon: (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                        />
                    </svg>
                ),
            },
        ];
    }, [data]);

    // 额外指标表格列定义
    const additionalMetricsColumns = useMemo(
        () => [
            {
                key: 'metric_name',
                title: '指标名称',
                dataIndex: 'metric_name',
                width: 200,
                render: (value: string) => (
                    <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span className="font-medium text-gray-900">{value}</span>
                    </div>
                ),
            },
            {
                key: 'metric_value',
                title: '数值',
                dataIndex: 'metric_value',
                align: 'right' as const,
                render: (value: number, record: TableRowData) => (
                    <div className="text-right">
                        <span className="text-2xl font-bold text-purple-600">
                            {typeof value === 'number' && value >= 1000
                                ? value.toLocaleString()
                                : value}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">{record.metric_unit}</span>
                    </div>
                ),
            },
            {
                key: 'description',
                title: '说明',
                dataIndex: 'description',
                render: (_: any, record: TableRowData) => {
                    // 根据指标名称提供说明
                    const descriptions: { [key: string]: string } = {
                        特殊奖励发放: '活动期间发放的特殊奖励总数量',
                        用户留存率: '参与活动后继续使用产品的用户比例',
                        平均单次消耗: '用户每次参与活动的平均消耗金额',
                        新用户占比: '首次参与活动的新用户占总参与用户的比例',
                    };

                    return (
                        <span className="text-sm text-gray-600">
                            {descriptions[record.metric_name as string] || '无说明'}
                        </span>
                    );
                },
            },
        ],

        [],
    );

    // 数据安全检查
    if (!data || !data.period_total) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
                    <span className="ml-3 text-gray-600">加载活动总体数据...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* 标题 */}
            <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <svg
                            className="w-6 h-6 text-purple-600"
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
                        <h2 className="text-xl font-bold text-gray-900">活动总体数据汇总</h2>
                        <p className="text-sm text-gray-500">活动期间的总体统计数据和关键指标</p>
                    </div>
                </div>

                {/* 核心指标网格 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {coreMetrics.map((metric, index) => (
                        <MetricCard
                            key={index}
                            title={metric.title}
                            value={metric.value}
                            unit={metric.unit}
                            color={metric.color}
                            icon={metric.icon}
                            size="md"
                        />
                    ))}
                </div>
            </div>

            {/* 关键数据亮点 */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg shadow border border-purple-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <svg
                        className="w-5 h-5 text-purple-600 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                    </svg>
                    关键数据亮点
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* 投入产出效率 */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">投入产出效率</h4>
                            <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                    data.period_total.overall_ratio >= 1.3 &&
                                    data.period_total.overall_ratio <= 1.7
                                        ? 'bg-green-100 text-green-800'
                                        : data.period_total.overall_ratio < 1.3
                                          ? 'bg-red-100 text-red-800'
                                          : 'bg-orange-100 text-orange-800'
                                }`}
                            >
                                {data.period_total.overall_ratio >= 1.3 &&
                                data.period_total.overall_ratio <= 1.7
                                    ? '产出良好'
                                    : data.period_total.overall_ratio < 1.3
                                      ? '产出偏低'
                                      : '产出较高'}
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {data.period_total.overall_ratio.toFixed(2)}
                        </div>
                        <p className="text-sm text-gray-600">投入产出比（建议区间：1.3-1.7）</p>
                    </div>

                    {/* 用户参与度 */}
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-gray-900">用户参与度</h4>
                            <div className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                活跃
                            </div>
                        </div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">
                            {(
                                data.period_total.total_participation_times /
                                data.period_total.total_participants
                            ).toFixed(1)}
                        </div>
                        <p className="text-sm text-gray-600">平均每用户参与次数</p>
                    </div>
                </div>
            </div>

            {/* 其他关键指标表格 */}
            {data.additional_metrics && data.additional_metrics.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">其他关键指标</h3>
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
                                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                                />
                            </svg>
                            <span>活动期间的补充统计数据</span>
                        </div>
                    </div>

                    <DataTable
                        columns={additionalMetricsColumns}
                        data={additionalMetricsTableData}
                        pagination={false}
                        striped={true}
                        hover={true}
                        size="lg"
                    />
                </div>
            )}
        </div>
    );
}
