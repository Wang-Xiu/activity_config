'use client';

import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { ChartDataPoint } from '../../../types/monitor-dashboard';

interface LineChartProps {
    data: ChartDataPoint[];
    xAxisKey: string;
    lines: {
        dataKey: string;
        name: string;
        color: string;
        strokeWidth?: number;
        dot?: boolean;
    }[];
    height?: number;
    showLegend?: boolean;
    showGrid?: boolean;
    yAxisLabel?: string;
    xAxisLabel?: string;
    loading?: boolean;
}

export default function LineChart({
    data,
    xAxisKey,
    lines,
    height = 400,
    showLegend = true,
    showGrid = true,
    yAxisLabel,
    xAxisLabel,
    loading = false,
}: LineChartProps) {
    if (loading) {
        return (
            <div
                className="bg-gray-100 rounded-lg flex items-center justify-center animate-pulse"
                style={{ height }}
            >
                <div className="text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mx-auto"></div>
                </div>
            </div>
        );
    }

    // 自定义工具提示
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                    <p className="font-medium text-gray-900 mb-2">
                        {xAxisLabel ? `${xAxisLabel}: ` : ''}
                        {label}
                    </p>
                    {payload.map((entry: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            ></div>
                            <span className="text-gray-600">{entry.name}:</span>
                            <span className="font-medium text-gray-900">
                                {typeof entry.value === 'number'
                                    ? entry.value.toLocaleString()
                                    : entry.value}
                            </span>
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={height}>
                <RechartsLineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    {showGrid && (
                        <CartesianGrid
                            strokeDasharray="3 3"
                            stroke="#f0f0f0"
                            horizontal={true}
                            vertical={false}
                        />
                    )}
                    <XAxis
                        dataKey={xAxisKey}
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        interval={0}
                        angle={data.length > 7 ? -45 : 0}
                        textAnchor={data.length > 7 ? 'end' : 'middle'}
                        height={data.length > 7 ? 80 : 60}
                    />

                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6b7280' }}
                        tickFormatter={(value) => {
                            if (value >= 10000) {
                                return `${(value / 10000).toFixed(1)}万`;
                            }
                            return value.toLocaleString();
                        }}
                    />

                    <Tooltip content={<CustomTooltip />} />
                    {showLegend && (
                        <Legend
                            iconType="line"
                            wrapperStyle={{
                                paddingTop: '20px',
                                fontSize: '14px',
                            }}
                        />
                    )}
                    {lines.map((line, index) => (
                        <Line
                            key={line.dataKey}
                            type="monotone"
                            dataKey={line.dataKey}
                            name={line.name}
                            stroke={line.color}
                            strokeWidth={line.strokeWidth || 3}
                            dot={
                                line.dot !== false
                                    ? {
                                          fill: line.color,
                                          strokeWidth: 2,
                                          r: 4,
                                      }
                                    : false
                            }
                            activeDot={{
                                r: 6,
                                fill: line.color,
                                stroke: '#fff',
                                strokeWidth: 2,
                            }}
                            animationDuration={1000}
                            animationEasing="ease-out"
                        />
                    ))}
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}
