import { NextRequest, NextResponse } from 'next/server';
import { defaultConfig } from '../../../../config/defaultConfig';
import { buildApiUrl } from '../../../../config/environment';
import { callInternalApi } from '../../../../utils/internalApiClient';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
    try {
        // 获取查询参数
        const { searchParams } = new URL(request.url);
        const activityId = searchParams.get('activity_id');
        
        console.log('年中活动配置API调用，activity_id:', activityId);
        
        // 调用后端API获取年中活动配置
        const apiUrl = buildApiUrl('getConfigByMidyear');
        console.log('正在调用年中活动配置API:', apiUrl);

        const backendResponse = await callInternalApi(apiUrl, {
            method: 'POST', // 年中活动使用通用配置接口，需要POST
            body: {
                act_id: 'midyear' // 年中活动的活动ID
            },
        });

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();
        console.log('年中活动配置API响应:', result);
        
        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== 0) {
            throw new Error(result.msg || '获取配置失败');
        }
        
        // 返回配置数据，包含版本管理信息
        return NextResponse.json({
            success: true,
            message: '年中活动配置获取成功',
            data: {
                ...result.data,
                // 添加版本管理字段
                version: result.data?.version || '1',
                update_time: result.data?.update_time || null,
                operator: result.data?.operator || null
            },
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('获取年中活动配置时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '获取年中活动配置失败',
                error: error instanceof Error ? error.message : '未知错误',
                data: defaultConfig, // 失败时返回默认配置
            },
            { status: 500 },
        );
    }
}