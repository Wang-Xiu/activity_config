'use client';

import { SecurityStatistics } from '../../types/security-logs';

interface StatisticsCardsProps {
    statistics: SecurityStatistics | null;
    loading: boolean;
}

export default function StatisticsCards({ statistics, loading }: StatisticsCardsProps) {
    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                {[...Array(4)].map((_, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!statistics) {
        return null;
    }

    const cards = [
        {
            title: '恶意请求数',
            value: statistics.malicious_requests,
            icon: '🚨',
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200',
            description: '检测到的恶意请求总数'
        },
        {
            title: '攻击IP数量',
            value: statistics.unique_attack_ips,
            icon: '🌐',
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
            borderColor: 'border-orange-200',
            description: '发起攻击的唯一IP地址'
        },
        {
            title: '今日攻击',
            value: statistics.today_attacks,
            icon: '📈',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200',
            description: '今天新增的攻击请求',
            trend: statistics.attack_trends?.growth_rate || 0
        },
        {
            title: '高危攻击',
            value: statistics.high_risk_attacks,
            icon: '⚠️',
            color: 'text-red-700',
            bgColor: 'bg-red-100',
            borderColor: 'border-red-300',
            description: '威胁等级为高危的攻击'
        }
    ];

    const formatNumber = (num: number) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toLocaleString();
    };

    const formatTrend = (trend: number) => {
        if (trend === 0) return null;
        const isPositive = trend > 0;
        return (
            <div className={`flex items-center text-xs ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
                <span className="mr-1">
                    {isPositive ? '↗️' : '↘️'}
                </span>
                <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {cards.map((card, index) => (
                <div
                    key={index}
                    className={`bg-white rounded-lg shadow border-l-4 ${card.borderColor} p-6 hover:shadow-md transition-shadow`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex-1">
                            <div className="flex items-center mb-2">
                                <span className="text-2xl mr-2">{card.icon}</span>
                                <h3 className="text-sm font-medium text-gray-600">
                                    {card.title}
                                </h3>
                            </div>
                            <div className="flex items-baseline">
                                <p className={`text-2xl font-bold ${card.color}`}>
                                    {formatNumber(card.value)}
                                </p>
                                {card.trend !== undefined && (
                                    <div className="ml-2">
                                        {formatTrend(card.trend)}
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {card.description}
                            </p>
                        </div>
                        <div className={`w-12 h-12 ${card.bgColor} rounded-full flex items-center justify-center`}>
                            <span className="text-xl">{card.icon}</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
