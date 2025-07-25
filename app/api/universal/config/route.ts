import { NextRequest, NextResponse } from 'next/server';
import { universalDefaultConfig } from '../../../../config/universalDefaultConfig';
import { buildApiUrl } from '../../../../config/environment';

export async function GET(request: NextRequest) {
    try {
        // 从URL参数中获取活动ID
        const { searchParams } = new URL(request.url);
        const activityId = searchParams.get('activityId');
        
        // 构建API URL，如果有活动ID则传递给后端
        let apiUrl = buildApiUrl('getConfigByMidyear');
        if (activityId) {
            // 假设后端API支持activityId参数
            apiUrl += `&act_id=${encodeURIComponent(activityId)}`;
        } else {
            apiUrl += `&act_id=264`;
        }
        
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
        console.log('从后端获取的原始配置:', result.data);
        // 返回配置数据
        return NextResponse.json({
            success: true,
            message: activityId ? `活动ID ${activityId} 的配置获取成功` : '配置获取成功',
            data: result.data || universalDefaultConfig,
            activityId: activityId,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取配置时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取配置失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: universalDefaultConfig, // 失败时返回默认配置
            },
            { status: 500 },
        );
    }
}