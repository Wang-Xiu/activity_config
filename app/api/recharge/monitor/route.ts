import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // 获取查询参数
        const { searchParams } = new URL(request.url);
        const dateType = searchParams.get('dateType') || 'daily';
        const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

        // 返回模拟数据
        return NextResponse.json({
            success: true,
            message: '监控数据获取成功（模拟数据）',
            data: {
                recharge_overview: {
                    total_amount: dateType === 'daily' ? 128500 : 3598000,
                    total_orders: dateType === 'daily' ? 2850 : 79800,
                    unique_users: dateType === 'daily' ? 1950 : 54600,
                    average_amount: dateType === 'daily' ? 45.09 : 45.09,
                },
                tier_distribution: {
                    tier_100: {
                        orders: dateType === 'daily' ? 1425 : 39900,
                        amount: dateType === 'daily' ? 142500 : 3990000,
                        users: dateType === 'daily' ? 1140 : 31920,
                    },
                    tier_500: {
                        orders: dateType === 'daily' ? 855 : 23940,
                        amount: dateType === 'daily' ? 427500 : 11970000,
                        users: dateType === 'daily' ? 684 : 19152,
                    },
                    tier_1000: {
                        orders: dateType === 'daily' ? 428 : 11984,
                        amount: dateType === 'daily' ? 428000 : 11984000,
                        users: dateType === 'daily' ? 342 : 9576,
                    },
                    tier_5000: {
                        orders: dateType === 'daily' ? 142 : 3976,
                        amount: dateType === 'daily' ? 710000 : 19880000,
                        users: dateType === 'daily' ? 114 : 3192,
                    },
                },
                bonus_statistics: {
                    total_bonus: dateType === 'daily' ? 25700 : 719600,
                    bonus_rate_avg: 20,
                    extra_items_claimed: dateType === 'daily' ? 5700 : 159600,
                },
                first_recharge: {
                    total_users: dateType === 'daily' ? 285 : 7980,
                    average_amount: dateType === 'daily' ? 350 : 350,
                    conversion_rate: 15.5,
                },
                payment_methods: {
                    alipay: dateType === 'daily' ? 1425 : 39900,
                    wechat: dateType === 'daily' ? 1140 : 31920,
                    card: dateType === 'daily' ? 285 : 7980,
                },
                time_distribution: {
                    peak_hours: [
                        { hour: 12, amount: dateType === 'daily' ? 32125 : 899500 },
                        { hour: 20, amount: dateType === 'daily' ? 38550 : 1079400 },
                        { hour: 22, amount: dateType === 'daily' ? 25700 : 719600 },
                    ],
                    weekend_boost: 1.35,
                },
                promotion_impact: {
                    holiday_bonus_claimed: dateType === 'daily' ? 570 : 15960,
                    promotion_conversion_rate: 28.5,
                    average_bonus_amount: dateType === 'daily' ? 45 : 45,
                },
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取监控数据时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取监控数据失败',
                error: error instanceof Error ? error.message : '未知错误',
            },
            { status: 500 },
        );
    }
}