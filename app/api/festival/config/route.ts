import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        // 返回模拟数据
        return NextResponse.json({
            success: true,
            message: '配置获取成功',
            data: {
                send_msg_config: {
                    send_msg: 1,
                    msg_content: {
                        title: '节日快乐',
                        content: '祝您节日快乐！您收到了{gift}',
                        button_text: '查看礼物',
                    },
                },
                festival_config: {
                    current_festival: {
                        name: '春节',
                        start_time: '2024-02-10T00:00:00Z',
                        end_time: '2024-02-24T23:59:59Z',
                        theme: 'chinese_new_year',
                    },
                    activities: [
                        {
                            id: 1,
                            name: '年夜饭派对',
                            type: 'live_party',
                            schedule: '2024-02-09T19:00:00Z',
                            rewards: ['限定红包封面', '新春头像框'],
                        },
                        {
                            id: 2,
                            name: '春节签到',
                            type: 'daily_check',
                            duration_days: 15,
                            rewards: [
                                { day: 1, items: ['金币x888', '福气红包'] },
                                { day: 7, items: ['钻石x88', '春节限定装扮'] },
                                { day: 15, items: ['新春特效', '专属头像框'] },
                            ],
                        },
                        {
                            id: 3,
                            name: '送祝福',
                            type: 'send_blessing',
                            rewards_per_action: ['福气值x10', '抽奖券x1'],
                            special_rewards: {
                                threshold: 100,
                                items: ['新春特效', '专属座驾'],
                            },
                        },
                    ],
                    special_effects: {
                        room_effects: ['飘落红包', '福字特效', '烟花效果'],
                        gift_effects: ['新春礼盒', '福袋', '金元宝'],
                        background_music: '/audio/festival/spring_festival.mp3',
                    },
                },
                display_config: {
                    theme_color: '#FF4D4F',
                    background_image: '/images/festival/spring_festival_bg.jpg',
                    animation_effects: ['lantern_swing', 'fireworks'],
                },
                reward_rules: {
                    daily_limit: 1000,
                    share_bonus: true,
                    friend_invite_reward: {
                        inviter_reward: ['钻石x50', '福气值x100'],
                        invitee_reward: ['新人红包', '限定头像框'],
                    },
                },
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取配置时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取配置失败',
                error: error instanceof Error ? error.message : '未知错误',
            },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const data = await request.json();
        
        // 模拟保存成功
        return NextResponse.json({
            success: true,
            message: '配置保存成功',
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('保存配置时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '保存配置失败',
                error: error instanceof Error ? error.message : '未知错误',
            },
            { status: 500 },
        );
    }
}