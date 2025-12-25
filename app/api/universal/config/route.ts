import { NextRequest, NextResponse } from 'next/server';
import { universalDefaultConfig } from '../../../../config/universalDefaultConfig';
import { buildApiUrl } from '../../../../config/environment';
import { callInternalApi } from '../../../../utils/internalApiClient';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取活动ID
        const body = await request.json();
        const { activityId } = body;
        
        // 构建API URL，将活动ID作为POST参数传递
        const apiUrl = buildApiUrl('getConfigByMidyear');
        
        // 准备POST数据 - PHP后端通过 $this->thisRequest->post() 读取参数，需要使用表单格式
        const formData = new URLSearchParams();
        formData.append('act_id', activityId || '264');
        
        console.log('正在调用API:', apiUrl);
        console.log('POST参数 (act_id):', activityId || '264');

        const backendResponse = await callInternalApi(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();
        
        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== 0) {
            // 后端业务错误，返回具体错误信息，但HTTP状态码为200
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `请求失败，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
                data: universalDefaultConfig, // 失败时返回默认配置
            });
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