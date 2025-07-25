import { NextRequest, NextResponse } from 'next/server';
import { buildApiUrl } from '../../../../config/environment';

export async function POST(request: NextRequest) {
    try {
        // 从请求体中获取配置数据和活动ID
        const body = await request.json();
        const { activityId, actConfig } = body;
        
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

        // 构建API URL并添加活动ID参数
        const apiUrl = buildApiUrl('saveUniversalConfig') + `&act_id=${activityId}`;
        console.log('正在调用保存配置API:', apiUrl);
        console.log('保存的配置数据:', actConfig);

        // 使用FormData格式发送数据
        const formData = new FormData();
        formData.append('act_config', encodeURIComponent(JSON.stringify(actConfig)));
        
        console.log('使用FormData格式发送数据，参数名: actConfig');

        const backendResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            mode: 'cors',
            credentials: 'include',
            body: formData,
        } as RequestInit);

        if (!backendResponse.ok) {
            throw new Error(`后端API调用失败: ${backendResponse.status} ${backendResponse.statusText}`);
        }

        const result = await backendResponse.json();
        
        // 检查后端返回的数据格式
        if (result.success === false) {
            throw new Error(result.message || '后端返回错误');
        }

        console.log('配置保存成功:', result);
        
        // 返回成功响应
        return NextResponse.json({
            success: true,
            message: `活动ID ${activityId} 的配置保存成功`,
            data: result,
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