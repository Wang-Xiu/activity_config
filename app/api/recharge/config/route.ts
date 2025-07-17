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
                        title: '充值奖励',
                        content: '感谢您的充值，您获得了{bonus}奖励',
                        button_text: '查看详情',
                    },
                },
                recharge_config: {
                    tiers: [
                        { amount: 100, bonus_rate: 10, extra_items: ['经验卡x1'] },
                        { amount: 500, bonus_rate: 15, extra_items: ['经验卡x5', '限定头像框'] },
                        { amount: 1000, bonus_rate: 20, extra_items: ['经验卡x10', '限定头像框', '专属称号'] },
                        { amount: 5000, bonus_rate: 25, extra_items: ['经验卡x50', '限定头像框', '专属称号', '座驾'] },
                    ],
                    first_recharge: {
                        enabled: true,
                        bonus_rate: 50,
                        extra_items: ['限定皮肤', '专属称号', '座驾'],
                    },
                    daily_limits: {
                        max_bonus_amount: 10000,
                        reset_time: '00:00',
                    },
                },
                display_config: {
                    theme_color: '#FF6B6B',
                    background_image: '/images/recharge-bg.jpg',
                    show_countdown: true,
                },
                promotion_config: {
                    start_time: '2024-01-01T00:00:00Z',
                    end_time: '2024-02-01T00:00:00Z',
                    holiday_bonus: {
                        enabled: true,
                        bonus_rate: 5,
                        applicable_days: ['Saturday', 'Sunday'],
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