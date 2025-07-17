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
                        title: '签到成功',
                        content: '恭喜您完成今日签到，获得{reward}',
                        button_text: '查看奖励',
                    },
                },
                signin_config: {
                    daily_rewards: [
                        { day: 1, reward: '金币x100', icon: '🪙' },
                        { day: 2, reward: '钻石x10', icon: '💎' },
                        { day: 3, reward: '经验卡x1', icon: '📈' },
                        { day: 4, reward: '金币x200', icon: '🪙' },
                        { day: 5, reward: '钻石x20', icon: '💎' },
                        { day: 6, reward: '经验卡x2', icon: '📈' },
                        { day: 7, reward: '限定头像框', icon: '🖼️' },
                    ],
                    extra_rewards: {
                        vip_multiplier: 2,
                        consecutive_bonus: true,
                        share_bonus: 50,
                    },
                },
                display_config: {
                    background_image: '/images/signin-bg.jpg',
                    theme_color: '#4CAF50',
                    animation_effect: 'bounce',
                },
                reminder_config: {
                    enable_reminder: true,
                    reminder_time: '20:00',
                    reminder_message: '别忘了今日签到哦～',
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