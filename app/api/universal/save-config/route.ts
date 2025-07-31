import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';

// 强制动态渲染
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取配置数据和活动ID
        const body = await request.json();
        const { activityId, actConfig, version, operator } = body;
        
        if (!activityId) {
            // return NextResponse.json(
            //     {
            //         success: false,
            //         message: '活动ID不能为空',
            //     },
            //     { status: 400 }
            // );
            return new Response(
                JSON.stringify({
                    success: false,
                    message: '活动ID不能为空',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        if (!actConfig) {
            return new Response(
                JSON.stringify({
                    success: false,
                    message: '配置数据不能为空',
                }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // 构建API URL
        const apiUrl = buildApiUrl('saveUniversalConfig');
        console.log('正在调用保存配置API:', apiUrl);
        console.log('保存的配置数据:', actConfig);

        // 准备POST数据，将活动ID和配置数据都放在POST body中
        const postData = {
            act_id: activityId,
            act_config: actConfig,
            version: version || '',
            operator: operator || 'unknown'
        };

        const backendResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            mode: 'cors',
            credentials: 'include',
            body: JSON.stringify(postData),
        } as RequestInit);

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();
        
        // 检查后端返回的数据格式 - PHP后端使用code字段，0表示成功
        if (result.code !== 0) {
            // 后端业务错误，返回具体错误信息，但HTTP状态码为200
            return NextResponse.json({
                success: false,
                message: result.msg || result.message || `保存失败，错误代码: ${result.code}`,
                error: result.msg || result.message || `错误代码: ${result.code}`,
            });
        }

        console.log('配置保存成功:', result);
        
        // 返回成功响应，使用后端返回的消息
        return NextResponse.json({
            success: true,
            message: result.msg || result.message || `活动ID ${activityId} 的配置保存成功`,
            msg: result.msg, // 保留原始的msg字段
            data: result.data || result,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('保存配置时出错:', error);
        // return NextResponse.json(
        //     {
        //         success: false,
        //         message: '保存配置失败',
        //         error: error instanceof Error ? error.message : '未知错误',
        //     },
        //     { status: 500 },
        // );
        return new Response(
            JSON.stringify({
                success: false,
                message: '保存配置失败',
                error: error instanceof Error ? error.message : '未知错误',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}