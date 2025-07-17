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
                overall_statistics: {
                    total_participants: dateType === 'daily' ? 35000 : 980000,
                    active_users: dateType === 'daily' ? 28000 : 784000,
                    new_users: dateType === 'daily' ? 5250 : 147000,
                    total_engagement_time: dateType === 'daily' ? 84000 : 2352000, // minutes
                },
                activity_performance: {
                    live_party: {
                        participants: dateType === 'daily' ? 15000 : 420000,
                        peak_concurrent: dateType === 'daily' ? 8500 : 238000,
                        gift_value: dateType === 'daily' ? 250000 : 7000000,
                        average_duration: 45, // minutes
                    },
                    daily_check: {
                        total_checks: dateType === 'daily' ? 24500 : 686000,
                        consecutive_checks: dateType === 'daily' ? 19600 : 548800,
                        completion_rate: 85.5,
                    },
                    send_blessing: {
                        total_blessings: dateType === 'daily' ? 105000 : 2940000,
                        unique_senders: dateType === 'daily' ? 21000 : 588000,
                        average_per_user: dateType === 'daily' ? 5 : 5,
                    },
                },
                reward_distribution: {
                    coins: {
                        total_amount: dateType === 'daily' ? 8880000 : 248640000,
                        recipients: dateType === 'daily' ? 17500 : 490000,
                    },
                    diamonds: {
                        total_amount: dateType === 'daily' ? 88000 : 2464000,
                        recipients: dateType === 'daily' ? 8750 : 245000,
                    },
                    special_items: {
                        red_packet_covers: dateType === 'daily' ? 3500 : 98000,
                        avatar_frames: dateType === 'daily' ? 2800 : 78400,
                        effects: dateType === 'daily' ? 1750 : 49000,
                        vehicles: dateType === 'daily' ? 700 : 19600,
                    },
                },
                user_engagement: {
                    platform_distribution: {
                        mobile: dateType === 'daily' ? 24500 : 686000,
                        pc: dateType === 'daily' ? 7000 : 196000,
                        tablet: dateType === 'daily' ? 3500 : 98000,
                    },
                    peak_hours: [
                        { hour: 10, users: dateType === 'daily' ? 8750 : 245000 },
                        { hour: 15, users: dateType === 'daily' ? 12250 : 343000 },
                        { hour: 20, users: dateType === 'daily' ? 17500 : 490000 },
                    ],
                    social_sharing: {
                        total_shares: dateType === 'daily' ? 14000 : 392000,
                        viral_coefficient: 2.3,
                    },
                },
                friend_invitation: {
                    total_invites: dateType === 'daily' ? 7000 : 196000,
                    successful_invites: dateType === 'daily' ? 3500 : 98000,
                    conversion_rate: 50,
                    rewards_distributed: {
                        inviters: dateType === 'daily' ? 3500 : 98000,
                        invitees: dateType === 'daily' ? 3500 : 98000,
                    },
                },
                system_performance: {
                    average_response_time: 150, // ms
                    error_rate: 0.02,
                    peak_load: dateType === 'daily' ? 1200 : 33600, // requests per minute
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