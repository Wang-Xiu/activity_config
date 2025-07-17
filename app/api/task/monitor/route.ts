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
                task_completion: {
                    daily_tasks: {
                        watch_live: {
                            attempts: dateType === 'daily' ? 12500 : 350000,
                            completions: dateType === 'daily' ? 8750 : 245000,
                            completion_rate: 70,
                        },
                        send_gift: {
                            attempts: dateType === 'daily' ? 9500 : 266000,
                            completions: dateType === 'daily' ? 5700 : 159600,
                            completion_rate: 60,
                        },
                        share_room: {
                            attempts: dateType === 'daily' ? 15000 : 420000,
                            completions: dateType === 'daily' ? 12000 : 336000,
                            completion_rate: 80,
                        },
                    },
                    weekly_tasks: {
                        watch_live_long: {
                            attempts: dateType === 'daily' ? 8500 : 238000,
                            completions: dateType === 'daily' ? 4250 : 119000,
                            completion_rate: 50,
                        },
                        send_gift_value: {
                            attempts: dateType === 'daily' ? 6800 : 190400,
                            completions: dateType === 'daily' ? 2720 : 76160,
                            completion_rate: 40,
                        },
                    },
                    achievements: {
                        first_recharge: {
                            total_completed: dateType === 'daily' ? 850 : 23800,
                            completion_rate: 15,
                        },
                        follow_anchor: {
                            total_completed: dateType === 'daily' ? 425 : 11900,
                            completion_rate: 8,
                        },
                    },
                },
                reward_distribution: {
                    coins: {
                        amount: dateType === 'daily' ? 1250000 : 35000000,
                        recipients: dateType === 'daily' ? 8500 : 238000,
                    },
                    diamonds: {
                        amount: dateType === 'daily' ? 25000 : 700000,
                        recipients: dateType === 'daily' ? 2500 : 70000,
                    },
                    experience: {
                        amount: dateType === 'daily' ? 500000 : 14000000,
                        recipients: dateType === 'daily' ? 10000 : 280000,
                    },
                    special_items: {
                        avatar_frames: dateType === 'daily' ? 850 : 23800,
                        titles: dateType === 'daily' ? 425 : 11900,
                        vehicle_cards: dateType === 'daily' ? 170 : 4760,
                    },
                },
                user_engagement: {
                    active_users: dateType === 'daily' ? 25000 : 700000,
                    task_participants: dateType === 'daily' ? 15000 : 420000,
                    average_tasks_per_user: dateType === 'daily' ? 2.8 : 19.6,
                    retention_rate: 65.5,
                },
                time_analysis: {
                    peak_hours: [
                        { hour: 12, participants: dateType === 'daily' ? 3000 : 84000 },
                        { hour: 20, participants: dateType === 'daily' ? 4500 : 126000 },
                        { hour: 22, participants: dateType === 'daily' ? 3750 : 105000 },
                    ],
                    average_completion_time: {
                        watch_live: 45, // minutes
                        send_gift: 15,
                        share_room: 5,
                    },
                },
                system_metrics: {
                    success_rate: 99.8,
                    average_response_time: 180, // ms
                    error_count: dateType === 'daily' ? 25 : 700,
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