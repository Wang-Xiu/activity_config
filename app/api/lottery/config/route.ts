import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';

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
                        title: '恭喜中奖',
                        content: '恭喜您在幸运抽奖中获得{prize}',
                        button_text: '查看奖品',
                    },
                },
                lottery_config: {
                    daily_free_times: 3,
                    cost_per_draw: 100,
                    prize_pool: [
                        { id: 1, name: '钻石x100', probability: 30, stock: 1000 },
                        { id: 2, name: '金币x1000', probability: 40, stock: 2000 },
                        { id: 3, name: '限定头像框', probability: 10, stock: 100 },
                        { id: 4, name: '幸运礼包', probability: 20, stock: 500 },
                    ],
                },
                display_config: {
                    background_color: '#FFD700',
                    button_color: '#FF4500',
                    animation_type: 'rotate',
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