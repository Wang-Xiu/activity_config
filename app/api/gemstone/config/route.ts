import { NextRequest, NextResponse } from 'next/server';
import { defaultConfig } from '../../../../config/defaultConfig';
import { buildApiUrl } from '../../../../config/environment';

export async function GET(request: NextRequest) {
    try {
        // 调用后端API获取配置
        const apiUrl = buildApiUrl('getConfig');
        console.log('正在调用API:', apiUrl);

        const backendResponse = await fetch(apiUrl, {
            method: 'GET',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();
        
        // 检查后端返回的数据格式
        if (!result.success) {
            throw new Error(result.message || '后端返回错误');
        }

        // 返回配置数据
        return NextResponse.json({
            success: true,
            message: '配置获取成功',
            data: result.data || defaultConfig,
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