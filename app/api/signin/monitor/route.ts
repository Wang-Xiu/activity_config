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
                signin_stats: {
                    total_signins: dateType === 'daily' ? 8500 : 238000,
                    unique_users: dateType === 'daily' ? 8500 : 42000,
                    consecutive_signins: dateType === 'daily' ? 6200 : 28000,
                    missed_signins: dateType === 'daily' ? 850 : 3800,
                },
                reward_distribution: {
                    coins: {
                        amount: dateType === 'daily' ? 850000 : 23800000,
                        users: dateType === 'daily' ? 4250 : 119000,
                    },
                    diamonds: {
                        amount: dateType === 'daily' ? 85000 : 2380000,
                        users: dateType === 'daily' ? 2800 : 78400,
                    },
                    exp_cards: {
                        amount: dateType === 'daily' ? 4250 : 119000,
                        users: dateType === 'daily' ? 1400 : 39200,
                    },
                    avatar_frames: {
                        amount: dateType === 'daily' ? 1200 : 33600,
                        users: dateType === 'daily' ? 1200 : 33600,
                    },
                },
                user_behavior: {
                    signin_time_distribution: [
                        { hour: 6, count: dateType === 'daily' ? 850 : 23800 },
                        { hour: 12, count: dateType === 'daily' ? 2550 : 71400 },
                        { hour: 18, count: dateType === 'daily' ? 3400 : 95200 },
                        { hour: 22, count: dateType === 'daily' ? 1700 : 47600 },
                    ],
                    platform_distribution: {
                        ios: dateType === 'daily' ? 3400 : 95200,
                        android: dateType === 'daily' ? 4250 : 119000,
                        web: dateType === 'daily' ? 850 : 23800,
                    },
                },
                vip_stats: {
                    vip_signins: dateType === 'daily' ? 2550 : 71400,
                    bonus_rewards_claimed: dateType === 'daily' ? 2040 : 57120,
                    average_bonus_multiplier: 1.8,
                },
                reminder_stats: {
                    reminders_sent: dateType === 'daily' ? 2000 : 56000,
                    reminder_success_rate: 85.5,
                    post_reminder_signins: dateType === 'daily' ? 1700 : 47600,
                },
                system_performance: {
                    average_response_time: 120, // ms
                    error_rate: 0.05,
                    peak_concurrent_users: dateType === 'daily' ? 1200 : 4800,
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