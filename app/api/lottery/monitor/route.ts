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
                participation: {
                    total_draws: dateType === 'daily' ? 5680 : 158900,
                    unique_users: dateType === 'daily' ? 1250 : 35000,
                    free_draws: dateType === 'daily' ? 3750 : 105000,
                    paid_draws: dateType === 'daily' ? 1930 : 53900,
                },
                prize_distribution: {
                    diamond_100: {
                        awarded: dateType === 'daily' ? 450 : 12600,
                        claimed: dateType === 'daily' ? 420 : 11800,
                    },
                    coins_1000: {
                        awarded: dateType === 'daily' ? 680 : 19000,
                        claimed: dateType === 'daily' ? 650 : 18200,
                    },
                    avatar_frame: {
                        awarded: dateType === 'daily' ? 85 : 2380,
                        claimed: dateType === 'daily' ? 82 : 2290,
                    },
                    lucky_bag: {
                        awarded: dateType === 'daily' ? 340 : 9500,
                        claimed: dateType === 'daily' ? 320 : 8950,
                    },
                },
                revenue: {
                    total_income: dateType === 'daily' ? 19300 : 539000,
                    average_per_user: dateType === 'daily' ? 15.44 : 15.4,
                },
                user_behavior: {
                    return_rate: dateType === 'daily' ? 45.8 : 42.5,
                    average_draws: dateType === 'daily' ? 4.54 : 4.54,
                    peak_hours: [
                        { hour: 12, count: dateType === 'daily' ? 680 : 19040 },
                        { hour: 20, count: dateType === 'daily' ? 890 : 24920 },
                        { hour: 22, count: dateType === 'daily' ? 750 : 21000 },
                    ],
                },
                system_status: {
                    success_rate: 99.95,
                    average_response: 150, // ms
                    error_count: dateType === 'daily' ? 3 : 84,
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