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
                        title: '任务完成',
                        content: '恭喜您完成任务【{task_name}】，获得{reward}',
                        button_text: '领取奖励',
                    },
                },
                task_config: {
                    daily_tasks: [
                        {
                            id: 1,
                            name: '观看直播30分钟',
                            type: 'watch_live',
                            target: 1800,
                            rewards: ['金币x100', '经验x50'],
                            priority: 1,
                        },
                        {
                            id: 2,
                            name: '送出3个礼物',
                            type: 'send_gift',
                            target: 3,
                            rewards: ['金币x200', '经验x100'],
                            priority: 2,
                        },
                        {
                            id: 3,
                            name: '分享直播间',
                            type: 'share_room',
                            target: 1,
                            rewards: ['金币x50', '经验x30'],
                            priority: 3,
                        },
                    ],
                    weekly_tasks: [
                        {
                            id: 101,
                            name: '累计观看直播5小时',
                            type: 'watch_live',
                            target: 18000,
                            rewards: ['钻石x50', '经验x500'],
                            priority: 1,
                        },
                        {
                            id: 102,
                            name: '累计送出礼物价值1000金币',
                            type: 'send_gift_value',
                            target: 1000,
                            rewards: ['钻石x100', '经验x1000'],
                            priority: 2,
                        },
                    ],
                    achievement_tasks: [
                        {
                            id: 201,
                            name: '首次充值',
                            type: 'first_recharge',
                            rewards: ['限定头像框', '专属称号'],
                            priority: 1,
                        },
                        {
                            id: 202,
                            name: '关注100个主播',
                            type: 'follow_anchor',
                            target: 100,
                            rewards: ['座驾体验卡', '专属徽章'],
                            priority: 2,
                        },
                    ],
                },
                display_config: {
                    theme_color: '#4A90E2',
                    background_image: '/images/task-bg.jpg',
                    show_progress: true,
                },
                reward_config: {
                    auto_claim: true,
                    expire_hours: 24,
                    reminder_threshold: 0.9,
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