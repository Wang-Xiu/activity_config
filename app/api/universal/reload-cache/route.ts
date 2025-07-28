import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取活动ID
        const body = await request.json();
        const { activityId } = body;
        
        if (!activityId) {
            return NextResponse.json(
                {
                    success: false,
                    message: '活动ID不能为空',
                },
                { status: 400 }
            );
        }

        // 构建API URL
        const apiUrl = buildApiUrl('reloadCache');
        
        // 准备POST数据
        const postData = {
            act_id: activityId
        };
        
        console.log('正在调用更新缓存API:', apiUrl);
        console.log('POST参数:', postData);

        const backendResponse = await fetch(apiUrl, {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
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
                message: result.msg || result.message || `更新缓存失败，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
            });
        }

        console.log('缓存更新成功:', result);
        
        // 返回成功响应
        return NextResponse.json({
            success: true,
            message: `活动ID ${activityId} 的缓存更新成功`,
            data: result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('更新缓存时出错:', error);
        return NextResponse.json(
            {
                success: false,
                message: '更新缓存失败',
                error: error instanceof Error ? error.message : '未知错误',
            },
            { status: 500 },
        );
    }
}