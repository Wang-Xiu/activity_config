import { NextRequest, NextResponse } from 'next/server';
import { defaultConfig } from '../../../../config/defaultConfig';

export async function GET(request: NextRequest) {
    try {
        // 在这里添加你的实际获取逻辑
        // 例如：从数据库、文件系统或其他API获取配置

        // 模拟获取过程
        await new Promise((resolve) => setTimeout(resolve, 300));

        // 这里可以调用你的后端API获取配置
        const backendUrl = 'https://testmqgitfrontend.meequ.cn/index.php?r=activity/gemstone/setting&debug=1&password=!!!!&uid=100056&auth=1&actId=261';
        const backendResponse = await fetch(backendUrl, {
            method: 'GET',
            // PHP接口一般不需要 application/json 头部，除非后端要求
        });
        const configData = await backendResponse.json();

        return NextResponse.json({
            success: true,
            message: '配置获取成功',
            data: configData,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取配置时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取配置失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: defaultConfig, // 失败时返回默认配置
            },
            { status: 500 },
        );
    }
}
